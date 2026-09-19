// File: app/(dashboard)/input/uttp/page.jsx
'use client';

import { useState } from 'react';
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

const emptyUttpItem = {
    jenis_uttp: '',
    merek: '',
    tipe: '',
    kapasitas: '',
    kelas: '',
    daya_baca: '',
    hasil_tera: '',
    tgl_tera: '',
    tgl_habis_berlaku: '',
    no_seri: '',
    no_order: '',
    foto_alat: null,
};

export default function InputUttpPage() {
    const { data: session } = useSession();

    // Owner data
    const [ownerData, setOwnerData] = useState({
        nama_pemilik: '',
        email_pemilik: '',
        nomor_telepon: '',
        alamat_uttp: '',
        nama_pasar: '',
        latitude: '',
        longitude: '',
    });

    // UTTP items (dynamic)
    const [uttpItems, setUttpItems] = useState([{ ...emptyUttpItem }]);
    const [loading, setLoading] = useState(false);
    const [loadingGps, setLoadingGps] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleOwnerChange = (e) => {
        const { id, value } = e.target;
        setOwnerData(prev => ({ ...prev, [id]: value }));
    };

    const handleUttpChange = (index, field, value) => {
        setUttpItems(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleFotoChange = (index, file) => {
        setUttpItems(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], foto_alat: file };
            return updated;
        });
    };

    const addUttpItem = () => {
        setUttpItems(prev => [...prev, { ...emptyUttpItem }]);
    };

    const removeUttpItem = (index) => {
        if (uttpItems.length <= 1) return;
        setUttpItems(prev => prev.filter((_, i) => i !== index));
    };

    const ambilLokasiGps = () => {
        if (!navigator.geolocation) {
            alert('Geolocation tidak didukung oleh browser Anda');
            return;
        }

        setLoadingGps(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setOwnerData(prev => ({
                    ...prev,
                    latitude: position.coords.latitude.toFixed(8),
                    longitude: position.coords.longitude.toFixed(8)
                }));
                setLoadingGps(false);
            },
            (error) => {
                setLoadingGps(false);
                alert('Gagal mengambil lokasi GPS: ' + error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 0
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const formData = new FormData();
            formData.append('nama_pemilik', ownerData.nama_pemilik);
            formData.append('email_pemilik', ownerData.email_pemilik);
            formData.append('nomor_telepon', ownerData.nomor_telepon);
            formData.append('alamat_uttp', ownerData.alamat_uttp);
            formData.append('nama_pasar', ownerData.nama_pasar);
            formData.append('latitude', ownerData.latitude);
            formData.append('longitude', ownerData.longitude);

            const details = uttpItems.map(item => ({
                jenis_uttp: item.jenis_uttp,
                merek: item.merek,
                tipe: item.tipe,
                kapasitas: item.kapasitas,
                kelas: item.kelas,
                daya_baca: item.daya_baca,
                hasil_tera: item.hasil_tera,
                tgl_tera: item.tgl_tera,
                tgl_habis_berlaku: item.tgl_habis_berlaku,
                no_seri: item.no_seri,
                no_order: item.no_order,
            }));
            formData.append('uttp_details', JSON.stringify(details));

            uttpItems.forEach((item, i) => {
                if (item.foto_alat) {
                    formData.append(`foto_alat_${i}`, item.foto_alat);
                }
            });

            const response = await fetch('/api/uttp', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Gagal menyimpan data UTTP');
            }

            const result = await response.json();
            setMessage({ type: 'success', text: result.message });

            // Reset form
            setOwnerData({
                nama_pemilik: '', email_pemilik: '', nomor_telepon: '',
                alamat_uttp: '', nama_pasar: '', latitude: '', longitude: '',
            });
            setUttpItems([{ ...emptyUttpItem }]);

        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Input Data UTTP</h1>
                <p className="text-gray-500 text-sm mt-1">Tambahkan data UTTP baru ke dalam sistem</p>
            </div>

            {message.text && (
                <div className={`mb-6 px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${
                    message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-600'
                }`}>
                    <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informasi Pemilik */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <i className="fas fa-user text-indigo-500"></i>
                        Informasi Pemilik
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="nama_pemilik" className="block text-sm font-medium text-gray-600 mb-1">Nama Pemilik *</label>
                            <input id="nama_pemilik" type="text" required value={ownerData.nama_pemilik} onChange={handleOwnerChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800" />
                        </div>
                        <div>
                            <label htmlFor="email_pemilik" className="block text-sm font-medium text-gray-600 mb-1">Email Pemilik</label>
                            <input id="email_pemilik" type="email" value={ownerData.email_pemilik} onChange={handleOwnerChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800" />
                        </div>
                        <div>
                            <label htmlFor="nomor_telepon" className="block text-sm font-medium text-gray-600 mb-1">Nomor Telepon</label>
                            <input id="nomor_telepon" type="tel" value={ownerData.nomor_telepon} onChange={handleOwnerChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800" />
                        </div>
                        <div>
                            <label htmlFor="nama_pasar" className="block text-sm font-medium text-gray-600 mb-1">Nama Pasar</label>
                            <input id="nama_pasar" type="text" value={ownerData.nama_pasar} onChange={handleOwnerChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800" />
                        </div>
                    </div>
                </div>

                {/* Lokasi */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <i className="fas fa-map-marker-alt text-indigo-500"></i>
                        Lokasi
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="alamat_uttp" className="block text-sm font-medium text-gray-600 mb-1">Kecamatan *</label>
                            <select id="alamat_uttp" required value={ownerData.alamat_uttp} onChange={handleOwnerChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800 bg-white">
                                <option value="">Pilih Kecamatan</option>
                                {KECAMATAN_LIST.map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="latitude" className="block text-sm font-medium text-gray-600 mb-1">Latitude</label>
                            <input id="latitude" type="text" value={ownerData.latitude} onChange={handleOwnerChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800"
                                placeholder="Contoh: 4.12345678" />
                        </div>
                        <div>
                            <label htmlFor="longitude" className="block text-sm font-medium text-gray-600 mb-1">Longitude</label>
                            <input id="longitude" type="text" value={ownerData.longitude} onChange={handleOwnerChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800"
                                placeholder="Contoh: 117.12345678" />
                        </div>
                        <div className="md:col-span-2">
                            <button type="button" onClick={ambilLokasiGps} disabled={loadingGps}
                                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium disabled:opacity-50">
                                {loadingGps ? (
                                    <><i className="fas fa-spinner fa-spin mr-2"></i>Mengambil GPS...</>
                                ) : (
                                    <><i className="fas fa-crosshairs mr-2"></i>Ambil Lokasi GPS</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Data UTTP Items */}
                {uttpItems.map((item, index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <i className="fas fa-balance-scale text-indigo-500"></i>
                                UTTP #{index + 1}
                            </h2>
                            {uttpItems.length > 1 && (
                                <button type="button" onClick={() => removeUttpItem(index)}
                                    className="px-3 py-1 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                                    <i className="fas fa-trash mr-1"></i>Hapus
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Jenis UTTP *</label>
                                <select value={item.jenis_uttp} onChange={(e) => handleUttpChange(index, 'jenis_uttp', e.target.value)} required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800 bg-white">
                                    <option value="">Pilih Jenis</option>
                                    {JENIS_UTTP_LIST.map(j => <option key={j} value={j}>{j}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Merek</label>
                                <input type="text" value={item.merek} onChange={(e) => handleUttpChange(index, 'merek', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Tipe</label>
                                <input type="text" value={item.tipe} onChange={(e) => handleUttpChange(index, 'tipe', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Kapasitas</label>
                                <input type="text" value={item.kapasitas} onChange={(e) => handleUttpChange(index, 'kapasitas', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Kelas</label>
                                <input type="text" value={item.kelas} onChange={(e) => handleUttpChange(index, 'kelas', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Daya Baca</label>
                                <input type="text" value={item.daya_baca} onChange={(e) => handleUttpChange(index, 'daya_baca', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Hasil Tera</label>
                                <select value={item.hasil_tera} onChange={(e) => handleUttpChange(index, 'hasil_tera', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800 bg-white">
                                    <option value="">Pilih Hasil</option>
                                    <option value="Sah">Sah</option>
                                    <option value="Tidak Sah">Tidak Sah</option>
                                    <option value="Batal Tera">Batal Tera</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Tanggal Tera</label>
                                <input type="date" value={item.tgl_tera} onChange={(e) => handleUttpChange(index, 'tgl_tera', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Tanggal Habis Berlaku</label>
                                <input type="date" value={item.tgl_habis_berlaku} onChange={(e) => handleUttpChange(index, 'tgl_habis_berlaku', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">No. Seri</label>
                                <input type="text" value={item.no_seri} onChange={(e) => handleUttpChange(index, 'no_seri', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">No. Order</label>
                                <input type="text" value={item.no_order} onChange={(e) => handleUttpChange(index, 'no_order', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Foto Alat</label>
                                <input type="file" accept="image/*" onChange={(e) => handleFotoChange(index, e.target.files[0])}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm text-gray-800 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add More UTTP Button */}
                <button type="button" onClick={addUttpItem}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-sm font-medium">
                    <i className="fas fa-plus mr-2"></i>Tambah UTTP Lainnya
                </button>

                {/* Submit Button */}
                <button type="submit" disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm">
                    {loading ? (
                        <><i className="fas fa-spinner fa-spin mr-2"></i>Menyimpan Data...</>
                    ) : (
                        <><i className="fas fa-save mr-2"></i>Simpan Data UTTP</>
                    )}
                </button>
            </form>
        </div>
    );
}
