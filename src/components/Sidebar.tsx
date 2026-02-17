'use client';

import { FamilyMember } from '@/hooks/useRealtimeLocations';
import { Battery, BatteryLow, BatteryMedium, BatteryFull, Clock, MapPin } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SidebarProps {
    members: FamilyMember[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export default function Sidebar({ members, selectedId, onSelect }: SidebarProps) {
    const getBatteryIcon = (level: number) => {
        if (level > 80) return <BatteryFull className="w-4 h-4 text-green-500" />;
        if (level > 50) return <BatteryMedium className="w-4 h-4 text-yellow-500" />;
        if (level > 20) return <BatteryLow className="w-4 h-4 text-orange-500" />;
        return <Battery className="w-4 h-4 text-red-500 animate-pulse" />;
    };

    const formatLastSeen = (timestamp?: string) => {
        if (!timestamp) return 'Never seen';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 60000); // mins

        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff}m ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="w-full md:w-80 h-full bg-black/40 backdrop-blur-2xl border-l border-white/10 flex flex-col z-20 overflow-hidden">
            <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <MapPin className="text-blue-500" />
                    Family Members
                </h2>
                <p className="text-gray-400 text-xs mt-1">{members.length} members tracking</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {members.map((member) => (
                    <button
                        key={member.user_id}
                        onClick={() => onSelect(member.user_id)}
                        className={cn(
                            "w-full text-left p-4 rounded-2xl border transition-all duration-300 group relative overflow-hidden",
                            selectedId === member.user_id
                                ? "bg-white/10 border-white/20 shadow-lg ring-1 ring-white/20"
                                : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
                        )}
                    >
                        {/* Active Indicator */}
                        {selectedId === member.user_id && (
                            <div
                                className="absolute left-0 top-0 bottom-0 w-1"
                                style={{ backgroundColor: member.color }}
                            />
                        )}

                        <div className="flex items-center gap-4 relative z-10">
                            <div
                                className="w-12 h-12 rounded-full border-2 p-0.5 flex-shrink-0"
                                style={{ borderColor: member.color }}
                            >
                                {member.avatar_url ? (
                                    <img src={member.avatar_url} alt={member.display_name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg">
                                        {member.display_name[0]}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                                        {member.display_name}
                                    </h3>
                                    {member.last_location?.battery_level !== undefined && (
                                        <div className="flex items-center gap-1 bg-black/20 px-1.5 py-0.5 rounded-md">
                                            {getBatteryIcon(member.last_location.battery_level)}
                                            <span className="text-[10px] font-medium text-gray-300">
                                                {member.last_location.battery_level}%
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Clock className="w-3 h-3" />
                                        {formatLastSeen(member.last_location?.timestamp)}
                                    </div>
                                    {member.last_location ? (
                                        <div className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[10px] text-green-500/80 font-medium">Live</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                                            <span className="text-[10px] text-gray-500 font-medium">Offline</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
        </div>
    );
}
