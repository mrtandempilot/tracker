'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRealtimeLocations } from '@/hooks/useRealtimeLocations';
import Sidebar from '@/components/Sidebar';
import { Loader2, MapPin, Settings, User } from 'lucide-react';

// Dynamically import map to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-[#0f172a] text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center animate-pulse">
                    <MapPin className="text-blue-500 w-8 h-8" />
                </div>
                <p className="text-gray-400 font-medium animate-pulse">Initializing Map Engine...</p>
            </div>
        </div>
    )
});

export default function Dashboard() {
    const { members, loading } = useRealtimeLocations();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-gray-400">Syncing Family Signal...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="flex h-screen w-screen overflow-hidden bg-[#0a0a0b] text-white">
            {/* Top Header Floating */}
            <div className="absolute top-6 left-6 right-6 md:right-auto md:left-6 z-30 flex items-center gap-4">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <MapPin className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-none tracking-tight">Family Pulse</h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Real-time GPS Monitoring</p>
                    </div>
                </div>

                <div className="hidden md:flex bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
                    <button className="p-2 hover:bg-white/10 rounded-xl transition-all">
                        <User className="w-5 h-5 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-xl transition-all">
                        <Settings className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            </div>

            <div className="flex-1 relative flex flex-col md:flex-row h-full w-full">
                {/* Map Area */}
                <div className="flex-1 h-[60vh] md:h-full relative overflow-hidden">
                    <Map members={members} selectedId={selectedId} />
                </div>

                {/* Sidebar */}
                <Sidebar
                    members={members}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                />
            </div>
        </main>
    );
}
