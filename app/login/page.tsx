'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                router.push('/');
            } else {
                const data = await res.json();
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-kgp-yellow/20 rounded-full blur-[100px]" />
                <div className="absolute top-40 right-10 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
            </div>

            <div className="bg-kgp-dark border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 backdrop-blur-sm">

                {/* Logo Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative w-20 h-20 mb-4">
                        {/* Assuming Image from next/image is imported, if not I need to add import. 
                    Wait, this replace block doesnt include imports. I should check if I need to update imports.
                    The previous file content had imports at top. I am replacing lines 40-79 approx.
                    I should verify imports first? No, I am replacing the RETURN statement primarily.
                    But I need 'Image'. I better do a full file replace or check imports.
                 */}
                        <img src="/logo.png" alt="Click KGP" className="object-contain w-full h-full" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        click<span className="text-kgp-yellow">KGP</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">Equipment Tracking System</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-400">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-kgp-yellow focus:ring-1 focus:ring-kgp-yellow transition-all text-white placeholder-gray-600"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-400">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-kgp-yellow focus:ring-1 focus:ring-kgp-yellow transition-all text-white placeholder-gray-600"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-kgp-yellow text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-yellow-900/20"
                    >
                        {loading ? 'Authenticating...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
