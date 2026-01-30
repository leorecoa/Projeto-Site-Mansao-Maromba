
import { createClient } from '@supabase/supabase-js';
import { Product } from '../types';

// O Supabase exige URL e Anon Key. 
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const productsService = {
  getProducts: async (): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      return (data || []).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: Number(p.price),
        image: p.image_url || 'https://i.imgur.com/iFgXsaT.png',
        volume: p.volume || '1L',
        type: p.type || 'Cocktail',
        theme: p.theme || {
          primary: '#ff0000',
          secondary: '#4b0000',
          glow: 'rgba(255, 0, 0, 0.8)',
          text: '#FFFFFF',
          bg: 'linear-gradient(180deg, #1a0000 0%, #000000 100%)'
        }
      }));
    } catch (err) {
      console.error('Erro ao buscar produtos do Supabase:', err);
      return []; 
    }
  }
};

export const ordersService = {
  createOrder: async (customerData: any, cartItems: any[], total: number) => {
    try {
      // 1. Criar ou Atualizar Cliente
      const { data: customer, error: custError } = await supabase
        .from('customers')
        .upsert({ 
          email: customerData.email,
          full_name: customerData.name,
          phone: customerData.phone,
          address_street: customerData.address,
          address_city: customerData.city,
          address_zip: customerData.zip
        }, { onConflict: 'email' })
        .select()
        .single();

      if (custError) throw custError;

      // 2. Criar o Pedido
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customer.id,
          total_amount: total,
          status: 'pending',
          payment_method: customerData.paymentMethod || 'credit_card'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 3. Inserir itens do pedido
      const itemsToInsert = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      return { success: true, orderId: order.id };
    } catch (err) {
      console.error('Erro ao processar pedido no Supabase:', err);
      throw err;
    }
  }
};
