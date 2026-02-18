'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AdminPanel() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [camName, setCamName] = useState('');
    const [camSerial, setCamSerial] = useState('');

    const createUser = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/admin/create-user', {
            method: 'POST',
            body: JSON.stringify({ name, username, password })
        });
        alert('User Created');
        setName(''); setUsername(''); setPassword('');
    };

    const createCamera = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/admin/create-camera', {
            method: 'POST',
            body: JSON.stringify({ name: camName, serialNumber: camSerial })
        });
        alert('Camera Created');
        setCamName(''); setCamSerial('');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="p-6 bg-kgp-dark rounded-2xl border border-white/5 mt-8 relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-kgp-yellow to-transparent opacity-20" />
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <span className="text-kgp-yellow">Admin</span> Control
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-gray-500">Register New User</h3>
                    <form onSubmit={createUser} className="space-y-3">
                        <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-lg bg-black border border-gray-800 text-white focus:border-kgp-yellow focus:outline-none transition-colors" required />
                        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-3 rounded-lg bg-black border border-gray-800 text-white focus:border-kgp-yellow focus:outline-none transition-colors" required />
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-lg bg-black border border-gray-800 text-white focus:border-kgp-yellow focus:outline-none transition-colors" required />
                        <button type="submit" className="w-full bg-white text-black font-bold p-3 rounded-lg hover:bg-gray-200 transition-colors">Create User</button>
                    </form>
                </div>

                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-gray-500">Add New Camera</h3>
                    <form onSubmit={createCamera} className="space-y-3">
                        <input type="text" placeholder="Camera Name" value={camName} onChange={e => setCamName(e.target.value)} className="w-full p-3 rounded-lg bg-black border border-gray-800 text-white focus:border-kgp-yellow focus:outline-none transition-colors" required />
                        <input type="text" placeholder="Serial Number" value={camSerial} onChange={e => setCamSerial(e.target.value)} className="w-full p-3 rounded-lg bg-black border border-gray-800 text-white focus:border-kgp-yellow focus:outline-none transition-colors" required />
                        <button type="submit" className="w-full bg-kgp-yellow text-black font-bold p-3 rounded-lg hover:bg-yellow-400 transition-colors">Add Camera</button>
                    </form>
                </div>
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white">Maintenance Mode</h3>
                        <p className="text-gray-500 text-sm">Pause the entire website for non-admin users.</p>
                    </div>
                    <button
                        onClick={async () => {
                            if (!confirm('Are you sure you want to toggle maintenance mode?')) return;
                            try {
                                const res = await fetch('/api/admin/maintenance', { method: 'POST' });
                                if (res.ok) {
                                    alert('Maintenance Mode Updated');
                                    // Optional: Refresh state
                                } else {
                                    alert('Failed to update maintenance mode');
                                }
                            } catch (e) {
                                alert('Error updating maintenance mode');
                            }
                        }}
                        className="px-4 py-2 bg-red-500/20 text-red-500 border border-red-500/50 rounded-lg font-bold hover:bg-red-500/30 transition-all"
                    >
                        Toggle Status
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
