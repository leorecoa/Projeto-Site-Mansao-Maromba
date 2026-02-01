import { supabase } from './supabase';

export async function getReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar reviews:', error);
    return [];
  }

  return data ?? [];
}
