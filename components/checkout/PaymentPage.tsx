import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { CheckCircle, Copy, ArrowRight, Loader2 } from 'lucide-react';
import CheckoutSteps from './CheckoutSteps';

interface OrderDetails {
    id: string;
    total_amount: number;
}

export default function PaymentPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<OrderDetails | null>(null);

    // Simulação de código PIX
    const pixCode = "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Mansao Maromba6008Sao Paulo62070503***6304E2CA";

    useEffect(() => {
        async function fetchOrder() {
            if (!orderId) return;
            const { data } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();

            if (data) setOrder(data);
            setLoading(false);
        }
        fetchOrder();
    }, [orderId]);

    const copyPix = () => {
        navigator.clipboard.writeText(pixCode);
        alert('Código PIX copiado!');
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;
    if (!order) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Pedido não encontrado</div>;

    return (
        <div className="min-h-screen bg-black text-white pt-24 px-4">
            {/* Steps Indicator */}
            <CheckoutSteps currentStep="payment" />

            <div className="max-w-2xl mx-auto bg-zinc-900 border border-white/10 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">Pedido Realizado!</h1>
                <p className="text-gray-400 mb-8">Pedido #{order.id.slice(0, 8)} • Valor: R$ {order.total_amount.toFixed(2)}</p>

                <div className="bg-black/50 p-6 rounded-xl border border-white/10 mb-8">
                    <h3 className="text-yellow-400 font-bold mb-4">Pagamento via PIX</h3>

                    {/* QR Code Placeholder */}
                    <div className="w-48 h-48 bg-white mx-auto mb-4 rounded-lg flex items-center justify-center">
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${pixCode}`}
                            alt="QR Code PIX"
                            className="w-44 h-44"
                        />
                    </div>

                    <div className="flex items-center gap-2 bg-zinc-800 p-3 rounded-lg border border-white/5">
                        <code className="text-xs text-gray-400 truncate flex-1">{pixCode}</code>
                        <button onClick={copyPix} className="p-2 hover:bg-white/10 rounded-md transition-colors">
                            <Copy className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => navigate('/orders')}
                        className="w-full py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition flex items-center justify-center gap-2"
                    >
                        Ver Meus Pedidos <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-3 bg-transparent border border-white/10 text-white font-bold rounded-xl hover:bg-white/5 transition"
                    >
                        Voltar para a Loja
                    </button>
                </div>
            </div>
        </div>
    );
}