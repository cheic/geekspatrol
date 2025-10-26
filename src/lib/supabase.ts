import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables Supabase manquantes!');
  console.error('URL:', supabaseUrl);
  console.error('Key présente:', !!supabaseAnonKey);
  throw new Error('Configuration Supabase invalide - vérifiez vos variables d\'environnement');
}

console.log('✅ Supabase configuré avec URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});