import { useState } from 'react';
import { supabase } from '@/services/supabase';

interface PaymentResult {
    success: boolean;
    paymentId?: string;
    qrCode?: string;
    error?: string;
}

export function usePayment() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const processPayment = async (orderId: string, method: 'credit_card' | 'pix' | 'boleto'): Promise<PaymentResult> => {
        setLoading(true);
        setError(null);

        try {
            // Simulação de delay de processamento (API)
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (method === 'pix') {
                // Código PIX estático para simulação
                const pixCode = "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Mansao Maromba6008Sao Paulo62070503***6304E2CA";

                // Atualiza o status do pedido para pendente/aguardando pagamento
                const { error: updateError } = await supabase
                    .from('orders')
                    .update({
                        payment_method: 'pix',
                        status: 'pending'
                    })
                    .eq('id', orderId);

                if (updateError) throw updateError;

                return { success: true, qrCode: pixCode };
            }

            // Para Cartão e Boleto, simulamos aprovação imediata
            const { error: updateError } = await supabase
                .from('orders')
                .update({
                    status: 'paid',
                    payment_method: method,
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId);

            if (updateError) throw updateError;

            return { success: true, paymentId: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}` };

        } catch (err: unknown) { // 'unknown' é mais seguro que 'any' pois obriga a verificação de tipo
            console.error('Erro no pagamento:', err);
            // Type Guard: Verifica se é um erro padrão antes de acessar .message
            const message = err instanceof Error ? err.message : 'Erro ao processar pagamento';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    return { processPayment, loading, error };
}

export default usePayment;
