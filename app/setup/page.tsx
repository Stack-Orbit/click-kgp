'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SetupPage() {
    const [status, setStatus] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const createAdmin = async () => {
        setLoading(true);
        setStatus({ message: 'Creating Owner...', type: 'info' });

        try {
            const res = await fetch('/api/admin/create-user', {
                method: 'POST',
                body: JSON.stringify({
                    name: 'Super Admin',
                    username: 'owner',
                    password: 'owner123',
                    role: 'ADMIN'
                })
            });

            if (res.ok) {
                setStatus({ message: 'Success! Redirecting to Login...', type: 'success' });
                setTimeout(() => router.push('/login'), 1500);
            } else {
                const data = await res.json();
                setStatus({ message: `Failed: ${data.error || 'Unknown error'}`, type: 'error' });
                setLoading(false);
            }
        } catch (e: any) {
            setStatus({ message: `Network Error: ${e.message}`, type: 'error' });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}
                    className="absolute bottom-0 left-0 w-full h-1/2 bg-kgp-yellow/5 blurred-bg"
                />
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring" }}
                className="bg-kgp-dark border border-kgp-yellow/20 p-8 rounded-2xl max-w-md text-center relative z-10"
            >
                <h1 className="text-3xl font-bold mb-4 text-kgp-yellow">Emergency Admin Setup</h1>
                <p className="text-gray-400 mb-8">
                    Click the button below to create a Super Admin account.
                </p>

                <div className="bg-gray-900 p-4 rounded mb-6 text-left font-mono text-sm text-gray-300 border border-white/5">
                    <p>Username: <span className="text-white">owner</span></p>
                    <p>Password: <span className="text-white">owner123</span></p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={createAdmin}
                    disabled={loading}
                    className="w-full bg-kgp-yellow text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-900/20"
                >
                    {loading ? 'Creating...' : 'Create Owner Account'}
                </motion.button>

                {status.message && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className={`mt-6 font-bold text-sm ${status.type === 'success' ? 'text-green-400' :
                                status.type === 'error' ? 'text-red-400' : 'text-blue-400'
                            }`}
                    >
                        {status.message}
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
}
