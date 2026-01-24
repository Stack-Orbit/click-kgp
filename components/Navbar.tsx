'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Navbar({ user }: { user: any }) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    return (
        <nav className="bg-kgp-black border-b border-gray-800 p-4 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
            <div className="container mx-auto flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                        <Image src="/logo.png" alt="Click KGP Logo" fill className="object-contain" />
                    </div>
                    {/* Split text coloring as per logo style implies: Click (White) KGP (Yellow) */}
                    <div className="font-bold text-xl tracking-tight">
                        <span>click</span> <span className="text-kgp-yellow">KGP</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm hidden sm:inline">
                        <span className="text-gray-600">Logged in as</span> <span className="text-white font-medium">{user.name}</span>
                    </span>
                    <button
                        onClick={handleLogout}
                        className="bg-kgp-yellow text-black font-bold px-4 py-1.5 rounded-full text-sm hover:brightness-110 transition-all shadow-lg shadow-yellow-900/20"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
