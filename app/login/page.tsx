'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

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
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}
                    className="absolute -top-20 -left-20 w-96 h-96 bg-kgp-yellow/20 rounded-full blur-[100px]"
                />
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.5 }}
                    className="absolute top-40 right-10 w-64 h-64 bg-white/5 rounded-full blur-[80px]"
                />
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-kgp-dark border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 backdrop-blur-sm"
            >

                {/* Logo Header */}
                <div className="flex flex-col items-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                        className="relative w-24 h-24 mb-4"
                    >
                        <Image
                            src="/app-logo.png"
                            alt="Click KGP"
                            width={120}
                            height={120}
                            className="object-contain"
                            priority
                            unoptimized
                        />
                    </motion.div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        click<span className="text-kgp-yellow">KGP</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">Equipment Tracking System</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center"
                    >
                        {error}
                    </motion.div>
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

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-kgp-yellow text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-900/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? 'Authenticating...' : 'Login'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}
