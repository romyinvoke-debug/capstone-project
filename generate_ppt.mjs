import pptxgen from 'pptxgenjs';
import fs from 'fs';

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 inches
pptx.author = 'Kelompok B-Squad';
pptx.title = 'Presentasi Capstone Project - SIMETRI';

// ============ COLOR PALETTE ============
const COLORS = {
    primary: '1E3A5F',      // dark navy
    secondary: '2563EB',    // blue
    accent: '10B981',       // emerald
    dark: '1F2937',         // gray-800
    medium: '4B5563',       // gray-600
    light: 'F3F4F6',        // gray-100
    white: 'FFFFFF',
    gradientStart: '1E3A5F',
    gradientEnd: '3B82F6',
    orange: 'F59E0B',
    red: 'EF4444',
    purple: '8B5CF6',
};

// ============ HELPER FUNCTIONS ============
function addSlideNumber(slide, num, total) {
    slide.addText(`${num} / ${total}`, {
        x: 12.0, y: 7.0, w: 1.2, h: 0.4,
        fontSize: 9, color: '9CA3AF', align: 'right',
    });
}

function addFooter(slide) {
    slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 7.1, w: 13.33, h: 0.4,
        fill: { color: COLORS.primary },
    });
    slide.addText('SIMETRI — Sistem Informasi Metrologi Legal  |  Capstone Project UT', {
        x: 0.5, y: 7.1, w: 12, h: 0.4,
        fontSize: 8, color: 'C8D6E5', fontFace: 'Calibri',
    });
}

function addSectionHeader(slide, title, subtitle) {
    // Top accent bar
    slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: 13.33, h: 0.08,
        fill: { color: COLORS.accent },
    });
    // Left accent bar
    slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: 0.08, h: 7.5,
        fill: { color: COLORS.secondary },
    });
    // Title background
    slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0.3, w: 13.33, h: 1.2,
        fill: { color: COLORS.primary },
    });
    slide.addText(title, {
        x: 0.8, y: 0.35, w: 11, h: 0.7,
        fontSize: 28, bold: true, color: COLORS.white, fontFace: 'Calibri',
    });
    if (subtitle) {
        slide.addText(subtitle, {
            x: 0.8, y: 1.0, w: 11, h: 0.45,
            fontSize: 14, color: 'B8CCE0', fontFace: 'Calibri',
        });
    }
}

const TOTAL_SLIDES = 11;

// =====================================================
// SLIDE 1: COVER / TITLE SLIDE
// =====================================================
{
    const slide = pptx.addSlide();
    // Full background
    slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: 13.33, h: 7.5,
        fill: { color: COLORS.primary },
    });
    // Accent stripe
    slide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 3.0, w: 13.33, h: 0.06,
        fill: { color: COLORS.accent },
    });
    // University label
    slide.addText('UNIVERSITAS TERBUKA', {
        x: 0, y: 0.6, w: 13.33, h: 0.5,
        fontSize: 14, color: 'C8D6E5', align: 'center', fontFace: 'Calibri', letterSpacing: 5,
    });
    slide.addText('Capstone Project — Fakultas Sains dan Teknologi', {
        x: 0, y: 1.05, w: 13.33, h: 0.4,
        fontSize: 12, color: 'A0B4C8', align: 'center', fontFace: 'Calibri',
    });
    // Main title
    slide.addText('SIMETRI', {
        x: 0, y: 2.0, w: 13.33, h: 0.9,
        fontSize: 52, bold: true, color: COLORS.white, align: 'center', fontFace: 'Calibri',
    });
    // Subtitle
    slide.addText('Sistem Informasi Metrologi Legal Berbasis Web\nuntuk Pengelolaan dan Rekapitulasi Data UTTP', {
        x: 1.5, y: 3.2, w: 10.33, h: 1.0,
        fontSize: 18, color: 'D6E4F0', align: 'center', fontFace: 'Calibri', lineSpacingMultiple: 1.3,
    });
    // Dinas context
    slide.addText('Studi Kasus: Dinas Perdagangan Kabupaten Nunukan, Kalimantan Utara', {
        x: 1.5, y: 4.3, w: 10.33, h: 0.4,
        fontSize: 12, color: 'B0C4D8', align: 'center', italic: true, fontFace: 'Calibri',
    });
    // Team info box
    slide.addShape(pptx.ShapeType.rect, {
        x: 3.5, y: 5.2, w: 6.33, h: 1.6,
        fill: { color: '1E3A5F' },
        line: { color: COLORS.accent, width: 1 },
        rectRadius: 0.1,
    });
    slide.addText('Kelompok B-Squad', {
        x: 3.5, y: 5.25, w: 6.33, h: 0.4,
        fontSize: 12, bold: true, color: COLORS.accent, align: 'center', fontFace: 'Calibri',
    });
    slide.addText([
        { text: '1. Romi Pratama   •   2. Selvi   •   3. Faisal\n', options: { fontSize: 10, color: 'D6E4F0' } },
        { text: '4. Fatih Dinda   •   5. [Anggota 5]', options: { fontSize: 10, color: 'D6E4F0' } },
    ], {
        x: 3.5, y: 5.65, w: 6.33, h: 0.8,
        align: 'center', fontFace: 'Calibri', lineSpacingMultiple: 1.4,
    });
    // Year
    slide.addText('2026', {
        x: 0, y: 6.9, w: 13.33, h: 0.4,
        fontSize: 11, color: '8899AA', align: 'center', fontFace: 'Calibri',
    });
}

