import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase';
import { Product } from '@/types';

interface ProductDBRow {
    id: string;
    name: string;
    description: string | null;
    price: number | string;
    image_url: string | null;
    volume: string | null;
    type: string | null;
    theme: Product['theme'] | null;
}

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: true });

                if (error) throw error;

                if (data) {
                    // Mapeamento resiliente para garantir compatibilidade com a interface Product
                    const mappedProducts: Product[] = data.map((item: ProductDBRow) => ({
                        id: item.id,
                        name: item.name,
                        description: item.description || '',
                        price: Number(item.price),
                        // O frontend espera 'image', mas o banco tem 'image_url'
                        image: item.image_url || 'https://via.placeholder.com/300',
                        volume: item.volume || 'N/A',
                        type: item.type || 'Geral',
                        // Garante que o tema nunca seja nulo para não quebrar o App.tsx
                        theme: item.theme || {
                            primary: '#FFD700',
                            secondary: '#000000',
                            glow: 'rgba(255, 215, 0, 0.5)',
                            text: '#FFFFFF',
                            bg: '#111111'
                        }
                    }));
                    setProducts(mappedProducts);
                }
            } catch (err) {
                console.error('Erro ao buscar produtos:', err);
                setError('Falha ao carregar produtos. Verifique sua conexão.');
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    return { products, loading, error };
}