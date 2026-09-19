'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function RiwayatPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
    const limit = 15;

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
            router.push('/');
        }
    }, [status, session, router]);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });
            if (search) params.append('search', search);
            if (actionFilter) params.append('action', actionFilter);

            const response = await fetch(`/api/activity-log?${params.toString()}`);
            if (!response.ok) throw new Error('Gagal mengambil data log');

            const result = await response.json();
            setLogs(result.data);
            setPagination(result.pagination);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [page, search, actionFilter]);

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role === 'admin') {
            fetchLogs();
        }
    }, [fetchLogs, status, session]);

    const [searchInput, setSearchInput] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleActionChange = (e) => {
        setActionFilter(e.target.value);
        setPage(1);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        try {
            const d = new Date(dateStr);
            return `${d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
        } catch {
            return dateStr;
        }
    };

    if (status === 'loading' || (status === 'authenticated' && session?.user?.role !== 'admin')) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <i className="fas fa-spinner fa-spin text-3xl text-indigo-500"></i>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Riwayat Aktivitas</h1>
                <p className="text-gray-500 text-sm mt-1">Audit log penginputan dan penghapusan data UTTP</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                        <input
                            type="text"
                            placeholder="Cari user, pemilik, merek..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800"
                        />
                    </div>
                    <select
                        value={actionFilter}
                        onChange={handleActionChange}
                        className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800 bg-white min-w-[160px]"
                    >
                        <option value="">Semua Aksi</option>
                        <option value="CREATE">CREATE (Input)</option>
                        <option value="DELETE">DELETE (Hapus)</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <i className="fas fa-spinner fa-spin text-3xl text-indigo-500 mb-3"></i>
                            <p className="text-gray-500 text-sm">Memuat riwayat...</p>
                        </div>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <i className="fas fa-history text-gray-400 text-2xl"></i>
                        </div>
                        <p className="text-gray-500 font-medium mb-1">Belum ada riwayat</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">Waktu</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-48">Pengguna</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Aksi</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Detail Data</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                                            {formatDate(log.createdAt)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold uppercase">
                                                    {log.userName ? log.userName.charAt(0) : '?'}
                                                </div>
                                                <span className="text-sm font-medium text-gray-800">{log.userName}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                log.action === 'CREATE' ? 'bg-emerald-100 text-emerald-700' :
                                                log.action === 'DELETE' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded border border-gray-100 overflow-hidden text-ellipsis whitespace-nowrap max-w-md">
                                                {log.targetSummary ? (
                                                    <span>
                                                        <b className="text-gray-800">{log.targetSummary.namaPemilik || 'Unknown'}</b>
                                                        {' - '}
                                                        {log.targetSummary.jenisUttp} ({log.targetSummary.merek})
                                                        {log.targetSummary.noSeri ? ` SN:${log.targetSummary.noSeri}` : ''}
                                                    </span>
                                                ) : '-'}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && logs.length > 0 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <p className="text-xs text-gray-500">
                            Halaman {page} dari {pagination.totalPages} (Total: {pagination.total})
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                            >
                                Prev
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                                className="px-3 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
