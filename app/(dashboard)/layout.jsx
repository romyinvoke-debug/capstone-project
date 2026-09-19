// File: app/(dashboard)/layout.jsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-indigo-500 mb-4"></i>
                    <p className="text-gray-500">Memuat...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const navItems = [
        { href: '/', icon: 'fas fa-home', label: 'Dashboard' },
        { href: '/data/uttp', icon: 'fas fa-table', label: 'Lihat Data UTTP' },
    ];

    if (session.user.role === 'admin') {
        navItems.splice(1, 0, { href: '/input/uttp', icon: 'fas fa-plus-circle', label: 'Input Data UTTP' });
        navItems.push({ href: '/riwayat', icon: 'fas fa-history', label: 'Riwayat Aktivitas' });
    }

    const isActive = (href) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                            >
                                <i className="fas fa-bars text-lg"></i>
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <i className="fas fa-balance-scale text-white text-sm"></i>
                                </div>
                                <span className="text-lg font-bold text-gray-800">SIMETRI</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                                <i className="fas fa-user-circle text-lg"></i>
                                <span>{session.user.namaLengkap || session.user.email}</span>
                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                    {session.user.role}
                                </span>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                            >
                                <i className="fas fa-sign-out-alt mr-1"></i>Keluar
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed top-16 left-0 bottom-0 w-64 bg-white shadow-lg border-r border-gray-200 z-40 transform transition-transform duration-200 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0`}>
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium text-sm ${
                                isActive(item.href)
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <i className={`${item.icon} w-5 text-center`}></i>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="pt-16 lg:pl-64">
                <div className="p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
