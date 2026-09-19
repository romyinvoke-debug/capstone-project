// File: app/(dashboard)/page.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    return (
        <div>
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-lg">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    Selamat Datang, {session.user.namaLengkap || session.user.email}!
                </h1>
                <p className="text-indigo-100 text-sm sm:text-base">
                    Sistem Informasi Metrologi — Kelola data UTTP dengan mudah.
                </p>
            </div>

            {/* Quick Actions */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Aksi Cepat</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                    href="/input/uttp"
                    className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition-all duration-200"
                >
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                        <i className="fas fa-plus-circle text-indigo-600 text-xl"></i>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">Input Data UTTP</h3>
                    <p className="text-sm text-gray-500">Tambahkan data UTTP baru ke sistem</p>
                </Link>
                <Link
                    href="/data/uttp"
                    className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-emerald-300 transition-all duration-200"
                >
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                        <i className="fas fa-table text-emerald-600 text-xl"></i>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1">Lihat Data UTTP</h3>
                    <p className="text-sm text-gray-500">Lihat dan kelola semua data yang telah diinput</p>
                </Link>
            </div>
        </div>
    );
}
