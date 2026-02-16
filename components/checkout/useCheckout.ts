import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import type { CheckoutFormData } from '@/types/checkout';

export function useCheckout() {
    const navigate = useNavigate();
    const { cart, clearCart, total, loading: isCartLoading } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const processCheckout = async (data: CheckoutFormData) => {
        if (cart.length === 0) {
            setError('Seu carrinho está vazio.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Prepara os itens para o formato esperado pelo SQL (JSONB)
            const itemsPayload = cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            }));

            // Monta o endereço completo para o campo customer_address (legado/visualização simples)
            const fullAddress = `${data.shipping.street}, ${data.shipping.number} - ${data.shipping.neighborhood}`;

            const { data: response, error: rpcError } = await supabase.rpc('create_order', {
                p_user_id: user?.id || null,
                p_customer_name: data.customer.fullName,
                p_customer_email: data.customer.email,
                p_customer_phone: data.customer.phone,
                p_customer_city: data.shipping.city,
                p_customer_zipcode: data.shipping.zip,
                p_customer_address: fullAddress,
                p_shipping_address: data.shipping, // JSONB completo
                p_items: itemsPayload
            });

            if (rpcError) throw rpcError;

            if (response && response.success) {
                clearCart();
                navigate(`/checkout/payment/${response.order_id}`);
            } else {
                throw new Error('Erro desconhecido ao criar pedido.');
            }

        } catch (err: unknown) {
            console.error('Checkout error:', err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocorreu um erro desconhecido ao processar seu pedido.');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    return {
        processCheckout,
        loading,
        error,
        cart,
        cartTotal: total,
        isCartLoading
    };
}