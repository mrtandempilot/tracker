import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL is missing. Build may fail or features may be limited.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