// =====================================================
// SLIDE 2: LATAR BELAKANG & PERMASALAHAN
// =====================================================
{
    const slide = pptx.addSlide();
    addSectionHeader(slide, 'Latar Belakang & Permasalahan', 'Mengapa SIMETRI dibutuhkan?');
    addFooter(slide);
    addSlideNumber(slide, 2, TOTAL_SLIDES);

    const problems = [
        { icon: '📋', title: 'Pencatatan Manual', desc: 'Data UTTP masih dicatat di buku fisik → rawan hilang, sulit dicari, dan tidak terstandarisasi.' },
        { icon: '⏰', title: 'Monitoring Masa Berlaku Sulit', desc: 'Tanggal tera ulang tidak terpantau → alat kedaluwarsa tetap digunakan oleh pedagang di pasar.' },
        { icon: '📊', title: 'Laporan Rekapitulasi Lambat', desc: 'Pembuatan laporan triwulanan masih dilakukan manual dengan Microsoft Excel → memakan waktu dan rawan salah ketik.' },
        { icon: '🗺️', title: 'Tidak Ada Pemetaan Lokasi', desc: 'Sebaran lokasi UTTP tidak terdokumentasi secara geospasial → kesulitan perencanaan operasi tera.' },
    ];

    problems.forEach((p, i) => {
        const y = 1.8 + (i * 1.25);
        // Card background
        slide.addShape(pptx.ShapeType.rect, {
            x: 0.8, y, w: 11.7, h: 1.05,
            fill: { color: i % 2 === 0 ? 'F8FAFC' : COLORS.white },
            line: { color: 'E2E8F0', width: 0.5 },
            rectRadius: 0.08,
        });
        // Left accent
        slide.addShape(pptx.ShapeType.rect, {
            x: 0.8, y, w: 0.06, h: 1.05,
            fill: { color: i < 2 ? COLORS.red : COLORS.orange },
        });
        slide.addText(p.icon, { x: 1.1, y, w: 0.6, h: 1.05, fontSize: 22, align: 'center', valign: 'middle' });
        slide.addText(p.title, { x: 1.8, y: y + 0.08, w: 10, h: 0.4, fontSize: 14, bold: true, color: COLORS.dark, fontFace: 'Calibri' });
        slide.addText(p.desc, { x: 1.8, y: y + 0.48, w: 10, h: 0.45, fontSize: 11, color: COLORS.medium, fontFace: 'Calibri' });
    });

    slide.addText('💡 Dibutuhkan sistem informasi berbasis web yang terintegrasi untuk mendigitalisasi seluruh proses pengelolaan data UTTP.', {
        x: 0.8, y: 6.5, w: 11.7, h: 0.45,
        fontSize: 11, italic: true, color: COLORS.secondary, fontFace: 'Calibri',
        fill: { color: 'EFF6FF' }, rectRadius: 0.05,
    });
}

// =====================================================
// SLIDE 3: RUMUSAN MASALAH & TUJUAN
// =====================================================
{
    const slide = pptx.addSlide();
    addSectionHeader(slide, 'Rumusan Masalah & Tujuan Proyek');
    addFooter(slide);
    addSlideNumber(slide, 3, TOTAL_SLIDES);

    // Left column - Rumusan Masalah
    slide.addShape(pptx.ShapeType.rect, {
        x: 0.5, y: 1.8, w: 5.9, h: 5.0,
        fill: { color: 'FEF3C7' }, line: { color: 'FCD34D', width: 0.5 }, rectRadius: 0.1,
    });
    slide.addText('❓ Rumusan Masalah', {
        x: 0.7, y: 1.9, w: 5.5, h: 0.45,
        fontSize: 15, bold: true, color: COLORS.dark, fontFace: 'Calibri',
    });
    const rumusan = [
        'Bagaimana merancang sistem informasi berbasis web yang mampu mendigitalisasi pencatatan data UTTP?',
        'Bagaimana menerapkan sistem Role-Based Access Control (RBAC) agar hanya petugas berwenang yang dapat menginput dan mengelola data?',
        'Bagaimana menghasilkan laporan rekapitulasi tera/tera ulang secara otomatis per triwulan dalam format Excel?',
    ];
    rumusan.forEach((r, i) => {
        slide.addText(`${i + 1}. ${r}`, {
            x: 0.9, y: 2.5 + (i * 1.25), w: 5.2, h: 1.1,
            fontSize: 10.5, color: COLORS.dark, fontFace: 'Calibri', lineSpacingMultiple: 1.25, valign: 'top',
        });
    });

    // Right column - Tujuan
    slide.addShape(pptx.ShapeType.rect, {
        x: 6.9, y: 1.8, w: 5.9, h: 5.0,
        fill: { color: 'ECFDF5' }, line: { color: '6EE7B7', width: 0.5 }, rectRadius: 0.1,
    });
    slide.addText('🎯 Tujuan Proyek', {
        x: 7.1, y: 1.9, w: 5.5, h: 0.45,
        fontSize: 15, bold: true, color: COLORS.dark, fontFace: 'Calibri',
    });
    const tujuan = [
        'Membangun aplikasi web SIMETRI untuk pencatatan dan pengelolaan data alat UTTP secara digital.',
        'Menerapkan autentikasi aman dan pembagian hak akses Admin/Viewer menggunakan NextAuth.js.',
        'Menyediakan fitur ekspor laporan rekapitulasi UTTP ke Excel (.xlsx) yang terstruktur per triwulan.',
        'Mengintegrasikan fitur geolokasi dan pemetaan lokasi alat UTTP berbasis koordinat GPS.',
    ];
    tujuan.forEach((t, i) => {
        slide.addText(`${i + 1}. ${t}`, {
            x: 7.1, y: 2.5 + (i * 1.1), w: 5.4, h: 1.0,
            fontSize: 10.5, color: COLORS.dark, fontFace: 'Calibri', lineSpacingMultiple: 1.25, valign: 'top',
        });
    });
}

