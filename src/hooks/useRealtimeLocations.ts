'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Location {
    id: number;
    user_id: string;
    latitude: number;
    longitude: number;
    battery_level: number;
    accuracy: number;
    timestamp: string;
}

export interface FamilyMember {
    user_id: string;
    display_name: string;
    family_id: string;
    color: string;
    avatar_url: string;
    last_location?: Location;
}

export function useRealtimeLocations() {
    const [members, setMembers] = useState<FamilyMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            // Fetch all members (simplified for no-login flow)
            const { data: familyMembers, error: membersError } = await supabase
                .from('family_members')
                .select('*');

            if (membersError || !familyMembers) {
                console.error('Error fetching members:', membersError);
                setLoading(false);
                return;
            }

            // Fetch latest location for each member
            const memberIds = familyMembers.map(m => m.user_id);
            const { data: latestLocations, error: locationsError } = await supabase
                .from('locations')
                .select('*')
                .in('user_id', memberIds)
                .order('timestamp', { ascending: false });

            if (locationsError) {
                console.error('Error fetching locations:', locationsError);
            }

            // Group locations by user_id and take the latest
            const membersWithLocations = familyMembers.map(member => {
                const lastLoc = latestLocations?.find(loc => loc.user_id === member.user_id);
                return { ...member, last_location: lastLoc };
            });

            setMembers(membersWithLocations);
            setLoading(false);
        }

        fetchData();

        // Subscribe to NEW location inserts
        const channel = supabase
            .channel('realtime_locations')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'locations',
                },
                (payload) => {
                    const newLoc = payload.new as Location;
                    setMembers(prev => prev.map(member =>
                        member.user_id === newLoc.user_id
                            ? { ...member, last_location: newLoc }
                            : member
                    ));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return { members, loading };
}
