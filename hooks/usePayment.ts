import { useState } from 'react';
import { supabase } from '@/services/supabase';
import { getErrorMessage } from '@/utils/errors';
import { logError } from '@/utils/logger';

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
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (method === 'pix') {
                const pixCode = '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Mansao Maromba6008Sao Paulo62070503***6304E2CA';

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

        } catch (err: unknown) {
            logError('usePayment.processPayment', err);
            const message = getErrorMessage(err, 'Erro ao processar pagamento');
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    return { processPayment, loading, error };
}

export default usePayment;