// =====================================================
// SLIDE 4: METODOLOGI PENGEMBANGAN
// =====================================================
{
    const slide = pptx.addSlide();
    addSectionHeader(slide, 'Metodologi Pengembangan', 'Agile Development — Iterative & Incremental');
    addFooter(slide);
    addSlideNumber(slide, 4, TOTAL_SLIDES);

    const phases = [
        { label: 'Analisis\nKebutuhan', color: '3B82F6', desc: 'Identifikasi masalah,\nanalisis kebutuhan\npengguna & sistem' },
        { label: 'Perancangan\nSistem', color: '8B5CF6', desc: 'ERD, wireframe UI,\narsitektur teknologi,\npembagian tugas' },
        { label: 'Implementasi\n& Coding', color: '10B981', desc: 'Pengembangan frontend\n& backend, integrasi\ndatabase & API' },
        { label: 'Pengujian\n(Testing)', color: 'F59E0B', desc: 'Black-box testing,\nUAT, validasi fitur\ndan responsivitas' },
        { label: 'Deployment\n& Evaluasi', color: 'EF4444', desc: 'Deploy ke Vercel,\nmonitoring, perbaikan\nbug & optimasi' },
    ];

    phases.forEach((p, i) => {
        const x = 0.6 + (i * 2.55);
        // Circle
        slide.addShape(pptx.ShapeType.ellipse, {
            x: x + 0.5, y: 2.2, w: 1.6, h: 1.6,
            fill: { color: p.color }, shadow: { type: 'outer', blur: 4, offset: 2, color: '999999' },
        });
        slide.addText(p.label, {
            x: x + 0.5, y: 2.35, w: 1.6, h: 1.4,
            fontSize: 10, bold: true, color: COLORS.white, align: 'center', valign: 'middle', fontFace: 'Calibri',
        });
        // Arrow between circles
        if (i < phases.length - 1) {
            slide.addText('→', {
                x: x + 2.1, y: 2.65, w: 0.5, h: 0.5,
                fontSize: 22, color: '9CA3AF', align: 'center',
            });
        }
        // Description
        slide.addText(p.desc, {
            x: x + 0.2, y: 4.1, w: 2.2, h: 1.2,
            fontSize: 9.5, color: COLORS.medium, align: 'center', fontFace: 'Calibri', lineSpacingMultiple: 1.3,
        });
    });

    // Tools used row
    slide.addShape(pptx.ShapeType.rect, {
        x: 0.5, y: 5.7, w: 12.3, h: 1.1,
        fill: { color: 'F1F5F9' }, rectRadius: 0.08,
    });
    slide.addText('Tools Kolaborasi:', {
        x: 0.8, y: 5.75, w: 3, h: 0.4,
        fontSize: 11, bold: true, color: COLORS.dark, fontFace: 'Calibri',
    });
    slide.addText('GitHub (Version Control)   •   Google Meet / Discord (Koordinasi)   •   VS Code + Cursor (IDE)   •   Vercel (CI/CD)   •   Supabase (BaaS)', {
        x: 0.8, y: 6.15, w: 11.5, h: 0.5,
        fontSize: 10, color: COLORS.medium, fontFace: 'Calibri',
    });
}

