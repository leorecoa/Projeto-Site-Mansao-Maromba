import { useState } from 'react';
import { supabase } from '@/services/supabase';
import { getErrorMessage } from '@/utils/errors';
import { logError } from '@/utils/logger';
import { createRequestId, trackEvent } from '@/utils/observability';

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
        const requestId = createRequestId('payment');
        setLoading(true);
        setError(null);
        trackEvent('payment_started', { request_id: requestId, order_id: orderId, method });

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

                trackEvent('payment_pix_pending', { request_id: requestId, order_id: orderId });
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

            trackEvent('payment_marked_paid', { request_id: requestId, order_id: orderId, method });
            return { success: true, paymentId: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}` };

        } catch (err: unknown) {
            logError('usePayment.processPayment', err);
            const message = getErrorMessage(err, 'Erro ao processar pagamento');
            trackEvent('payment_failed', { request_id: requestId, order_id: orderId, method, error_message: message });
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    return { processPayment, loading, error };
}

export default usePayment;
