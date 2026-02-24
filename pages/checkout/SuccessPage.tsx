import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export default function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Tenta recuperar o ID do pedido do estado da navegação (se passado pelo PaymentForm)
  // ou dos parâmetros da URL se você decidir usar query params (?orderId=...)
  const state = location.state as { orderId?: string } | null;
  const orderId = state?.orderId;

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-zinc-900 p-8 rounded-2xl border border-white/10 text-center">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">Obrigado pelo seu pedido!</h1>
        <p className="text-gray-400 mb-8">
          Sua compra foi confirmada e já estamos preparando tudo com muito carinho. Você receberá um
          email com os detalhes em breve.
        </p>

        {orderId && (
          <div className="bg-black/30 p-4 rounded-lg border border-white/5 mb-8 inline-block">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Número do Pedido</p>
            <p className="text-xl font-mono text-yellow-400">#{orderId.substring(0, 8)}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/minha-conta')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Meus Pedidos
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-500 transition-colors"
          >
            Continuar Comprando
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
