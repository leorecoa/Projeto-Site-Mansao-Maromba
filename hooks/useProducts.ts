import { useState, useEffect } from 'react';
import { Product } from '../types';
import { getProducts } from '../services/api';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error('Erro ao carregar produtos:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { products, loading };
};