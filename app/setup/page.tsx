'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
    const [status, setStatus] = useState('');
    const router = useRouter();

    const createAdmin = async () => {
        setStatus('Creating Owner...');
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
            setStatus('Success! Redirecting to Login...');
            setTimeout(() => router.push('/login'), 1000);
        } else {
            setStatus('Failed. Check console.');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="bg-kgp-dark border border-kgp-yellow/20 p-8 rounded-2xl max-w-md text-center">
                <h1 className="text-3xl font-bold mb-4 text-kgp-yellow">Emergency Admin Setup</h1>
                <p className="text-gray-400 mb-8">
                    Click the button below to create a Super Admin account.
                </p>

                <div className="bg-gray-900 p-4 rounded mb-6 text-left font-mono text-sm text-gray-300">
                    <p>Username: <span className="text-white">owner</span></p>
                    <p>Password: <span className="text-white">owner123</span></p>
                </div>

                <button
                    onClick={createAdmin}
                    className="w-full bg-kgp-yellow text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors"
                >
                    Create Owner Account
                </button>

                {status && <p className="mt-4 text-green-400 font-bold animate-pulse">{status}</p>}
            </div>
        </div>
    );
}