// =====================================================
// SLIDE 5: ARSITEKTUR & TEKNOLOGI
// =====================================================
{
    const slide = pptx.addSlide();
    addSectionHeader(slide, 'Arsitektur Sistem & Stack Teknologi', 'Modern Full-Stack Web Architecture');
    addFooter(slide);
    addSlideNumber(slide, 5, TOTAL_SLIDES);

    // Architecture diagram (simplified with boxes and arrows)
    const layers = [
        { label: '👤 Client\n(Browser)', x: 0.5, y: 2.0, w: 2.3, h: 1.2, color: '3B82F6' },
        { label: '⚡ Next.js 14\nApp Router\n(Frontend + API Routes)', x: 3.5, y: 1.8, w: 2.8, h: 1.6, color: '1E3A5F' },
        { label: '🗄️ PostgreSQL\n(Supabase)', x: 7.0, y: 1.8, w: 2.3, h: 1.2, color: '10B981' },
        { label: '📁 Supabase\nStorage\n(Foto Alat)', x: 7.0, y: 3.3, w: 2.3, h: 1.2, color: '8B5CF6' },
        { label: '🌐 Vercel\nCloud Hosting', x: 10.0, y: 2.0, w: 2.3, h: 1.2, color: 'EF4444' },
    ];

    layers.forEach(l => {
        slide.addShape(pptx.ShapeType.rect, {
            x: l.x, y: l.y, w: l.w, h: l.h,
            fill: { color: l.color }, rectRadius: 0.1,
            shadow: { type: 'outer', blur: 3, offset: 2, color: 'BBBBBB' },
        });
        slide.addText(l.label, {
            x: l.x, y: l.y, w: l.w, h: l.h,
            fontSize: 10, color: COLORS.white, align: 'center', valign: 'middle', fontFace: 'Calibri', lineSpacingMultiple: 1.2,
        });
    });

    // Arrows
    slide.addText('→', { x: 2.8, y: 2.3, w: 0.7, h: 0.5, fontSize: 20, color: '9CA3AF', align: 'center' });
    slide.addText('→', { x: 6.3, y: 2.1, w: 0.7, h: 0.5, fontSize: 20, color: '9CA3AF', align: 'center' });
    slide.addText('→', { x: 9.3, y: 2.3, w: 0.7, h: 0.5, fontSize: 20, color: '9CA3AF', align: 'center' });

    // Tech stack table
    const stackY = 5.0;
    slide.addShape(pptx.ShapeType.rect, {
        x: 0.5, y: stackY, w: 12.3, h: 1.8,
        fill: { color: 'F8FAFC' }, line: { color: 'E2E8F0', width: 0.5 }, rectRadius: 0.08,
    });

    const techs = [
        { cat: 'Frontend', items: 'Next.js 14, React, Tailwind CSS', color: '3B82F6' },
        { cat: 'Backend', items: 'Next.js API Routes, Drizzle ORM', color: '1E3A5F' },
        { cat: 'Database', items: 'PostgreSQL (Supabase)', color: '10B981' },
        { cat: 'Auth', items: 'NextAuth.js v4 (Credentials)', color: 'F59E0B' },
        { cat: 'Storage', items: 'Supabase Storage (foto-alat)', color: '8B5CF6' },
        { cat: 'Deploy', items: 'Vercel Cloud + GitHub CI/CD', color: 'EF4444' },
    ];

    techs.forEach((t, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 0.7 + (col * 4.1);
        const y = stackY + 0.15 + (row * 0.8);

        slide.addShape(pptx.ShapeType.rect, {
            x, y, w: 0.12, h: 0.55,
            fill: { color: t.color },
        });
        slide.addText(t.cat, {
            x: x + 0.2, y, w: 1.5, h: 0.55,
            fontSize: 9, bold: true, color: COLORS.dark, fontFace: 'Calibri', valign: 'middle',
        });
        slide.addText(t.items, {
            x: x + 1.7, y, w: 2.2, h: 0.55,
            fontSize: 9, color: COLORS.medium, fontFace: 'Calibri', valign: 'middle',
        });
    });
}

// =====================================================
// SLIDE 6: FITUR UTAMA (1) - Auth & RBAC
// =====================================================
{
    const slide = pptx.addSlide();
    addSectionHeader(slide, 'Fitur Utama Sistem (1/3)', 'Autentikasi & Manajemen Hak Akses');
    addFooter(slide);
    addSlideNumber(slide, 6, TOTAL_SLIDES);

    // Auth flow
    slide.addText('🔐 Alur Autentikasi & Role-Based Access Control (RBAC)', {
        x: 0.8, y: 1.8, w: 11, h: 0.4,
        fontSize: 14, bold: true, color: COLORS.dark, fontFace: 'Calibri',
    });

    // Registration flow
    slide.addShape(pptx.ShapeType.rect, { x: 0.8, y: 2.5, w: 2.5, h: 0.8, fill: { color: '3B82F6' }, rectRadius: 0.08 });
    slide.addText('Register\n(Akun Baru)', { x: 0.8, y: 2.5, w: 2.5, h: 0.8, fontSize: 10, color: COLORS.white, align: 'center', valign: 'middle', fontFace: 'Calibri' });

    slide.addText('→', { x: 3.3, y: 2.6, w: 0.5, h: 0.5, fontSize: 18, color: '9CA3AF', align: 'center' });

    slide.addShape(pptx.ShapeType.rect, { x: 3.8, y: 2.5, w: 2.5, h: 0.8, fill: { color: 'F59E0B' }, rectRadius: 0.08 });
    slide.addText('Default: Viewer\n(Read Only)', { x: 3.8, y: 2.5, w: 2.5, h: 0.8, fontSize: 10, color: COLORS.white, align: 'center', valign: 'middle', fontFace: 'Calibri' });

    slide.addText('→', { x: 6.3, y: 2.6, w: 0.5, h: 0.5, fontSize: 18, color: '9CA3AF', align: 'center' });

    slide.addShape(pptx.ShapeType.rect, { x: 6.8, y: 2.5, w: 2.8, h: 0.8, fill: { color: '8B5CF6' }, rectRadius: 0.08 });
    slide.addText('Admin Ubah Role\n(Manual Promote)', { x: 6.8, y: 2.5, w: 2.8, h: 0.8, fontSize: 10, color: COLORS.white, align: 'center', valign: 'middle', fontFace: 'Calibri' });

    slide.addText('→', { x: 9.6, y: 2.6, w: 0.5, h: 0.5, fontSize: 18, color: '9CA3AF', align: 'center' });

    slide.addShape(pptx.ShapeType.rect, { x: 10.1, y: 2.5, w: 2.5, h: 0.8, fill: { color: '10B981' }, rectRadius: 0.08 });
    slide.addText('Admin\n(Full Access)', { x: 10.1, y: 2.5, w: 2.5, h: 0.8, fontSize: 10, color: COLORS.white, align: 'center', valign: 'middle', fontFace: 'Calibri' });

    // Comparison table
    const tableY = 3.8;
    // Table header
    slide.addShape(pptx.ShapeType.rect, { x: 1.5, y: tableY, w: 10.3, h: 0.5, fill: { color: COLORS.primary } });
    slide.addText('Hak Akses', { x: 1.5, y: tableY, w: 3, h: 0.5, fontSize: 10, bold: true, color: COLORS.white, align: 'center', valign: 'middle', fontFace: 'Calibri' });
    slide.addText('👁️ Viewer', { x: 4.5, y: tableY, w: 3.65, h: 0.5, fontSize: 10, bold: true, color: COLORS.white, align: 'center', valign: 'middle', fontFace: 'Calibri' });
    slide.addText('🛡️ Admin', { x: 8.15, y: tableY, w: 3.65, h: 0.5, fontSize: 10, bold: true, color: COLORS.white, align: 'center', valign: 'middle', fontFace: 'Calibri' });

    const accessRows = [
        ['Melihat Data UTTP', '✅ Ya', '✅ Ya'],
        ['Input Data UTTP Baru', '❌ Tidak', '✅ Ya'],
        ['Hapus Data UTTP', '❌ Tidak', '✅ Ya'],
        ['Lihat Riwayat Aktivitas', '❌ Tidak', '✅ Ya'],
        ['Export Excel', '✅ Ya', '✅ Ya'],
    ];

    accessRows.forEach((row, i) => {
        const y = tableY + 0.5 + (i * 0.5);
        const bgColor = i % 2 === 0 ? 'F8FAFC' : COLORS.white;
        slide.addShape(pptx.ShapeType.rect, { x: 1.5, y, w: 10.3, h: 0.5, fill: { color: bgColor }, line: { color: 'E2E8F0', width: 0.3 } });
        slide.addText(row[0], { x: 1.5, y, w: 3, h: 0.5, fontSize: 10, color: COLORS.dark, align: 'center', valign: 'middle', fontFace: 'Calibri' });
        slide.addText(row[1], { x: 4.5, y, w: 3.65, h: 0.5, fontSize: 10, color: COLORS.medium, align: 'center', valign: 'middle', fontFace: 'Calibri' });
        slide.addText(row[2], { x: 8.15, y, w: 3.65, h: 0.5, fontSize: 10, color: COLORS.medium, align: 'center', valign: 'middle', fontFace: 'Calibri' });
    });
}

