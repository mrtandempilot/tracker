import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// during build time (SSR), if env vars are missing, we use a placeholder 
// to prevent the build from crashing, but we MUST ensure they are 
// available at runtime.
const isBrowser = typeof window !== 'undefined';

if (!supabaseUrl || !supabaseAnonKey) {
    if (isBrowser) {
        console.error('Supabase credentials are missing! Check your Vercel Environment Variables.');
    }
}

export const supabase = createClient(
    supabaseUrl || 'https://missing-url-in-vercel.supabase.co',
    supabaseAnonKey || 'missing-key'
);



