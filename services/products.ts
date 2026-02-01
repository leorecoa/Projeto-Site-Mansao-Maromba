import { supabase } from './supabase';

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at');

  if (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }

  return data ?? [];
}
