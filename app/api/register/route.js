// File: app/api/register/route.js
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const body = await req.json();
        const { nama_lengkap, username, email, password } = body;

        if (!username || !email || !password || !nama_lengkap) {
            return new NextResponse('Data tidak lengkap', { status: 400 });
        }

        const hashedPassword = await hash(password, 12);
        const role = 'viewer';

        const newUser = await db.insert(users).values({
            namaLengkap: nama_lengkap,
            username: username,
            email: email,
            password: hashedPassword,
            role: role,
        }).returning({ id: users.id });

        return NextResponse.json({
            success: true,
            message: 'Registrasi berhasil',
            user: newUser[0]
        });

    } catch (error) {
        console.error('[REGISTER_ERROR]', error);

        if (error.code === '23505') {
            return new NextResponse('Username atau Email sudah terdaftar', { status: 409 });
        }

        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
