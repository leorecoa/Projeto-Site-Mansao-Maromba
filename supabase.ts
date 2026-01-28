// supabase.ts - Atualize para ficar assim:
import { createClient } from '@supabase/supabase-js'
import { Database } from './types/database.types'

// Validação das variáveis
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis do Supabase não encontradas!')
  console.error('URL:', supabaseUrl ? '✓' : '✗')
  console.error('Key:', supabaseAnonKey ? '✓' : '✗')
  throw new Error('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env')
}

// Cria o cliente tipado
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  },
  global: {
    headers: { 
      'x-application-name': 'mansao-maromba' 
    }
  }
})

// Teste no console (apenas desenvolvimento)
if (import.meta.env.DEV) {
  console.log('✅ Supabase configurado:', supabaseUrl.replace('https://', '').split('.')[0])
}