'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Camera = {
    id: string;
    name: string;
    serialNumber: string;
    status: string;
    lastUpdate: string;
    holder: {
        id: string;
        name: string;
    } | null;
};

type User = {
    id: string;
    name: string;
};

export default function Dashboard({
    initialCameras,
    currentUser,
    allUsers
}: {
    initialCameras: Camera[];
    currentUser: User;
    allUsers: User[]
}) {
    const [cameras, setCameras] = useState(initialCameras);
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const refreshData = async () => {
        router.refresh(); // Refresh server text
        // In a real app we might re-fetch api, but for now strict refresh
        // We can also optimistically update.
        window.location.reload();
    };

    const handleStatusToggle = async (cameraId: string, currentStatus: string) => {
        setLoadingId(cameraId);
        const newStatus = currentStatus === 'AVAILABLE' ? 'IN_USE' : 'AVAILABLE';

        try {
            await fetch('/api/camera/update-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cameraId, status: newStatus }),
            });
            // specific reload or state update logic
            // optimistically update:
            setCameras(prev => prev.map(c => c.id === cameraId ? { ...c, status: newStatus } : c));
        } catch (e) {
            alert('Failed to update status');
        } finally {
            setLoadingId(null);
        }
    };

    const handleHandover = async (cameraId: string, newHolderId: string) => {
        setLoadingId(cameraId);
        try {
            await fetch('/api/camera/handover', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cameraId, newHolderId }),
            });
            window.location.reload();
        } catch (e) {
            alert('Handover failed');
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cameras.map((cam) => {
                    const isHolder = cam.holder?.id === currentUser.id;
                    const isAvailable = cam.status === 'AVAILABLE';

                    return (
                        <div
                            key={cam.id}
                            className={`
                relative p-6 rounded-2xl border transition-all shadow-xl
                ${isAvailable
                                    ? 'border-green-500/20 bg-kgp-dark hover:border-green-500/40'
                                    : 'border-red-500/20 bg-kgp-dark hover:border-red-500/40'}
              `}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-wide">{cam.name}</h3>
                                    <p className="text-xs text-gray-500 font-mono mt-1">{cam.serialNumber}</p>
                                </div>
                                <div className={`
                  px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border
                  ${isAvailable ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}
                `}>
                                    {isAvailable ? 'Available' : 'In Use'}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-6 p-3 bg-black/30 rounded-lg border border-white/5">
                                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-kgp-yellow border border-white/10">
                                    {cam.holder?.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-300">
                                        <span className="text-gray-500 text-xs uppercase tracking-wide block">Current Holder</span>
                                        {cam.holder?.name}
                                    </p>
                                </div>
                            </div>
                            {isHolder ? (
                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleStatusToggle(cam.id, cam.status)}
                                        disabled={!!loadingId}
                                        className={`
                      w-full py-2 px-4 rounded-lg font-medium transition-colors border
                      ${isAvailable
                                                ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                                                : 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'}
                    `}
                                    >
                                        {loadingId === cam.id ? 'Updating...' : isAvailable ? 'Mark as In Use' : 'Mark as Available'}
                                    </button>

                                    <div className="relative group">
                                        <select
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer hover:bg-gray-750"
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    if (confirm(`Handover ${cam.name} to ${e.target.selectedOptions[0].text}?`)) {
                                                        handleHandover(cam.id, e.target.value)
                                                    } else {
                                                        e.target.value = "";
                                                    }
                                                }
                                            }}
                                            disabled={!!loadingId}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Handover to...</option>
                                            {allUsers.filter(u => u.id !== currentUser.id).map(u => (
                                                <option key={u.id} value={u.id}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4 pt-4 border-t border-gray-800/50">
                                    <p className="text-center text-xs text-gray-500">
                                        Ask <span className="text-gray-300">{cam.holder?.name}</span> to mark available or handover.
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