// =====================================================
// SLIDE 7: FITUR UTAMA (2) - CRUD & Geolokasi
// =====================================================
{
    const slide = pptx.addSlide();
    addSectionHeader(slide, 'Fitur Utama Sistem (2/3)', 'CRUD Data UTTP, GPS & Foto Dokumentasi');
    addFooter(slide);
    addSlideNumber(slide, 7, TOTAL_SLIDES);

    const features = [
        {
            icon: '📝', title: 'Input Data UTTP Multi-Item',
            points: [
                'Form dinamis: tambah beberapa alat UTTP sekaligus dalam satu kali input',
                'Dropdown 10 jenis alat: Timbangan Pegas, Neraca, Dacin, Pompa Ukur BBM, Meteran, dll.',
                'Kolom lengkap: Merek, Tipe, Kelas, Daya Baca, Kapasitas, No. Seri, No. Order',
            ],
        },
        {
            icon: '📍', title: 'Geolokasi & Pemetaan',
            points: [
                'Tangkap koordinat Latitude & Longitude otomatis via browser GPS',
                'Kecamatan diisi dari dropdown 16 kecamatan Kabupaten Nunukan',
                'Hyperlink Google Maps pada hasil ekspor Excel',
            ],
        },
        {
            icon: '📷', title: 'Foto Dokumentasi Alat',
            points: [
                'Upload foto alat UTTP ke Supabase Storage (bucket: foto-alat)',
                'Preview foto langsung di modal detail',
                'Otomatis dihapus dari storage saat data UTTP dihapus (cleanup)',
            ],
        },
        {
            icon: '🔍', title: 'Pencarian & Filter Multi-Kriteria',
            points: [
                'Filter: Tahun, Triwulan (TW I - IV), Kecamatan, dan Jenis UTTP',
                'Pencarian teks: nama pemilik, email, merek, no. seri, no. order',
                'Paginasi otomatis dengan indikator "Filter Aktif"',
            ],
        },
    ];

    features.forEach((f, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 0.5 + (col * 6.4);
        const y = 1.8 + (row * 2.65);

        slide.addShape(pptx.ShapeType.rect, {
            x, y, w: 6.0, h: 2.4,
            fill: { color: COLORS.white }, line: { color: 'E2E8F0', width: 0.5 }, rectRadius: 0.08,
            shadow: { type: 'outer', blur: 3, offset: 1, color: 'CCCCCC' },
        });

        slide.addText(`${f.icon}  ${f.title}`, {
            x: x + 0.3, y: y + 0.1, w: 5.4, h: 0.4,
            fontSize: 13, bold: true, color: COLORS.primary, fontFace: 'Calibri',
        });

        f.points.forEach((p, j) => {
            slide.addText(`•  ${p}`, {
                x: x + 0.4, y: y + 0.6 + (j * 0.55), w: 5.2, h: 0.5,
                fontSize: 9.5, color: COLORS.medium, fontFace: 'Calibri', lineSpacingMultiple: 1.2, valign: 'top',
            });
        });
    });
}

