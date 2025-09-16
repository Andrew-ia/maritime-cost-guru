import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vijudxopszufoqvrwspg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpanVkeG9wc3p1Zm9xdnJ3c3BnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NjMxOTEsImV4cCI6MjA3MzUzOTE5MX0.WbUdinPVI9hecQFsb2x_hfEtmSObzxQQiahZS54NsC0';

console.log('Supabase Config:', { 
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  envKeys: Object.keys(import.meta.env),
  env: import.meta.env.MODE
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    envMode: import.meta.env.MODE
  });
  throw new Error('Missing Supabase environment variables. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
    },
  },
});