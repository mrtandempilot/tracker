'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FamilyMember } from '@/hooks/useRealtimeLocations';
import { Battery, Clock, Navigation } from 'lucide-react';

interface MapProps {
    members: FamilyMember[];
    selectedId: string | null;
}

// Helper to update map view
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap();
    useEffect(() => {
        // Fix for default marker icons in Leaflet + Next.js
        // @ts-ignore
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        map.setView(center, zoom, { animate: true, duration: 1 });
    }, [center, zoom, map]);
    return null;
}


export default function Map({ members, selectedId }: MapProps) {
    const selectedMember = members.find(m => m.user_id === selectedId);
    const defaultCenter: [number, number] = [0, 0];
    const zoom = 15;

    const createCustomIcon = (member: FamilyMember) => {
        return L.divIcon({
            className: 'custom-marker',
            html: `
        <div class="marker-inner" style="border-color: ${member.color}">
          ${member.avatar_url
                    ? `<img src="${member.avatar_url}" class="marker-avatar" />`
                    : `<div class="w-full h-full flex items-center justify-center text-white font-bold bg-slate-800">${member.display_name[0]}</div>`
                }
        </div>
      `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
        });
    };

    return (
        <div className="w-full h-full relative">
            <MapContainer
                center={defaultCenter}
                zoom={3}
                scrollWheelZoom={true}
                className="w-full h-full"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {members.map((member) => (
                    member.last_location && (
                        <Marker
                            key={member.user_id}
                            position={[member.last_location.latitude, member.last_location.longitude]}
                            icon={createCustomIcon(member)}
                        >
                            <Popup>
                                <div className="flex flex-col gap-3 min-w-[200px]">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                            style={{ backgroundColor: member.color }}
                                        >
                                            {member.display_name[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg leading-none">{member.display_name}</h4>
                                            <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(member.last_location.timestamp).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-white/5 rounded-lg p-2 flex flex-col items-center">
                                            <Battery className={`w-4 h-4 mb-1 ${member.last_location.battery_level < 20 ? 'text-red-500' : 'text-green-500'}`} />
                                            <span className="text-sm font-bold">{member.last_location.battery_level}%</span>
                                            <span className="text-[10px] text-gray-500 uppercase">Battery</span>
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-2 flex flex-col items-center">
                                            <Navigation className="w-4 h-4 mb-1 text-blue-500" />
                                            <span className="text-sm font-bold">{member.last_location.accuracy?.toFixed(0)}m</span>
                                            <span className="text-[10px] text-gray-500 uppercase">Accuracy</span>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}

                {selectedMember?.last_location && (
                    <ChangeView
                        center={[selectedMember.last_location.latitude, selectedMember.last_location.longitude]}
                        zoom={zoom}
                    />
                )}
            </MapContainer>

            {/* Map Controls */}
            <div className="absolute bottom-10 right-10 z-[1000] flex flex-col gap-2">
                <button className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl text-white hover:bg-white/20 transition-all shadow-xl">
                    <Navigation className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