// =====================================================
// SLIDE 8: FITUR UTAMA (3) - Excel & Audit
// =====================================================
{
    const slide = pptx.addSlide();
    addSectionHeader(slide, 'Fitur Utama Sistem (3/3)', 'Ekspor Rekapitulasi Excel & Audit Trail');
    addFooter(slide);
    addSlideNumber(slide, 8, TOTAL_SLIDES);

    // Excel Export section
    slide.addShape(pptx.ShapeType.rect, {
        x: 0.5, y: 1.8, w: 7.5, h: 4.8,
        fill: { color: 'ECFDF5' }, line: { color: '6EE7B7', width: 0.5 }, rectRadius: 0.1,
    });
    slide.addText('📊 Ekspor Rekapitulasi UTTP ke Excel (.xlsx)', {
        x: 0.7, y: 1.9, w: 7, h: 0.4,
        fontSize: 14, bold: true, color: COLORS.dark, fontFace: 'Calibri',
    });

    const excelFeatures = [
        'Library: ExcelJS — generate file .xlsx langsung di server',
        'Sheet utama: "Rekapitulasi UTTP" dengan pembagian per Triwulan (TW I – TW IV)',
        'Header berwarna kuning, banner triwulan hijau muda, border lengkap',
        'Kolom: No, Pemilik, Tanggal Tera, Jumlah, Satuan, Kapasitas/Daya Baca, UTTP, Masa Berlaku, Peta, Keterangan',
        'Kolom "Peta" berisi hyperlink Google Maps + nama Kecamatan (contoh: "Nunukan, Lihat Peta")',
        'Semua sel rata tengah (center aligned)',
        'Sheet detail otomatis per Pasar — dengan total Sah, Batal, dan Jumlah UTTP',
        'Filter mendukung: Tahun, Triwulan, Kecamatan, Jenis UTTP',
    ];

    excelFeatures.forEach((f, i) => {
        slide.addText(`✅  ${f}`, {
            x: 0.9, y: 2.45 + (i * 0.48), w: 6.8, h: 0.44,
            fontSize: 9.5, color: COLORS.dark, fontFace: 'Calibri', valign: 'middle',
        });
    });

    // Audit Trail section
    slide.addShape(pptx.ShapeType.rect, {
        x: 8.3, y: 1.8, w: 4.5, h: 4.8,
        fill: { color: 'FEF3C7' }, line: { color: 'FCD34D', width: 0.5 }, rectRadius: 0.1,
    });
    slide.addText('📋 Riwayat Aktivitas (Audit Trail)', {
        x: 8.5, y: 1.9, w: 4.2, h: 0.4,
        fontSize: 13, bold: true, color: COLORS.dark, fontFace: 'Calibri',
    });

    const auditFeatures = [
        'Log otomatis setiap aksi:\n  – INSERT (data baru)\n  – DELETE (hapus data)',
        'Informasi tercatat:\n  – Nama petugas\n  – Waktu aksi (timestamp)\n  – Ringkasan data target',
        'Hard Delete:\n  – Data dihapus permanen\n  – Snapshot tersimpan di log\n  – File foto dibersihkan',
        'Halaman Riwayat:\n  – Khusus Admin\n  – Pencarian & filter\n  – Paginasi',
    ];

    auditFeatures.forEach((f, i) => {
        slide.addText(f, {
            x: 8.5, y: 2.45 + (i * 1.1), w: 4.1, h: 1.0,
            fontSize: 9, color: COLORS.dark, fontFace: 'Calibri', lineSpacingMultiple: 1.2, valign: 'top',
        });
    });
}

