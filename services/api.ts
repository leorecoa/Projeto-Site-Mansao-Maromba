import { supabase } from './supabase';
import { Product } from '../types';
import { PRODUCTS } from '../data';

/**
 * Busca produtos. 
 * Atualmente retorna dados locais, mas está pronto para o Supabase.
 */
export const getProducts = async (): Promise<Product[]> => {
    // MODO HÍBRIDO: Tenta buscar do Supabase, se falhar ou estiver vazio, usa local
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*');

        if (error) throw error;

        if (data && data.length > 0) {
            // Mapeamento necessário pois o banco retorna snake_case e JSONB
            return data.map((item: any) => ({
                ...item,
                // O campo 'theme' no banco é JSONB, o Supabase já converte para objeto JS
                theme: item.theme
            })) as Product[];
        }
    } catch (error) {
        console.log('Usando dados locais (Supabase não conectado ou vazio):', error);
    }

    // Fallback para dados locais
    return PRODUCTS;
};