// File: lib/db/schema.js
import { pgTable, serial, text, varchar, timestamp, integer } from 'drizzle-orm/pg-core';

// Tabel 'users' untuk menyimpan data pengguna
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    namaLengkap: varchar('nama_lengkap', { length: 100 }),
    username: varchar('username', { length: 50 }).notNull().unique(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    password: text('password').notNull(),
    role: varchar('role', { length: 10 }).notNull().default('viewer'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Tabel 'data_uttp' untuk menyimpan data UTTP
export const dataUttp = pgTable('data_uttp', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    namaPemilik: varchar('nama_pemilik', { length: 255 }),
    emailPemilik: varchar('email_pemilik', { length: 255 }),
    nomorTelepon: varchar('nomor_telepon', { length: 20 }),
    alamatUttp: varchar('alamat_uttp', { length: 255 }),
    namaPasar: varchar('nama_pasar', { length: 255 }),
    latitude: varchar('latitude', { length: 255 }),
    longitude: varchar('longitude', { length: 255 }),
    jenisUttp: varchar('jenis_uttp', { length: 255 }),
    merek: varchar('merek', { length: 255 }),
    tipe: varchar('tipe', { length: 255 }),
    kapasitas: varchar('kapasitas', { length: 255 }),
    kelas: varchar('kelas', { length: 255 }),
    dayaBaca: varchar('daya_baca', { length: 255 }),
    hasilTera: varchar('hasil_tera', { length: 255 }),
    tglTera: varchar('tgl_tera', { length: 255 }),
    tglHabisBerlaku: varchar('tgl_habis_berlaku', { length: 255 }),
    noSeri: varchar('no_seri', { length: 255 }),
    noOrder: varchar('no_order', { length: 255 }),
    fotoAlatUrl: varchar('foto_alat_url', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
});
