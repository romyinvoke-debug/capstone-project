// File: app/api/export/excel/route.js
import { db } from '@/lib/db';
import { dataUttp } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ilike, sql } from 'drizzle-orm';
import ExcelJS from 'exceljs';

const BULAN_INDO = [
    '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const QUARTER_MAP = {
    Q1: [1, 2, 3],
    Q2: [4, 5, 6],
    Q3: [7, 8, 9],
    Q4: [10, 11, 12],
};

const QUARTER_LABELS = [
    { key: 'TW I', months: [1, 2, 3] },
    { key: 'TW II', months: [4, 5, 6] },
    { key: 'TW III', months: [7, 8, 9] },
    { key: 'TW IV', months: [10, 11, 12] },
];

function sanitizeSheetName(name) {
    // Excel sheet names: max 31 chars, no \ / ? * [ ] :
    let clean = name.replace(/[\\/?*[\]:]/g, '').trim();
    return clean.substring(0, 31) || 'Sheet';
}

function getMonthFromDate(dateStr) {
    if (!dateStr) return null;
    try {
        // Format: "YYYY-MM-DD" or ISO string
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return null;
        return d.getMonth() + 1; // 1-12
    } catch {
        return null;
    }
}

function isValidPasar(namaPasar) {
    if (!namaPasar) return false;
    const trimmed = namaPasar.trim();
    return trimmed !== '' && trimmed !== '-' && trimmed.toLowerCase() !== 'null';
}

function applyHeaderStyle(row) {
    row.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFF00' },
        };
        cell.font = { bold: true, size: 10 };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
    });
}

function applyDataRowBorder(row) {
    row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle', wrapText: true };
    });
}

