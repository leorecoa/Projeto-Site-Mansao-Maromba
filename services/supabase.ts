import { createClient } from '@supabase/supabase-js';

// Certifique-se de criar um arquivo .env com estas variáveis
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL ou Key não encontradas. Verifique seu arquivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Exemplo de como tipar o retorno baseado no seu schema seria ideal aqui futuramente
// import { Database } from '../types/database.types';