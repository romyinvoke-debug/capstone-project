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
    const passwordRef = useRef(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (callbackError && !error) {
        setError('Username atau password salah. Silakan coba lagi.');
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        const passwordToSend = passwordRef.current?.value || '';

        if (passwordRef.current) {
            passwordRef.current.value = '';
        }

        try {
            const result = await signIn('credentials', {
                username: username,
                password: passwordToSend,
                redirect: false,
                callbackUrl: '/'
            });

            if (result.error) {
                setError('Username atau password salah.');
                setUsername('');
            } else {
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400 animate-gradient-shift">
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mb-4 shadow-lg">
                            <i className="fas fa-balance-scale text-white text-2xl"></i>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">SIMETRI</h1>
                        <p className="text-gray-500 text-sm mt-1">Sistem Informasi Metrologi</p>
                    </div>

                    <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">Login</h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                            <i className="fas fa-exclamation-circle"></i> {error}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1.5">Username</label>
                            <input
                                id="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-800"
                                placeholder="Masukkan username"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1.5">Password</label>
                            <input
                                id="password"
                                type="password"
                                required
                                ref={passwordRef}
                                autoComplete="current-password"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-800"
                                placeholder="Masukkan password"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {loading ? (
                                <><i className="fas fa-spinner fa-spin mr-2"></i>Memeriksa...</>
                            ) : (
                                <><i className="fas fa-sign-in-alt mr-2"></i>Login</>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Belum punya akun?{' '}
                        <Link href="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
                            Daftar di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400"><p className="text-white text-lg">Loading...</p></div>}>
            <LoginForm />
        </Suspense>
    );
}
