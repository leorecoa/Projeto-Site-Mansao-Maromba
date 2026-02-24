import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { Order } from '@/types/order';

export function useAdminOrders() {
  const { user } = useAuth();

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      if (!user) return [];

      // Verifica se é admin antes de buscar (segurança extra além do RLS)
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        throw new Error('Acesso não autorizado');
      }

      const { data, error } = await supabase
        .from('orders')
        .select(
          `
                    *,
                    order_items (
                        *,
                        products (
                            name,
                            image_url
                        )
                    ),
                    customers (
                        full_name,
                        email
                    )
                `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as Order[];
    },
    enabled: !!user,
  });

  return { orders, isLoading, error };
}
