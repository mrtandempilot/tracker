import { createClient } from '@supabase/supabase-js';

// Fallback values for build-time evaluation when environment variables are not available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn('NEXT_PUBLIC_SUPABASE_URL is missing. Using placeholder for build phase.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


