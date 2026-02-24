import { createClient } from '@supabase/supabase-js';

// IMPORTANTE: Não commitar este arquivo com credenciais reais
// Use variáveis de ambiente em produção

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
