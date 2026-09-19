// File: app/(dashboard)/data/uttp/page.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

const KECAMATAN_LIST = [
    'Krayan', 'Krayan Barat', 'Krayan Selatan', 'Krayan Tengah', 'Krayan Timur',
    'Lumbis', 'Lumbis Hulu', 'Lumbis Ogong', 'Lumbis Pansiangan',
    'Nunukan', 'Nunukan Selatan', 'Sebatik', 'Sebatik Barat',
    'Sebatik Tengah', 'Sebatik Timur', 'Sebatik Utara', 'Sebuku',
    'Sei Menggaris', 'Sembakung', 'Sembakung Atulai', 'Tulin Onsoi'
];

const JENIS_UTTP_LIST = [
    'Timbangan', 'Anak Timbangan', 'Neraca', 'Dacin',
    'Meter Taksi', 'Pompa Ukur BBM', 'Tangki Ukur',
    'Alat Ukur Panjang', 'Takaran', 'Meteran'
];

export default function DataUttpPage() {
    const { data: session } = useSession();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [kecamatan, setKecamatan] = useState('');
    const [jenisUttp, setJenisUttp] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const limit = 10;

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
            });
            if (search) params.append('search', search);
            if (kecamatan) params.append('kecamatan', kecamatan);
            if (jenisUttp) params.append('jenis_uttp', jenisUttp);

            const response = await fetch(`/api/uttp?${params.toString()}`);
            if (!response.ok) throw new Error('Gagal mengambil data');

            const result = await response.json();
            setData(result.data);
            setPagination(result.pagination);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [page, search, kecamatan, jenisUttp]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Debounce search
    const [searchInput, setSearchInput] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setPage(1);
    };

    const resetFilters = () => {
        setSearchInput('');
        setSearch('');
        setKecamatan('');
        setJenisUttp('');
        setPage(1);
    };

    const openDetail = (item) => {
        setSelectedItem(item);
        setShowDetail(true);
    };

    const closeDetail = () => {
        setShowDetail(false);
        setSelectedItem(null);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        try {
            if (dateStr.includes('T')) {
                return new Date(dateStr).toLocaleDateString('id-ID', {
                    day: '2-digit', month: 'long', year: 'numeric'
                });
            }
            return dateStr;
        } catch {
            return dateStr;
        }
    };

    const getHasilTeraColor = (hasil) => {
        if (!hasil) return 'bg-gray-100 text-gray-600';
        switch (hasil.toLowerCase()) {
            case 'sah': return 'bg-emerald-100 text-emerald-700';
            case 'tidak sah': return 'bg-red-100 text-red-700';
            case 'batal tera': return 'bg-amber-100 text-amber-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Data UTTP</h1>
                <p className="text-gray-500 text-sm mt-1">Lihat dan kelola semua data UTTP yang telah diinput</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-database text-indigo-600"></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Data</p>
                            <p className="text-xl font-bold text-gray-800">{pagination.total}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-file-alt text-emerald-600"></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Halaman</p>
                            <p className="text-xl font-bold text-gray-800">{page} / {pagination.totalPages || 1}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-filter text-purple-600"></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Filter Aktif</p>
                            <p className="text-xl font-bold text-gray-800">
                                {[search, kecamatan, jenisUttp].filter(Boolean).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                        <input
                            type="text"
                            placeholder="Cari nama pemilik, email, no seri, merek..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800"
                        />
                    </div>
                    {/* Kecamatan Filter */}
                    <select
                        value={kecamatan}
                        onChange={handleFilterChange(setKecamatan)}
                        className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800 bg-white min-w-[160px]"
                    >
                        <option value="">Semua Kecamatan</option>
                        {KECAMATAN_LIST.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                    {/* Jenis UTTP Filter */}
                    <select
                        value={jenisUttp}
                        onChange={handleFilterChange(setJenisUttp)}
                        className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800 bg-white min-w-[160px]"
                    >
                        <option value="">Semua Jenis UTTP</option>
                        {JENIS_UTTP_LIST.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                    {/* Reset Button */}
                    {(search || kecamatan || jenisUttp) && (
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2.5 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium whitespace-nowrap"
                        >
                            <i className="fas fa-times mr-1"></i>Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <i className="fas fa-spinner fa-spin text-3xl text-indigo-500 mb-3"></i>
                            <p className="text-gray-500 text-sm">Memuat data...</p>
                        </div>
                    </div>
                ) : data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <i className="fas fa-inbox text-gray-400 text-2xl"></i>
                        </div>
                        <p className="text-gray-500 font-medium mb-1">Tidak ada data ditemukan</p>
                        <p className="text-gray-400 text-sm">
                            {search || kecamatan || jenisUttp
                                ? 'Coba ubah filter pencarian Anda'
                                : 'Mulai dengan menginput data UTTP baru'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">No</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pemilik</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kecamatan</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Jenis UTTP</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Merek</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">No. Seri</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hasil Tera</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tgl Tera</th>
                                        <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {(page - 1) * limit + index + 1}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{item.nama_pemilik || '-'}</p>
                                                    <p className="text-xs text-gray-400">{item.email_pemilik || '-'}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{item.alamat_uttp || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{item.jenis_uttp || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{item.merek || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">{item.no_seri || '-'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getHasilTeraColor(item.hasil_tera)}`}>
                                                    {item.hasil_tera || '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{formatDate(item.tgl_tera)}</td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => openDetail(item)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                                >
                                                    <i className="fas fa-eye"></i>Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="lg:hidden divide-y divide-gray-100">
                            {data.map((item, index) => (
                                <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{item.nama_pemilik || '-'}</p>
                                            <p className="text-xs text-gray-400">{item.email_pemilik || '-'}</p>
                                        </div>
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getHasilTeraColor(item.hasil_tera)}`}>
                                            {item.hasil_tera || '-'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                                        <div><span className="font-medium text-gray-600">Kecamatan:</span> {item.alamat_uttp || '-'}</div>
                                        <div><span className="font-medium text-gray-600">Jenis:</span> {item.jenis_uttp || '-'}</div>
                                        <div><span className="font-medium text-gray-600">Merek:</span> {item.merek || '-'}</div>
                                        <div><span className="font-medium text-gray-600">Tgl Tera:</span> {formatDate(item.tgl_tera)}</div>
                                    </div>
                                    <button
                                        onClick={() => openDetail(item)}
                                        className="w-full py-2 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                    >
                                        <i className="fas fa-eye mr-1"></i>Lihat Detail
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Pagination */}
                {!loading && data.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50">
                        <p className="text-xs text-gray-500">
                            Menampilkan {(page - 1) * limit + 1} - {Math.min(page * limit, pagination.total)} dari {pagination.total} data
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(1)}
                                disabled={page === 1}
                                className="px-2.5 py-1.5 text-xs rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <i className="fas fa-angle-double-left"></i>
                            </button>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-2.5 py-1.5 text-xs rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <i className="fas fa-angle-left"></i>
                            </button>
                            {/* Page numbers */}
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                let pageNum;
                                if (pagination.totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (page <= 3) {
                                    pageNum = i + 1;
                                } else if (page >= pagination.totalPages - 2) {
                                    pageNum = pagination.totalPages - 4 + i;
                                } else {
                                    pageNum = page - 2 + i;
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                                            page === pageNum
                                                ? 'bg-indigo-500 text-white border-indigo-500'
                                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                                className="px-2.5 py-1.5 text-xs rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <i className="fas fa-angle-right"></i>
                            </button>
                            <button
                                onClick={() => setPage(pagination.totalPages)}
                                disabled={page === pagination.totalPages}
                                className="px-2.5 py-1.5 text-xs rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <i className="fas fa-angle-double-right"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showDetail && selectedItem && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeDetail}>
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold">Detail Data UTTP</h3>
                                <p className="text-indigo-200 text-xs">ID: #{selectedItem.id}</p>
                            </div>
                            <button
                                onClick={closeDetail}
                                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                            >
                                <i className="fas fa-times text-white"></i>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Informasi Pemilik */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <i className="fas fa-user text-indigo-500"></i>
                                    Informasi Pemilik
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <DetailField label="Nama Pemilik" value={selectedItem.nama_pemilik} />
                                    <DetailField label="Email" value={selectedItem.email_pemilik} />
                                    <DetailField label="No. Telepon" value={selectedItem.nomor_telepon} />
                                    <DetailField label="Nama Pasar" value={selectedItem.nama_pasar} />
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Lokasi */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <i className="fas fa-map-marker-alt text-indigo-500"></i>
                                    Lokasi
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <DetailField label="Kecamatan" value={selectedItem.alamat_uttp} />
                                    <DetailField label="Latitude" value={selectedItem.latitude} />
                                    <DetailField label="Longitude" value={selectedItem.longitude} />
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Detail UTTP */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <i className="fas fa-balance-scale text-indigo-500"></i>
                                    Detail UTTP
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <DetailField label="Jenis UTTP" value={selectedItem.jenis_uttp} />
                                    <DetailField label="Merek" value={selectedItem.merek} />
                                    <DetailField label="Tipe" value={selectedItem.tipe} />
                                    <DetailField label="Kapasitas" value={selectedItem.kapasitas} />
                                    <DetailField label="Kelas" value={selectedItem.kelas} />
                                    <DetailField label="Daya Baca" value={selectedItem.daya_baca} />
                                    <div className="sm:col-span-2">
                                        <p className="text-xs text-gray-500 mb-1">Hasil Tera</p>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getHasilTeraColor(selectedItem.hasil_tera)}`}>
                                            {selectedItem.hasil_tera || '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Info Tera & Seri */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <i className="fas fa-certificate text-indigo-500"></i>
                                    Informasi Tera
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <DetailField label="Tanggal Tera" value={formatDate(selectedItem.tgl_tera)} />
                                    <DetailField label="Tanggal Habis Berlaku" value={formatDate(selectedItem.tgl_habis_berlaku)} />
                                    <DetailField label="No. Seri" value={selectedItem.no_seri} />
                                    <DetailField label="No. Order" value={selectedItem.no_order} />
                                </div>
                            </div>

                            {/* Foto Alat */}
                            {selectedItem.foto_alat_url && (
                                <>
                                    <hr className="border-gray-200" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                            <i className="fas fa-camera text-indigo-500"></i>
                                            Foto Alat
                                        </h4>
                                        <div className="rounded-xl overflow-hidden border border-gray-200">
                                            <img
                                                src={selectedItem.foto_alat_url}
                                                alt="Foto Alat UTTP"
                                                className="w-full h-auto max-h-64 object-contain bg-gray-50"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Created At */}
                            <div className="text-center">
                                <p className="text-xs text-gray-400">
                                    <i className="fas fa-clock mr-1"></i>
                                    Diinput pada: {formatDate(selectedItem.created_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailField({ label, value }) {
    return (
        <div className="bg-gray-50 rounded-lg px-3 py-2.5">
            <p className="text-xs text-gray-500 mb-0.5">{label}</p>
            <p className="text-sm font-medium text-gray-800">{value || '-'}</p>
        </div>
    );
}
