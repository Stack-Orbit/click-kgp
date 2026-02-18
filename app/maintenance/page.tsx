'use client';

import { motion } from 'framer-motion';

export default function MaintenancePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-kgp-yellow/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center relative z-10 max-w-lg"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-8 flex justify-center"
                >
                    <svg
                        className="w-24 h-24 text-kgp-yellow"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                    </svg>
                </motion.div>

                <h1 className="text-4xl font-bold mb-4 tracking-tight">
                    System Under <span className="text-kgp-yellow">Maintenance</span>
                </h1>

                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    We are currently performing scheduled maintenance to improve our systems.
                    Please check back shortly.
                </p>

                <div className="inline-block px-6 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400">
                    Estimated return: <span className="text-white font-semibold">Soon</span>
                </div>
            </motion.div>
        </div>
    );
}