function addQuarterBanner(sheet, label, colCount) {
    const bannerRow = sheet.addRow([label]);
    sheet.mergeCells(bannerRow.number, 1, bannerRow.number, colCount);
    const cell = bannerRow.getCell(1);
    cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9EAD3' },
    };
    cell.font = { bold: true, size: 11 };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
    };
    return bannerRow;
}

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const tahun = parseInt(searchParams.get('tahun') || new Date().getFullYear().toString());
        const bulanParam = searchParams.get('bulan') || '';
        const kecamatanParam = searchParams.get('kecamatan') || '';
        const jenisUttpParam = searchParams.get('jenis_uttp') || '';

        // Build query conditions
        const conditions = [];
        if (kecamatanParam) {
            conditions.push(ilike(dataUttp.alamatUttp, kecamatanParam));
        }
        if (jenisUttpParam) {
            conditions.push(ilike(dataUttp.jenisUttp, jenisUttpParam));
        }

        // Execute query
        let query = db.select().from(dataUttp);
        if (conditions.length === 1) {
            query = query.where(conditions[0]);
        } else if (conditions.length > 1) {
            query = query.where(sql`${sql.join(conditions, sql` AND `)}`);
        }

        const allData = await query;

        // Filter by year and month/quarter in JS (since tgl_tera is varchar)
        let allowedMonths = null;
        if (bulanParam) {
            if (QUARTER_MAP[bulanParam.toUpperCase()]) {
                allowedMonths = QUARTER_MAP[bulanParam.toUpperCase()];
            } else {
                const m = parseInt(bulanParam);
                if (m >= 1 && m <= 12) {
                    allowedMonths = [m];
                }
            }
        }

        const filteredData = allData.filter((row) => {
            if (!row.tglTera) return false;
            const d = new Date(row.tglTera);
            if (isNaN(d.getTime())) return false;
            if (d.getFullYear() !== tahun) return false;
            if (allowedMonths && !allowedMonths.includes(d.getMonth() + 1)) return false;
            return true;
        });

        // Group data by quarter and month
        const dataByQuarter = {};
        for (const q of QUARTER_LABELS) {
            dataByQuarter[q.key] = [];
        }

        for (const row of filteredData) {
            const month = getMonthFromDate(row.tglTera);
            if (!month) continue;
            for (const q of QUARTER_LABELS) {
                if (q.months.includes(month)) {
                    dataByQuarter[q.key].push({ ...row, _month: month });
                    break;
                }
            }
        }

        // ==================== BUILD WORKBOOK ====================
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'SIMETRI';
        workbook.created = new Date();

        // ---- Main Sheet: Rekapitulasi UTTP ----
        const mainSheet = workbook.addWorksheet('Rekapitulasi UTTP');
        const COL_COUNT = 10;

        // Set column widths
        mainSheet.columns = [
            { width: 5 },   // No
            { width: 30 },  // Perusahaan/Pemilik
            { width: 14 },  // Bulan
            { width: 8 },   // Jumlah
            { width: 10 },  // Satuan
            { width: 22 },  // Kapasitas & Daya Baca
            { width: 16 },  // UTTP
            { width: 18 },  // Masa Berlaku
            { width: 14 },  // Peta
            { width: 18 },  // Keterangan
        ];

        // Title row (Row 1)
        const titleRow = mainSheet.addRow([`REKAPITULASI TERA TERA ULANG PERUSAHAAN DAN PASAR TAHUN ${tahun}`]);
        mainSheet.mergeCells('A1:J1');
        const titleCell = titleRow.getCell(1);
        titleCell.font = { bold: true, size: 14 };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

        // Empty row (Row 2)
        mainSheet.addRow([]);

        // Header row (Row 3)
        const headerValues = [
            'No', 'Perusahaan/Pemilik UTTP', 'Bulan', 'Jumlah', 'Satuan',
            'Kapasitas & Daya Baca', 'UTTP', 'Masa Berlaku', 'Peta', 'Keterangan'
        ];
        const headerRow = mainSheet.addRow(headerValues);
        applyHeaderStyle(headerRow);

        // Track pasar data for separate sheets
        const pasarDataMap = {}; // key: pasarName, value: array of rows

        let globalNo = 1;

        for (const quarter of QUARTER_LABELS) {
            const qData = dataByQuarter[quarter.key];

            // Add quarter banner
            addQuarterBanner(mainSheet, quarter.key, COL_COUNT);

            if (qData.length === 0) {
                const emptyRow = mainSheet.addRow(['', 'Tidak ada data', '', '', '', '', '', '', '', '']);
                emptyRow.getCell(2).font = { italic: true, color: { argb: 'FF999999' } };
                continue;
            }

            // Separate pasar vs non-pasar rows
            const nonPasarRows = qData.filter(r => !isValidPasar(r.namaPasar));
            const pasarRows = qData.filter(r => isValidPasar(r.namaPasar));

            // Group pasar rows by nama_pasar
            const pasarGroups = {};
            for (const row of pasarRows) {
                const key = row.namaPasar.trim();
                if (!pasarGroups[key]) pasarGroups[key] = [];
                pasarGroups[key].push(row);
            }

            // Write non-pasar rows individually
            for (const row of nonPasarRows) {
                const month = getMonthFromDate(row.tglTera);
                const masaBerlaku = row.tglHabisBerlaku
                    ? new Date(row.tglHabisBerlaku).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
                    : '-';

                const kapDayaBaca = [row.kapasitas, row.dayaBaca].filter(Boolean).join(' / ') || '-';

                const dataRow = mainSheet.addRow([
                    globalNo++,
                    row.namaPemilik || '-',
                    month ? BULAN_INDO[month] : '-',
                    1,
                    'Unit',
                    kapDayaBaca,
                    row.jenisUttp || '-',
                    masaBerlaku,
                    '', // Peta - will add hyperlink
                    row.hasilTera || '-',
                ]);

                applyDataRowBorder(dataRow);

                // Add Google Maps hyperlink
                if (row.latitude && row.longitude) {
                    const petaCell = dataRow.getCell(9);
                    const url = `https://www.google.com/maps?q=${row.latitude},${row.longitude}`;
                    petaCell.value = { text: 'Lihat Peta', hyperlink: url };
                    petaCell.font = { color: { argb: 'FF0563C1' }, underline: true, size: 10 };
                }
            }

            // Write consolidated pasar rows
            for (const [pasarName, rows] of Object.entries(pasarGroups)) {
                const month = getMonthFromDate(rows[0].tglTera);
                const firstRow = rows[0];

                // Collect into pasarDataMap for detail sheets
                if (!pasarDataMap[pasarName]) pasarDataMap[pasarName] = [];
                pasarDataMap[pasarName].push(...rows);

                const dataRow = mainSheet.addRow([
                    globalNo++,
                    `Pasar ${pasarName}`,
                    month ? BULAN_INDO[month] : '-',
                    rows.length,
                    'Unit',
                    `(Lihat Tab "${sanitizeSheetName(pasarName)}")`,
                    rows.map(r => r.jenisUttp).filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(', ') || '-',
                    '-',
                    '', // Peta
                    `Detail: ${rows.length} alat`,
                ]);

                applyDataRowBorder(dataRow);

                // Add Google Maps hyperlink from first row with coordinates
                const rowWithCoords = rows.find(r => r.latitude && r.longitude);
                if (rowWithCoords) {
                    const petaCell = dataRow.getCell(9);
                    const url = `https://www.google.com/maps?q=${rowWithCoords.latitude},${rowWithCoords.longitude}`;
                    petaCell.value = { text: 'Lihat Peta', hyperlink: url };
                    petaCell.font = { color: { argb: 'FF0563C1' }, underline: true, size: 10 };
                }
            }
        }

        // ---- Detail Sheets for each Pasar ----
        for (const [pasarName, rows] of Object.entries(pasarDataMap)) {
            const sheetName = sanitizeSheetName(pasarName);
            const pasarSheet = workbook.addWorksheet(sheetName);

            pasarSheet.columns = [
                { width: 5 },   // No
                { width: 28 },  // Nama Pemilik
                { width: 14 },  // Jumlah UTTP
                { width: 18 },  // Jenis UTTP
                { width: 24 },  // Kapasitas / Daya Baca
                { width: 14 },  // Hasil Tera
            ];

            // Title
            const pasarTitleRow = pasarSheet.addRow([`Detail Data UTTP - Pasar ${pasarName}`]);
            pasarSheet.mergeCells('A1:F1');
            pasarTitleRow.getCell(1).font = { bold: true, size: 13 };
            pasarTitleRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };

            // Empty row
            pasarSheet.addRow([]);

            // Header
            const pasarHeaderValues = ['No', 'Nama Pemilik', 'Jumlah UTTP', 'Jenis UTTP', 'Kapasitas / Daya Baca', 'Hasil Tera'];
            const pasarHeaderRow = pasarSheet.addRow(pasarHeaderValues);
            applyHeaderStyle(pasarHeaderRow);

            // Data rows
            let pasarNo = 1;
            let totalSah = 0;
            let totalBatal = 0;

            for (const row of rows) {
                const kapDayaBaca = [row.kapasitas, row.dayaBaca].filter(Boolean).join(' / ') || '-';
                const hasilTera = row.hasilTera || '-';

                if (hasilTera.toLowerCase() === 'sah') totalSah++;
                else if (hasilTera.toLowerCase() === 'tidak sah' || hasilTera.toLowerCase() === 'batal tera') totalBatal++;

                const dr = pasarSheet.addRow([
                    pasarNo++,
                    row.namaPemilik || '-',
                    1,
                    row.jenisUttp || '-',
                    kapDayaBaca,
                    hasilTera,
                ]);
                applyDataRowBorder(dr);
            }

            // Summary rows
            pasarSheet.addRow([]); // empty separator
            const summaryData = [
                ['', 'Total Sah', totalSah, '', '', ''],
                ['', 'Total Batal / Tidak Sah', totalBatal, '', '', ''],
                ['', 'Total UTTP', rows.length, '', '', ''],
            ];

            for (const sd of summaryData) {
                const sr = pasarSheet.addRow(sd);
                sr.getCell(2).font = { bold: true, size: 10 };
                sr.getCell(3).font = { bold: true, size: 10 };
                sr.getCell(2).alignment = { vertical: 'middle' };
                sr.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };
                sr.getCell(2).border = { bottom: { style: 'thin' } };
                sr.getCell(3).border = { bottom: { style: 'thin' } };
            }
        }

        // ==================== GENERATE BUFFER ====================
        const buffer = await workbook.xlsx.writeBuffer();
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const filename = `Laporan_Rekapitulasi_UTTP_${today}.xlsx`;

        return new Response(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error('[EXPORT_EXCEL_ERROR]', error);
        return new Response(JSON.stringify({ error: 'Gagal mengekspor data', detail: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
