// File: app/api/uttp/route.js
import { db } from '@/lib/db';
import { dataUttp, activityLog } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { desc, ilike, or, sql } from 'drizzle-orm';

// GET: Ambil semua data UTTP dengan search, filter, dan pagination
export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const kecamatan = searchParams.get('kecamatan') || '';
        const jenisUttp = searchParams.get('jenis_uttp') || '';
        const offset = (page - 1) * limit;

        // Build conditions
        const conditions = [];
        if (search) {
            conditions.push(
                or(
                    ilike(dataUttp.namaPemilik, `%${search}%`),
                    ilike(dataUttp.emailPemilik, `%${search}%`),
                    ilike(dataUttp.nomorTelepon, `%${search}%`),
                    ilike(dataUttp.namaPasar, `%${search}%`),
                    ilike(dataUttp.noSeri, `%${search}%`),
                    ilike(dataUttp.noOrder, `%${search}%`),
                    ilike(dataUttp.merek, `%${search}%`)
                )
            );
        }
        if (kecamatan) {
            conditions.push(ilike(dataUttp.alamatUttp, kecamatan));
        }
        if (jenisUttp) {
            conditions.push(ilike(dataUttp.jenisUttp, jenisUttp));
        }

        // Query with conditions
        let query = db.select().from(dataUttp);
        let countQuery = db.select({ count: sql`count(*)` }).from(dataUttp);

        if (conditions.length > 0) {
            const combined = conditions.length === 1 ? conditions[0] : sql`${conditions.map((c, i) => i === 0 ? c : sql` AND ${c}`)}`;
            // Use raw sql for multiple conditions
            if (conditions.length === 1) {
                query = query.where(conditions[0]);
                countQuery = countQuery.where(conditions[0]);
            } else {
                const andCondition = sql`${sql.join(conditions, sql` AND `)}`;
                query = query.where(andCondition);
                countQuery = countQuery.where(andCondition);
            }
        }

        const data = await query
            .orderBy(desc(dataUttp.createdAt))
            .limit(limit)
            .offset(offset);

        const totalResult = await countQuery;
        const total = parseInt(totalResult[0]?.count || '0');

        return NextResponse.json({
            success: true,
            data: data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        });

    } catch (error) {
        console.error('[UTTP_GET_ERROR]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// POST: Simpan data UTTP baru dengan upload foto ke Supabase Storage
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const formData = await req.formData();
        const namaPemilik = formData.get('nama_pemilik');
        const emailPemilik = formData.get('email_pemilik');
        const nomorTelepon = formData.get('nomor_telepon');
        const alamatUttp = formData.get('alamat_uttp');
        const namaPasar = formData.get('nama_pasar');
        const latitude = formData.get('latitude');
        const longitude = formData.get('longitude');
        const uttpDetails = JSON.parse(formData.get('uttp_details'));

        const savedUttps = [];
        for (let i = 0; i < uttpDetails.length; i++) {
            const detail = uttpDetails[i];
            const fotoFile = formData.get(`foto_alat_${i}`);

            let fotoUrl = '';
            if (fotoFile && fotoFile.size > 0) {
                const bytes = await fotoFile.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const fileExt = fotoFile.name.split('.').pop();
                const filename = `uttp_${Date.now()}_${i}.${fileExt}`;
                const filePath = `uttp/${filename}`;

                // Upload ke Supabase Storage
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('foto-alat')
                    .upload(filePath, buffer, {
                        contentType: fotoFile.type,
                        upsert: false,
                    });

                if (uploadError) {
                    console.error('[UPLOAD_ERROR]', uploadError);
                } else {
                    // Dapatkan public URL
                    const { data: urlData } = supabase.storage
                        .from('foto-alat')
                        .getPublicUrl(filePath);
                    fotoUrl = urlData.publicUrl;
                }
            }

            const newUttp = await db.insert(dataUttp).values({
                userId: parseInt(session.user.id),
                namaPemilik: namaPemilik,
                emailPemilik: emailPemilik,
                nomorTelepon: nomorTelepon,
                alamatUttp: alamatUttp,
                namaPasar: namaPasar,
                latitude: latitude,
                longitude: longitude,
                jenisUttp: detail.jenis_uttp,
                merek: detail.merek,
                tipe: detail.tipe,
                kapasitas: detail.kapasitas,
                dayaBaca: detail.daya_baca,
                kelas: detail.kelas,
                hasilTera: detail.hasil_tera,
                tglTera: detail.tgl_tera,
                tglHabisBerlaku: detail.tgl_habis_berlaku,
                noSeri: detail.no_seri,
                noOrder: detail.no_order,
                fotoAlatUrl: fotoUrl,
            }).returning();

            savedUttps.push(newUttp[0]);

            // Catat log aktivitas CREATE
            await db.insert(activityLog).values({
                userId: parseInt(session.user.id),
                userName: session.user.namaLengkap || session.user.username,
                action: 'CREATE',
                targetTable: 'data_uttp',
                targetId: newUttp[0].id,
                targetSummary: JSON.stringify({
                    namaPemilik: namaPemilik,
                    jenisUttp: detail.jenis_uttp,
                    merek: detail.merek,
                    noSeri: detail.no_seri
                }),
                ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '',
            });
        }

        return NextResponse.json({
            success: true,
            message: `${savedUttps.length} UTTP berhasil disimpan`,
            data: savedUttps
        });

    } catch (error) {
        console.error('[UTTP_POST_ERROR]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// DELETE: Hapus data UTTP (Hanya Admin)
export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (session.user.role !== 'admin') {
            return new NextResponse('Forbidden: Hanya admin yang dapat menghapus data', { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = parseInt(searchParams.get('id'));

        if (!id) {
            return new NextResponse('ID tidak ditemukan', { status: 400 });
        }

        // Ambil data sebelum dihapus untuk log
        const existingData = await db.query.dataUttp.findFirst({
            where: (dataUttp, { eq }) => eq(dataUttp.id, id)
        });

        if (!existingData) {
            return new NextResponse('Data tidak ditemukan', { status: 404 });
        }

        // Hapus foto dari Supabase Storage jika ada
        if (existingData.fotoAlatUrl) {
            try {
                const urlParts = existingData.fotoAlatUrl.split('/');
                const filename = urlParts[urlParts.length - 1];
                if (filename) {
                    await supabase.storage.from('foto-alat').remove([`uttp/${filename}`]);
                }
            } catch (err) {
                console.error('[DELETE_FOTO_ERROR]', err);
            }
        }

        // Hapus record dari database
        await db.delete(dataUttp).where(sql`id = ${id}`);

        // Catat log aktivitas DELETE
        await db.insert(activityLog).values({
            userId: parseInt(session.user.id),
            userName: session.user.namaLengkap || session.user.email,
            action: 'DELETE',
            targetTable: 'data_uttp',
            targetId: existingData.id,
            targetSummary: JSON.stringify({
                namaPemilik: existingData.namaPemilik,
                jenisUttp: existingData.jenisUttp,
                merek: existingData.merek,
                noSeri: existingData.noSeri,
                dihapusPada: new Date().toISOString()
            }),
            ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '',
        });

        return NextResponse.json({
            success: true,
            message: 'Data UTTP berhasil dihapus'
        });

    } catch (error) {
        console.error('[UTTP_DELETE_ERROR]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
