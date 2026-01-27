import { supabase } from '../supabase';
import { PRODUCTS } from '../data/products';

export const seedProducts = async () => {
    // Confirmação para evitar cliques acidentais
    if (!confirm('Tem certeza que deseja inserir os produtos no banco de dados?')) {
        return;
    }

    console.log('Iniciando inserção de produtos...');

    // Remove o ID local (que é string ex: 'tigrinho') para que o Supabase gere um UUID novo
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const productsToInsert = PRODUCTS.map(({ id, ...rest }) => rest);

    try {
        const { data, error } = await supabase
            .from('products')
            .insert(productsToInsert)
            .select();

        if (error) throw error;

        console.log('✅ Sucesso! Produtos inseridos:', data);
        alert(`${data?.length || 0} produtos foram inseridos no banco de dados com sucesso!`);
    } catch (error: any) {
        console.error('❌ Erro ao inserir produtos:', error);
        alert(`Erro ao inserir produtos: ${error.message || 'Verifique o console para mais detalhes.'}`);
    }
};