// =====================================================
// SLIDE 9: SKEMA DATABASE (ERD)
// =====================================================
{
    const slide = pptx.addSlide();
    addSectionHeader(slide, 'Skema Database', 'Entity Relationship Diagram (ERD)');
    addFooter(slide);
    addSlideNumber(slide, 9, TOTAL_SLIDES);

    // Table: users
    const tUserX = 0.5, tUserY = 2.0, tUserW = 3.5, tUserH = 3.2;
    slide.addShape(pptx.ShapeType.rect, { x: tUserX, y: tUserY, w: tUserW, h: 0.5, fill: { color: '3B82F6' }, rectRadius: 0.06 });
    slide.addText('👤 users', { x: tUserX, y: tUserY, w: tUserW, h: 0.5, fontSize: 12, bold: true, color: COLORS.white, align: 'center', valign: 'middle', fontFace: 'Calibri' });
    slide.addShape(pptx.ShapeType.rect, { x: tUserX, y: tUserY + 0.5, w: tUserW, h: tUserH - 0.5, fill: { color: COLORS.white }, line: { color: '3B82F6', width: 0.5 } });
    const userCols = ['🔑 id (PK, serial)', 'nama_lengkap (varchar)', 'email (varchar, unique)', 'password (varchar)', 'role (varchar) → "viewer" | "admin"', 'created_at (timestamp)'];
    userCols.forEach((c, i) => {
        slide.addText(c, {
            x: tUserX + 0.15, y: tUserY + 0.6 + (i * 0.4), w: tUserW - 0.3, h: 0.35,
            fontSize: 8.5, color: i === 0 ? COLORS.secondary : COLORS.dark, fontFace: 'Consolas', valign: 'middle',
        });
    });

    // Table: data_uttp
    const tUttpX = 4.7, tUttpY = 2.0, tUttpW = 4.3, tUttpH = 4.8;
    slide.addShape(pptx.ShapeType.rect, { x: tUttpX, y: tUttpY, w: tUttpW, h: 0.5, fill: { color: '10B981' }, rectRadius: 0.06 });
    slide.addText('⚖️ data_uttp', { x: tUttpX, y: tUttpY, w: tUttpW, h: 0.5, fontSize: 12, bold: true, color: COLORS.white, align: 'center', valign: 'middle', fontFace: 'Calibri' });
    slide.addShape(pptx.ShapeType.rect, { x: tUttpX, y: tUttpY + 0.5, w: tUttpW, h: tUttpH - 0.5, fill: { color: COLORS.white }, line: { color: '10B981', width: 0.5 } });
    const uttpCols = [
        '🔑 id (PK, serial)', 'user_id (FK → users.id)', 'nama_pemilik, email_pemilik', 'nomor_telepon, alamat_uttp',
        'nama_pasar', 'jenis_uttp, merek, tipe', 'no_seri, no_order', 'kapasitas, daya_baca, kelas',
        'hasil_tera (varchar)', 'tgl_tera, tgl_habis_berlaku (varchar)', 'latitude, longitude (varchar)', 'foto_alat_url (text)',
    ];
    uttpCols.forEach((c, i) => {
        slide.addText(c, {
            x: tUttpX + 0.15, y: tUttpY + 0.6 + (i * 0.33), w: tUttpW - 0.3, h: 0.3,
            fontSize: 8, color: i <= 1 ? COLORS.secondary : COLORS.dark, fontFace: 'Consolas', valign: 'middle',
        });
    });

    // Table: activity_log
    const tLogX = 9.5, tLogY = 2.0, tLogW = 3.5, tLogH = 3.5;
    slide.addShape(pptx.ShapeType.rect, { x: tLogX, y: tLogY, w: tLogW, h: 0.5, fill: { color: 'F59E0B' }, rectRadius: 0.06 });
    slide.addText('📋 activity_log', { x: tLogX, y: tLogY, w: tLogW, h: 0.5, fontSize: 12, bold: true, color: COLORS.white, align: 'center', valign: 'middle', fontFace: 'Calibri' });
    slide.addShape(pptx.ShapeType.rect, { x: tLogX, y: tLogY + 0.5, w: tLogW, h: tLogH - 0.5, fill: { color: COLORS.white }, line: { color: 'F59E0B', width: 0.5 } });
    const logCols = ['🔑 id (PK, serial)', 'user_id (FK → users.id)', 'user_name (varchar)', 'action (varchar)', 'target_table (varchar)', 'target_id, target_summary', 'ip_address (varchar)', 'created_at (timestamp)'];
    logCols.forEach((c, i) => {
        slide.addText(c, {
            x: tLogX + 0.15, y: tLogY + 0.6 + (i * 0.35), w: tLogW - 0.3, h: 0.3,
            fontSize: 8, color: i <= 1 ? COLORS.secondary : COLORS.dark, fontFace: 'Consolas', valign: 'middle',
        });
    });

    // Relationship arrows (text-based)
    slide.addText('1 ──── ∞', { x: 3.9, y: 3.0, w: 0.9, h: 0.3, fontSize: 10, color: '9CA3AF', align: 'center', fontFace: 'Consolas' });
    slide.addText('1 ──── ∞', { x: 8.9, y: 3.0, w: 0.7, h: 0.3, fontSize: 10, color: '9CA3AF', align: 'center', fontFace: 'Consolas' });
}

// =====================================================
// SLIDE 10: PENGUJIAN & HASIL
// =====================================================
{
    const slide = pptx.addSlide();
    addSectionHeader(slide, 'Pengujian & Hasil', 'Black-box Testing & User Acceptance Testing');
    addFooter(slide);
    addSlideNumber(slide, 10, TOTAL_SLIDES);

    // Test results table header
    const tblY = 1.9;
    slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: tblY, w: 12.3, h: 0.5, fill: { color: COLORS.primary } });
    ['No', 'Skenario Pengujian', 'Hasil yang Diharapkan', 'Status'].forEach((h, i) => {
        const widths = [0.6, 4.0, 5.7, 2.0];
        const xPositions = [0.5, 1.1, 5.1, 10.8];
        slide.addText(h, {
            x: xPositions[i], y: tblY, w: widths[i], h: 0.5,
            fontSize: 10, bold: true, color: COLORS.white, align: 'center', valign: 'middle', fontFace: 'Calibri',
        });
    });

    const testCases = [
        ['1', 'Register akun baru', 'Akun tersimpan di database, default role = Viewer', '✅ Valid'],
        ['2', 'Login dengan kredensial valid', 'Berhasil masuk ke Dashboard, session aktif', '✅ Valid'],
        ['3', 'Viewer akses halaman Input UTTP', 'Redirect otomatis ke halaman Data UTTP', '✅ Valid'],
        ['4', 'Admin input data UTTP + foto', 'Data & foto tersimpan, activity log tercatat', '✅ Valid'],
        ['5', 'Filter data: Tahun + Triwulan', 'Tabel menampilkan data sesuai filter aktif', '✅ Valid'],
        ['6', 'Export Excel dengan filter', 'File .xlsx terunduh sesuai filter, format valid', '✅ Valid'],
        ['7', 'Admin hapus data UTTP', 'Data + foto dihapus, snapshot tersimpan di log', '✅ Valid'],
        ['8', 'Akses tanpa login (direct URL)', 'Redirect ke halaman Login', '✅ Valid'],
    ];

    testCases.forEach((tc, i) => {
        const y = tblY + 0.5 + (i * 0.52);
        const bg = i % 2 === 0 ? 'F8FAFC' : COLORS.white;
        slide.addShape(pptx.ShapeType.rect, { x: 0.5, y, w: 12.3, h: 0.52, fill: { color: bg }, line: { color: 'E2E8F0', width: 0.3 } });
        const widths = [0.6, 4.0, 5.7, 2.0];
        const xPositions = [0.5, 1.1, 5.1, 10.8];
        tc.forEach((val, j) => {
            slide.addText(val, {
                x: xPositions[j], y, w: widths[j], h: 0.52,
                fontSize: 9.5, color: j === 3 ? '059669' : COLORS.dark, align: 'center', valign: 'middle', fontFace: 'Calibri',
                bold: j === 3,
            });
        });
    });

    // Summary
    slide.addShape(pptx.ShapeType.rect, {
        x: 0.5, y: 6.3, w: 12.3, h: 0.6,
        fill: { color: 'ECFDF5' }, line: { color: '10B981', width: 0.5 }, rectRadius: 0.05,
    });
    slide.addText('🎯 Hasil: 8 dari 8 skenario pengujian VALID — Sistem berjalan sesuai spesifikasi kebutuhan.', {
        x: 0.8, y: 6.3, w: 11.5, h: 0.6,
        fontSize: 12, bold: true, color: '059669', fontFace: 'Calibri', valign: 'middle',
    });
}

