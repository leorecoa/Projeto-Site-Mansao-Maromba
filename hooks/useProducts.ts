import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Product } from '../types';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            // Busca todos os produtos ordenados por data de criação
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (data) {
                // Mapeia os dados para garantir compatibilidade com a interface Product
                const formattedProducts: Product[] = data.map((item) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: Number(item.price), // Garante que o preço seja numérico
                    volume: item.volume,
                    type: item.type,
                    image_url: item.image_url,
                    theme: item.theme, // O Supabase já retorna JSONB como objeto
                }));
                setProducts(formattedProducts);
            }
        } catch (err: any) {
            console.error('Erro ao buscar produtos:', err.message);
            setError(err.message || 'Erro desconhecido ao buscar produtos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return { products, loading, error, refetch: fetchProducts };
};