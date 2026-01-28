import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Product } from '../types';

type SupabaseProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  volume: string | null;
  type: string | null;
  image_url: string | null;
  theme: any; // JSONB controlado no map
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedProducts: Product[] = (data as SupabaseProduct[]).map(
          (item) => ({
            id: item.id,
            name: item.name,
            description: item.description ?? '',
            price: item.price,
            volume: item.volume ?? '',
            type: item.type ?? '',
            image: item.image_url ?? '',
            theme: item.theme as Product['theme'],
          })
        );

        setProducts(formattedProducts);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro desconhecido ao buscar produtos';

      console.error('Erro ao buscar produtos:', message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
};