// =====================================================
// SLIDE 11: KESIMPULAN & SARAN + PENUTUP
// =====================================================
{
    const slide = pptx.addSlide();
    addSectionHeader(slide, 'Kesimpulan, Saran & Penutup');
    addFooter(slide);
    addSlideNumber(slide, 11, TOTAL_SLIDES);

    // Kesimpulan
    slide.addShape(pptx.ShapeType.rect, {
        x: 0.5, y: 1.8, w: 6.0, h: 4.5,
        fill: { color: 'EFF6FF' }, line: { color: '93C5FD', width: 0.5 }, rectRadius: 0.1,
    });
    slide.addText('✅ Kesimpulan', {
        x: 0.7, y: 1.9, w: 5.6, h: 0.45,
        fontSize: 15, bold: true, color: COLORS.primary, fontFace: 'Calibri',
    });

    const kesimpulan = [
        'Sistem SIMETRI berhasil dibangun menggunakan arsitektur modern (Next.js 14 + Supabase + Vercel) dan telah live di simetri-bsquad.vercel.app.',
        'Sistem RBAC (Admin/Viewer) berfungsi dengan baik — setiap akun baru otomatis berstatus Viewer dan hanya Admin yang dapat mengelola data.',
        'Fitur ekspor rekapitulasi ke Excel (.xlsx) per triwulan telah berhasil diimplementasikan lengkap dengan hyperlink peta dan filter multi-kriteria.',
        'Seluruh 8 skenario pengujian black-box dinyatakan valid, membuktikan fungsionalitas sistem sesuai kebutuhan operasional Dinas Perdagangan.',
    ];

    kesimpulan.forEach((k, i) => {
        slide.addText(`${i + 1}. ${k}`, {
            x: 0.8, y: 2.5 + (i * 0.95), w: 5.5, h: 0.85,
            fontSize: 9.5, color: COLORS.dark, fontFace: 'Calibri', lineSpacingMultiple: 1.2, valign: 'top',
        });
    });

    // Saran
    slide.addShape(pptx.ShapeType.rect, {
        x: 6.8, y: 1.8, w: 6.0, h: 2.8,
        fill: { color: 'FEF3C7' }, line: { color: 'FCD34D', width: 0.5 }, rectRadius: 0.1,
    });
    slide.addText('💡 Saran Pengembangan', {
        x: 7.0, y: 1.9, w: 5.6, h: 0.45,
        fontSize: 15, bold: true, color: COLORS.dark, fontFace: 'Calibri',
    });

    const saran = [
        'Penambahan fitur Dashboard Statistik interaktif (chart/grafik jumlah alat per kecamatan & jenis).',
        'Integrasi notifikasi masa berlaku alat UTTP (email/SMS reminder sebelum kedaluwarsa).',
        'Fitur peta interaktif (Leaflet/Google Maps) untuk visualisasi sebaran lokasi alat UTTP.',
    ];

    saran.forEach((s, i) => {
        slide.addText(`${i + 1}. ${s}`, {
            x: 7.0, y: 2.5 + (i * 0.65), w: 5.5, h: 0.6,
            fontSize: 9.5, color: COLORS.dark, fontFace: 'Calibri', lineSpacingMultiple: 1.2, valign: 'top',
        });
    });

    // Penutup / Thank You box
    slide.addShape(pptx.ShapeType.rect, {
        x: 6.8, y: 4.9, w: 6.0, h: 1.4,
        fill: { color: COLORS.primary }, rectRadius: 0.1,
    });
    slide.addText('Terima Kasih', {
        x: 6.8, y: 5.0, w: 6.0, h: 0.6,
        fontSize: 24, bold: true, color: COLORS.white, align: 'center', fontFace: 'Calibri',
    });
    slide.addText('Sesi Tanya Jawab — Q&A', {
        x: 6.8, y: 5.6, w: 6.0, h: 0.4,
        fontSize: 13, color: COLORS.accent, align: 'center', fontFace: 'Calibri',
    });

    slide.addText('🌐 Live Demo: https://simetri-bsquad.vercel.app', {
        x: 0.5, y: 6.5, w: 12.3, h: 0.4,
        fontSize: 11, color: COLORS.secondary, align: 'center', fontFace: 'Calibri', bold: true,
    });
}

// ============ SAVE FILE ============
const outputPath = 'c:/Users/Fatih Dinda/Documents/Capstone/Presentasi_SIMETRI_Capstone.pptx';
await pptx.writeFile({ fileName: outputPath });
console.log(`PPT saved to: ${outputPath}`);
