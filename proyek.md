# 📘 Panduan Lengkap: Membuat Website SIMETRI dari Awal

Dokumentasi lengkap untuk membangun website SIMETRI (Sistem Informasi Metrologi) dari awal, termasuk semua fitur login, register, dan fitur lainnya.

---

## 📋 Daftar Isi

1. [Persiapan Awal](#1-persiapan-awal)
2. [Setup Project Next.js](#2-setup-project-nextjs)
3. [Setup Database PostgreSQL](#3-setup-database-postgresql)
4. [Install Dependencies](#4-install-dependencies)
5. [Konfigurasi Database Connection](#5-konfigurasi-database-connection)
6. [Membuat Database Schema](#6-membuat-database-schema)
7. [Setup NextAuth (Authentication)](#7-setup-nextauth-authentication)
8. [Membuat Halaman Login](#8-membuat-halaman-login)
9. [Membuat Halaman Register](#9-membuat-halaman-register)
10. [Membuat API Register](#10-membuat-api-register)
11. [Setup Provider & Layout](#11-setup-provider--layout)
12. [Membuat Dashboard & Protected Routes](#12-membuat-dashboard--protected-routes)
13. [Fitur Tambahan](#13-fitur-tambahan)

---

## 1. Persiapan Awal

### 1.1 Software yang Diperlukan

- **Node.js** (versi 18 atau lebih tinggi)
  - Download: https://nodejs.org/
  - Verifikasi: `node --version` dan `npm --version`

- **PostgreSQL Database** (atau Supabase)
  - PostgreSQL lokal: https://www.postgresql.org/download/
  - Atau gunakan Supabase (gratis): https://supabase.com

- **Code Editor** (VS Code recommended)
  - Download: https://code.visualstudio.com/

- **Git** (opsional, untuk version control)
  - Download: https://git-scm.com/

---

## 2. Setup Project Next.js

### 2.1 Membuat Project Baru

```bash
# Buat folder project
mkdir simetri-next
cd simetri-next

# Inisialisasi project Next.js
npx create-next-app@14.2.33 . --typescript=false --eslint=true --tailwind=true --app=true --src-dir=false --import-alias="@/*"

# Atau jika sudah ada folder:
npx create-next-app@14.2.33 simetri-next
```

### 2.2 Struktur Folder Awal

Setelah create-next-app, struktur folder akan seperti ini:

```
simetri-next/
├── app/
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── public/
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
└── tailwind.config.js
```

---

## 3. Setup Database PostgreSQL

### 3.1 Opsi A: Menggunakan Supabase (Recommended untuk Pemula)

1. **Buat Akun di Supabase**
   - Kunjungi: https://supabase.com
   - Sign up / Login
   - Klik "New Project"

2. **Buat Project Baru**
   - Isi nama project: `simetri-db`
   - Pilih region terdekat (misal: Southeast Asia)
   - Set password database (simpan dengan aman!)
   - Klik "Create new project"

3. **Dapatkan Connection String**
   - Setelah project dibuat, masuk ke **Settings** → **Database**
   - Scroll ke bagian **Connection string**
   - Pilih **URI** tab
   - Copy connection string, format:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
     ```
   - Ganti `[YOUR-PASSWORD]` dengan password yang Anda set

### 3.2 Opsi B: PostgreSQL Lokal

1. **Install PostgreSQL**
   - Download dari: https://www.postgresql.org/download/
   - Install dengan default settings

2. **Buat Database**
   ```sql
   -- Buka psql atau pgAdmin
   CREATE DATABASE simetri;
   ```

3. **Connection String**
   ```
   postgresql://postgres:password@localhost:5432/simetri
   ```

---

## 4. Install Dependencies

### 4.1 Install Semua Package yang Diperlukan

```bash
# Masuk ke folder project
cd simetri-next

# Install dependencies
npm install next@14.2.33 react@^18 react-dom@^18

# Install database & ORM
npm install drizzle-orm@^0.44.7 pg@^8.16.3

# Install authentication
npm install next-auth@^4.24.13 bcryptjs@^3.0.3

# Install utilities
npm install exceljs@^4.4.0 xlsx@^0.18.5 image-size@^2.0.2

# Install chart library
npm install chart.js@^4.5.1

# Install dev dependencies
npm install -D drizzle-kit@^0.31.6 eslint@^8 eslint-config-next@14.2.33 postcss@^8 tailwindcss@^3.4.1
```

### 4.2 Atau Install Sekaligus

Buat file `package.json` dengan isi berikut:

```json
{
  "name": "simetri-next",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "chart.js": "^4.5.1",
    "drizzle-orm": "^0.44.7",
    "exceljs": "^4.4.0",
    "image-size": "^2.0.2",
    "next": "14.2.33",
    "next-auth": "^4.24.13",
    "pg": "^8.16.3",
    "react": "^18",
    "react-dom": "^18",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "drizzle-kit": "^0.31.6",
    "eslint": "^8",
    "eslint-config-next": "14.2.33",
    "postcss": "^8",
    "tailwindcss": "^3.4.1"
  }
}
```

Kemudian jalankan:
```bash
npm install
```

---

## 5. Konfigurasi Database Connection

### 5.1 Buat File Environment Variables

Buat file `.env.local` di root project:

```env
# Database Connection
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-min-32-characters-long

# Node Environment
NODE_ENV=development
```

**Cara Generate NEXTAUTH_SECRET:**
```bash
# Di terminal (Linux/Mac)
openssl rand -base64 32

# Atau di PowerShell (Windows)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### 5.2 Buat File Database Connection

Buat folder `lib/db/` dan file `lib/db.js`:

```javascript
// File: lib/db.js
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg'; 
import * as schema from './db/schema';

// Buat pool koneksi PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // Untuk Supabase atau production, set rejectUnauthorized: false
    rejectUnauthorized: false 
  },
});

// Buat instance Drizzle dengan schema
export const db = drizzle(pool, { schema });
```

---

## 6. Membuat Database Schema

### 6.1 Buat File Schema

Buat file `lib/db/schema.js`:

```javascript
// File: lib/db/schema.js
import { pgTable, serial, text, varchar, timestamp, integer } from 'drizzle-orm/pg-core';

// 1. Tabel 'users' untuk menyimpan data pengguna
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    namaLengkap: varchar('nama_lengkap', { length: 100 }),
    username: varchar('username', { length: 50 }).notNull().unique(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    password: text('password').notNull(),
    officer: varchar('officer', { length: 50 }),
    role: varchar('role', { length: 10 }).notNull().default('viewer'),
    createdAt: timestamp('created_at').defaultNow(),
});

// 2. Tabel 'data_uttp' untuk menyimpan data UTTP
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

// 3. Tabel 'data_bdkt' untuk menyimpan data BDKT
export const data_bdkt = pgTable('data_bdkt', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    namaProduk: varchar('nama_produk', { length: 250 }),
    merkDagang: varchar('merk_dagang', { length: 150 }),
    namaToko: varchar('nama_toko', { length: 255 }),
    alamatProdusen: text('alamat_produsen'),
    kuantitasNominal: varchar('kuantitas_nominal', { length: 100 }),
    hasilUkur: varchar('hasil_ukur', { length: 100 }),
    satuan: varchar('satuan', { length: 50 }),
    kesimpulan: varchar('kesimpulan', { length: 50 }),
    catatan: text('catatan'),
    lokasiInspeksi: text('lokasi_inspeksi'),
    fotoBdkt: varchar('foto_bdkt', { length: 255 }),
    latitude: varchar('latitude', { length: 50 }),
    longitude: varchar('longitude', { length: 50 }),
    createdAt: timestamp('created_at').defaultNow(),
});

// 4. Tabel 'activity_log' untuk mencatat aktivitas
export const activityLog = pgTable('activity_log', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    activityType: varchar('activity_type', { length: 50 }).notNull(),
    entityType: varchar('entity_type', { length: 50 }).notNull(),
    entityIds: text('entity_ids'),
    subjek: varchar('subjek', { length: 255 }),
    jumlahItem: integer('jumlah_item').default(1),
    tanggalKegiatan: timestamp('tanggal_kegiatan').defaultNow(),
    createdAt: timestamp('created_at').defaultNow(),
});

// 5. Tabel 'settings' untuk konfigurasi sistem
export const settings = pgTable('settings', {
    id: serial('id').primaryKey(),
    key: varchar('key', { length: 100 }).notNull().unique(),
    value: text('value'),
    description: text('description'),
    updatedAt: timestamp('updated_at').defaultNow(),
    updatedBy: integer('updated_by').references(() => users.id),
});
```

### 6.2 Jalankan SQL untuk Membuat Tabel di Database

Buka Supabase SQL Editor atau psql, lalu jalankan script berikut:

```sql
-- 1. Tabel users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nama_lengkap VARCHAR(100),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    officer VARCHAR(50),
    role VARCHAR(10) NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Tabel data_uttp
CREATE TABLE IF NOT EXISTS data_uttp (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    nama_pemilik VARCHAR(255),
    email_pemilik VARCHAR(255),
    nomor_telepon VARCHAR(20),
    alamat_uttp VARCHAR(255),
    nama_pasar VARCHAR(255),
    latitude VARCHAR(255),
    longitude VARCHAR(255),
    jenis_uttp VARCHAR(255),
    merek VARCHAR(255),
    tipe VARCHAR(255),
    kapasitas VARCHAR(255),
    kelas VARCHAR(255),
    daya_baca VARCHAR(255),
    hasil_tera VARCHAR(255),
    tgl_tera VARCHAR(255),
    tgl_habis_berlaku VARCHAR(255),
    no_seri VARCHAR(255),
    no_order VARCHAR(255),
    foto_alat_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Tabel data_bdkt
CREATE TABLE IF NOT EXISTS data_bdkt (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    nama_produk VARCHAR(250),
    merk_dagang VARCHAR(150),
    nama_toko VARCHAR(255),
    alamat_produsen TEXT,
    kuantitas_nominal VARCHAR(100),
    hasil_ukur VARCHAR(100),
    satuan VARCHAR(50),
    kesimpulan VARCHAR(50),
    catatan TEXT,
    lokasi_inspeksi TEXT,
    foto_bdkt VARCHAR(255),
    latitude VARCHAR(50),
    longitude VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Tabel activity_log
CREATE TABLE IF NOT EXISTS activity_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_ids TEXT,
    subjek VARCHAR(255),
    jumlah_item INTEGER DEFAULT 1,
    tanggal_kegiatan TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Tabel settings
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by INTEGER REFERENCES users(id)
);

-- 6. Buat Index untuk performa
CREATE INDEX IF NOT EXISTS idx_data_uttp_user_id ON data_uttp(user_id);
CREATE INDEX IF NOT EXISTS idx_data_uttp_tgl_tera ON data_uttp(tgl_tera);
CREATE INDEX IF NOT EXISTS idx_data_bdkt_user_id ON data_bdkt(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_tanggal_kegiatan ON activity_log(tanggal_kegiatan);
```

---

## 7. Setup NextAuth (Authentication)

### 7.1 Buat File NextAuth Route

Buat folder `app/api/auth/[...nextauth]/` dan file `route.js`:

```javascript
// File: app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { compare } from 'bcryptjs';

// Konfigurasi NextAuth
export const authOptions = {
    pages: {
        signIn: '/login', // Halaman login custom
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Validasi input
                if (!credentials?.username || !credentials?.password) return null;
                
                // Cari user di database
                const user = await db.query.users.findFirst({
                    where: eq(users.username, credentials.username)
                });
                
                if (!user) return null;
                
                // Verifikasi password
                const passwordsMatch = await compare(credentials.password, user.password);
                if (!passwordsMatch) return null;
                
                // Trim role untuk menghilangkan spasi
                const userRole = (user.role || '').trim().toLowerCase();
                
                // Return user object (tanpa password)
                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    namaLengkap: user.namaLengkap,
                    role: userRole,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Simpan user data ke token
            if (user) {
                const role = (user.role || '').trim().toLowerCase();
                token.id = user.id;
                token.role = role;
                token.email = user.email;
                token.namaLengkap = user.namaLengkap;
            }
            return token;
        },
        async session({ session, token }) {
            // Simpan token data ke session
            if (token) {
                const role = (token.role || '').trim().toLowerCase();
                session.user.id = token.id;
                session.user.role = role;
                session.user.email = token.email;
                session.user.namaLengkap = token.namaLengkap;
            }
            return session;
        }
    },
    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};

// Export handler untuk GET dan POST
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

## 8. Membuat Halaman Login

### 8.1 Buat File Login Page

Buat folder `app/login/` dan file `page.jsx`:

```javascript
// File: app/login/page.jsx
'use client';

import { useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export const dynamic = 'force-dynamic';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackError = searchParams.get('error');

    const [username, setUsername] = useState('');
    const passwordRef = useRef(null); // Gunakan ref untuk password (keamanan)
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Tampilkan error jika ada
    if (callbackError && !error) {
        setError('Username atau password salah. Silakan coba lagi.');
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        // Ambil password dari ref (tidak tersimpan di state)
        const passwordToSend = passwordRef.current?.value || '';
        
        // Clear password field segera setelah mengambil nilai
        if (passwordRef.current) {
            passwordRef.current.value = '';
        }

        try {
            // Panggil NextAuth signIn
            const result = await signIn('credentials', {
                username: username,
                password: passwordToSend,
                redirect: false, // Jangan redirect otomatis
                callbackUrl: '/'
            });

            if (result.error) {
                setError('Username atau password salah.');
                setUsername('');
            } else {
                // Login sukses, redirect ke dashboard
                setUsername('');
                if (passwordRef.current) {
                    passwordRef.current.value = '';
                }
                router.push('/');
            }

        } catch (err) {
            setError(err.message);
            setUsername('');
            if (passwordRef.current) {
                passwordRef.current.value = '';
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-background-animation"></div>
            <div className="login-container-new">
                {/* Logo Section */}
                <div className="login-logo-section">
                    <div className="logo-nunukan">
                        <img 
                            src="/logo-nunukan.png" 
                            alt="Logo Kabupaten Nunukan" 
                            className="logo-img"
                        />
                    </div>
                    <div className="logo-metrologi">
                        <img 
                            src="/logo-metrologi.png" 
                            alt="Logo Metrologi" 
                            className="logo-img"
                        />
                    </div>
                </div>

                {/* Welcome Text */}
                <div className="login-welcome-section">
                    <h2 className="welcome-title">Selamat Datang di SIMETRI</h2>
                </div>

                {/* Login Form */}
                <div className="login-form-card">
                    <h1 className="login-form-title">Login</h1>
                
                    {error && (
                        <div className="error-message">
                            <i className="fas fa-exclamation-circle"></i> {error}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                required
                                ref={passwordRef}
                                autoComplete="current-password"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-login-animated"
                            >
                                {loading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i> Memeriksa...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-sign-in-alt"></i> Login
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                
                    <div className="login-links">
                        <p className="login-register-link">
                            Belum punya akun?{' '}
                            <Link href="/register" className="register-link-text">
                                Daftar di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="login-page-wrapper"><div className="login-container-new"><p>Loading...</p></div></div>}>
            <LoginForm />
        </Suspense>
    );
}
```

---

## 9. Membuat Halaman Register

### 9.1 Buat File Register Page

Buat folder `app/register/` dan file `page.jsx`:

```javascript
// File: app/register/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    
    const [nama_lengkap, setNamaLengkap] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Panggil API Register
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nama_lengkap,
                    username,
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Gagal mendaftar.');
            }

            // Jika sukses, redirect ke login
            router.push('/login');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-background-animation"></div>
            <div className="login-container-new">
                {/* Logo Section */}
                <div className="login-logo-section">
                    <div className="logo-nunukan">
                        <img 
                            src="/logo-nunukan.png" 
                            alt="Logo Kabupaten Nunukan" 
                            className="logo-img"
                        />
                    </div>
                    <div className="logo-metrologi">
                        <img 
                            src="/logo-metrologi.png" 
                            alt="Logo Metrologi" 
                            className="logo-img"
                        />
                    </div>
                </div>

                {/* Welcome Text */}
                <div className="login-welcome-section">
                    <h2 className="welcome-title">Selamat Datang di SIMETRI</h2>
                </div>

                {/* Register Form */}
                <div className="login-form-card">
                    <h1 className="login-form-title">Daftar</h1>
                
                    {error && (
                        <div className="error-message">
                            <i className="fas fa-exclamation-circle"></i> {error}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="nama_lengkap">Nama Lengkap</label>
                            <input
                                id="nama_lengkap"
                                type="text"
                                required
                                value={nama_lengkap}
                                onChange={(e) => setNamaLengkap(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-login-animated"
                            >
                                {loading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i> Mendaftarkan...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-user-plus"></i> Daftar
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                
                    <p className="login-register-link">
                        Sudah punya akun?{' '}
                        <Link href="/login" className="register-link-text">
                            Login di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
```

---

## 10. Membuat API Register

### 10.1 Buat API Route untuk Register

Buat folder `app/api/register/` dan file `route.js`:

```javascript
// File: app/api/register/route.js
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const body = await req.json();
        const { nama_lengkap, username, email, password } = body;

        // Validasi input
        if (!username || !email || !password || !nama_lengkap) {
            return new NextResponse('Data tidak lengkap', { status: 400 });
        }

        // Hash password dengan bcryptjs (12 rounds)
        const hashedPassword = await hash(password, 12);
        
        // Default role adalah 'viewer'
        const role = 'viewer';

        // Insert user baru ke database
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
        
        // Handle error duplikat username/email
        if (error.code === '23505') { 
            return new NextResponse('Username atau Email sudah terdaftar', { status: 409 });
        }
        
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
```

---

## 11. Setup Provider & Layout

### 11.1 Buat Provider untuk NextAuth

Buat file `app/provider.jsx`:

```javascript
// File: app/provider.jsx
'use client';

import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
```

### 11.2 Update Root Layout

Update file `app/layout.js`:

```javascript
// File: app/layout.js
import localFont from "next/font/local";
import "./globals.css";
import Providers from './provider';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "SIMETRI",
  description: "Sistem Informasi Metrologi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

### 11.3 Buat CSS untuk Login/Register

Tambahkan CSS ke `app/globals.css` (atau buat file terpisah). Karena file CSS sangat panjang, silakan copy dari file `app/globals.css` yang ada di project Anda, atau gunakan CSS framework seperti Tailwind dengan custom classes.

**Minimal CSS yang diperlukan untuk Login/Register:**

```css
/* Login Page Wrapper */
.login-page-wrapper {
    position: relative;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
    background-size: 400% 400%;
    animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.login-container-new {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 500px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-form-card {
    width: 100%;
}

.login-form-title {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
    font-size: 28px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-weight: 500;
}

.form-group input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    box-sizing: border-box;
}

.btn-login-animated {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
}

.btn-login-animated:hover {
    transform: translateY(-2px);
}

.error-message {
    background: #fee;
    color: #c33;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
}
```

---

## 12. Membuat Dashboard & Protected Routes

### 12.1 Buat Middleware untuk Protect Routes

Buat file `middleware.js` di root project:

```javascript
// File: middleware.js
import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: '/login',
    }
});

// Protect semua routes di dalam (dashboard)
export const config = {
    matcher: ['/((?!api|login|register|_next/static|_next/image|favicon.ico).*)'],
};
```

### 12.2 Buat Dashboard Page

Buat folder `app/(dashboard)/` dan file `page.js`:

```javascript
// File: app/(dashboard)/page.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        redirect('/login');
    }

    return (
        <div>
            <h1>Dashboard SIMETRI</h1>
            <p>Selamat datang, {session.user.namaLengkap || session.user.username}!</p>
            <p>Role: {session.user.role}</p>
        </div>
    );
}
```

---

## 13. Fitur Tambahan

### 13.1 Membuat User Admin Pertama

Setelah registrasi user pertama, update role menjadi admin di database:

```sql
-- Update role user menjadi admin
UPDATE users SET role = 'admin' WHERE username = 'username_anda';
```

### 13.2 Test Login & Register

1. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```

2. **Buka Browser:**
   - Buka: http://localhost:3000
   - Akan redirect ke login

3. **Test Register:**
   - Buka: http://localhost:3000/register
   - Isi form dan submit
   - Jika berhasil, akan redirect ke login

4. **Test Login:**
   - Buka: http://localhost:3000/login
   - Masukkan username dan password
   - Jika berhasil, akan masuk ke dashboard

### 13.3 Struktur Folder Lengkap

Setelah semua langkah di atas, struktur folder Anda akan seperti ini:

```
simetri-next/
├── app/
│   ├── (dashboard)/
│   │   └── page.js
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.js
│   │   └── register/
│   │       └── route.js
│   ├── login/
│   │   └── page.jsx
│   ├── register/
│   │   └── page.jsx
│   ├── layout.js
│   ├── provider.jsx
│   └── globals.css
├── lib/
│   └── db/
│       ├── schema.js
│       └── db.js
├── public/
│   ├── logo-nunukan.png
│   └── logo-metrologi.png
├── .env.local
├── middleware.js
├── next.config.mjs
├── package.json
└── tailwind.config.js
```

---

## 🎯 Checklist Lengkap

### Setup Dasar
- [ ] Node.js terinstall
- [ ] Database PostgreSQL/Supabase sudah setup
- [ ] Project Next.js sudah dibuat
- [ ] Dependencies sudah diinstall
- [ ] File `.env.local` sudah dibuat dengan benar
- [ ] Database schema sudah dibuat (tabel users, data_uttp, data_bdkt, dll)
- [ ] File `lib/db.js` sudah dibuat
- [ ] File `lib/db/schema.js` sudah dibuat

### Authentication
- [ ] NextAuth sudah dikonfigurasi (`app/api/auth/[...nextauth]/route.js`)
- [ ] Halaman login sudah dibuat (`app/login/page.jsx`)
- [ ] Halaman register sudah dibuat (`app/register/page.jsx`)
- [ ] API register sudah dibuat (`app/api/register/route.js`)
- [ ] Provider sudah dibuat (`app/provider.jsx`)
- [ ] Layout sudah diupdate (`app/layout.js`)
- [ ] CSS untuk login/register sudah ditambahkan
- [ ] Middleware untuk protect routes sudah dibuat
- [ ] User admin pertama sudah dibuat
- [ ] Test login dan register berhasil

### Dashboard & Fitur Utama
- [ ] Dashboard layout sudah dibuat (`app/(dashboard)/layout.jsx`)
- [ ] Dashboard page sudah dibuat (`app/(dashboard)/page.js`)
- [ ] Halaman input UTTP perusahaan sudah dibuat
- [ ] Form GPS coordinate picker berfungsi
- [ ] Dropdown kecamatan sudah dibuat
- [ ] Autocomplete nama pemilik berfungsi
- [ ] Upload foto alat berfungsi
- [ ] API save UTTP sudah dibuat (`app/api/uttp/route.js`)
- [ ] Folder uploads sudah dibuat (`public/uploads/uttp/`)

### PWA (Progressive Web App)
- [ ] Service Worker sudah dibuat (`public/sw.js`)
- [ ] Manifest file sudah dibuat (`public/manifest.json`)
- [ ] Service Worker registration di layout sudah ditambahkan
- [ ] Halaman offline sudah dibuat (`app/offline/page.jsx`)
- [ ] Test PWA di browser (Chrome DevTools)

---

## 14. Membuat Dashboard dengan Form Input UTTP

### 14.1 Buat Layout Dashboard

Buat file `app/(dashboard)/layout.jsx`:

```javascript
// File: app/(dashboard)/layout.jsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (!session) {
        return null;
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <button onClick={() => signOut()} className="btn-logout">
                    Keluar
                </button>
                <p className="copyright">© 2025 - Created by Romi Zulfikar Ramadhani.</p>
            </header>
            <main className="dashboard-main">
                {children}
            </main>
        </div>
    );
}
```

### 14.2 Buat Halaman Input UTTP Perusahaan

Buat folder `app/(dashboard)/input/uttp/perusahaan/` dan file `page.jsx`:

**Fitur Utama:**
- Form input informasi dasar pemilik & lokasi
- Autocomplete nama pemilik (search existing owners)
- Dropdown pilihan kecamatan
- GPS coordinate picker dengan tombol "GPS"
- Dynamic form untuk multiple UTTP
- Upload foto alat
- Form sederhana vs form lengkap berdasarkan jenis UTTP

**Kode lengkap ada di:** `app/(dashboard)/input/uttp/perusahaan/page.jsx`

**Fitur GPS:**
```javascript
const ambilLokasiGps = () => {
    if (!navigator.geolocation) {
        alert('Geolocation tidak didukung oleh browser Anda');
        return;
    }

    setLoadingGps(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            setOwnerData(prevData => ({
                ...prevData,
                latitude: position.coords.latitude.toFixed(8),
                longitude: position.coords.longitude.toFixed(8)
            }));
            setLoadingGps(false);
        },
        (error) => {
            setLoadingGps(false);
            alert('Gagal mengambil lokasi GPS');
        },
        {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 0
        }
    );
};
```

**Dropdown Kecamatan:**
```javascript
<select id="alamat_uttp" value={ownerData.alamat_uttp} onChange={handleOwnerChange} required>
    <option value="">Pilih Kecamatan</option>
    <option value="Krayan">Krayan</option>
    <option value="Krayan Barat">Krayan Barat</option>
    <option value="Nunukan">Nunukan</option>
    {/* ... dst */}
</select>
```

### 14.3 Buat API untuk Save UTTP

Buat file `app/api/uttp/route.js`:

```javascript
// File: app/api/uttp/route.js
import { db } from '@/lib/db';
import { dataUttp } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const formData = await req.formData();
        const userId = formData.get('userId');
        const namaPemilik = formData.get('nama_pemilik');
        const alamatUttp = formData.get('alamat_uttp');
        const latitude = formData.get('latitude');
        const longitude = formData.get('longitude');
        const uttpDetails = JSON.parse(formData.get('uttp_details'));

        // Simpan foto jika ada
        const savedUttps = [];
        for (let i = 0; i < uttpDetails.length; i++) {
            const detail = uttpDetails[i];
            const fotoFile = formData.get(`foto_alat_${i}`);
            
            let fotoUrl = '';
            if (fotoFile) {
                const bytes = await fotoFile.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const filename = `uttp_${Date.now()}_${i}.${fotoFile.name.split('.').pop()}`;
                const path = join(process.cwd(), 'public', 'uploads', 'uttp', filename);
                await writeFile(path, buffer);
                fotoUrl = `/uploads/uttp/${filename}`;
            }

            const newUttp = await db.insert(dataUttp).values({
                userId: parseInt(userId),
                namaPemilik: namaPemilik,
                alamatUttp: alamatUttp,
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
```

---

## 15. Setup PWA (Progressive Web App)

### 15.1 Buat Service Worker

Buat file `public/sw.js`:

```javascript
// File: public/sw.js
const CACHE_NAME = 'simetri-v2';
const OFFLINE_URL = '/offline';

// Assets yang akan di-cache
const STATIC_CACHE_URLS = [
  '/',
  '/login',
  '/input/uttp/perusahaan',
  '/data/uttp',
  '/offline',
  '/logo-metrologi.png',
  '/logo-nunukan.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE_URLS).catch((err) => {
        console.warn('[SW] Some assets failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
```

### 15.2 Buat Manifest File

Buat file `public/manifest.json`:

```json
{
  "name": "SIMETRI - Sistem Informasi Metrologi",
  "short_name": "SIMETRI",
  "description": "Sistem Informasi Metrologi untuk mengelola data UTTP dan BDKT",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/logo-metrologi.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/logo-metrologi.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 15.3 Update Layout untuk Register Service Worker

Update `app/layout.js` (tambahkan script di bagian body):

```javascript
// Di dalam <body> tag, tambahkan:
<script
  dangerouslySetInnerHTML={{
    __html: `
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
              console.log('Service Worker registered:', registration.scope);
            })
            .catch(function(error) {
              console.log('Service Worker registration failed:', error);
            });
        });
      }
    `,
  }}
/>
```

### 15.4 Buat Halaman Offline

Buat file `app/offline/page.jsx`:

```javascript
// File: app/offline/page.jsx
export default function OfflinePage() {
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh',
            padding: '20px',
            textAlign: 'center'
        }}>
            <h1>Anda sedang offline</h1>
            <p>Silakan periksa koneksi internet Anda</p>
            <button onClick={() => window.location.reload()}>
                Coba Lagi
            </button>
        </div>
    );
}
```

---

## 🚀 Langkah Selanjutnya

Setelah setup dasar selesai, Anda bisa menambahkan fitur-fitur berikut:

1. ✅ **Dashboard dengan Statistik** - Sudah ada
2. ✅ **CRUD Data UTTP** - Sudah ada (Input, Edit, Delete)
3. **CRUD Data BDKT** - Mirip dengan UTTP
4. **Activity Log** - Tracking semua operasi
5. **Export Excel/PDF** - Export data ke file
6. **Peta Interaktif** - Tampilkan UTTP di peta
7. **Reminder/Pengingat** - Notifikasi UTTP yang akan habis
8. **Settings/Configuration** - Pengaturan sistem

---

## 📝 Catatan Penting

1. **Keamanan Password:**
   - Password di-hash dengan bcryptjs (12 rounds)
   - Password tidak disimpan di React state (gunakan useRef)
   - Password tidak dikembalikan dalam response API

2. **Role-Based Access Control:**
   - Default role: `viewer` (read-only)
   - Admin role: `admin` (full access)
   - Cek role di setiap API route yang memerlukan permission

3. **Environment Variables:**
   - Jangan commit file `.env.local` ke Git
   - Pastikan `NEXTAUTH_SECRET` minimal 32 karakter
   - Gunakan connection string yang aman

4. **Database:**
   - Backup database secara berkala
   - Gunakan migration untuk perubahan schema
   - Index penting untuk performa query

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'next-auth'"
```bash
npm install next-auth@^4.24.13
```

### Error: "Database connection failed"
- Cek `DATABASE_URL` di `.env.local`
- Pastikan database sudah running
- Cek firewall/network settings

### Error: "Invalid credentials"
- Pastikan password di-hash dengan benar
- Cek apakah user ada di database
- Verifikasi username/password di database

### Error: "NEXTAUTH_SECRET is not set"
- Pastikan file `.env.local` ada
- Pastikan `NEXTAUTH_SECRET` sudah di-set
- Restart development server setelah mengubah `.env.local`

---

## 📚 Referensi

- **Next.js Documentation:** https://nextjs.org/docs
- **NextAuth.js Documentation:** https://next-auth.js.org/
- **Drizzle ORM Documentation:** https://orm.drizzle.team/
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **Supabase Documentation:** https://supabase.com/docs

---

**Selamat! Website SIMETRI Anda sudah siap digunakan! 🎉**

Jika ada pertanyaan atau masalah, silakan cek dokumentasi lainnya:
- `DOCUMENTATION.md` - Dokumentasi lengkap project
- `API_DOCUMENTATION.md` - Dokumentasi API endpoints
- `SETUP_GUIDE.md` - Panduan setup dan deployment
- `CODE_REFERENCE.md` - Code snippets penting

