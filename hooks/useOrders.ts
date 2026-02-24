import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { Order } from '@/types/order';

export function useOrders() {
  const { user } = useAuth();

  const {
    data: orders,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select(
          `
                    id,
                    created_at,
                    total_amount,
                    status,
                    order_items (
                        id,
                        quantity,
                        unit_price,
                        products (
                            name,
                            image_url
                        )
                    )
                `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // O Supabase retorna relacionamentos como arrays (ex: products: [{...}]), mas nossa interface espera um objeto.
      // O 'as unknown' é necessário para permitir essa conversão de tipos incompatíveis (Double Cast).
      return data as unknown as Order[];
    },
    enabled: !!user, // Só executa se o usuário estiver logado
  });

  return { orders, loading, error };
}
