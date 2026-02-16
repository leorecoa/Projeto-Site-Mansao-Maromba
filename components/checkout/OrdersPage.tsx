import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, XCircle, Loader2 } from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  products: {
    name: string;
    image_url: string;
  } | null;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  tracking_code: string | null;
  order_items: OrderItem[];
  customer_address: string;
  customer_city: string;
  customer_zipcode: string;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            unit_price,
            products (
              name,
              image_url
            )
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        // O Supabase retorna order_items como array, mas precisamos garantir a tipagem
        setOrders(data as unknown as Order[]);
      }
      setLoading(false);
    }

    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.')) {
      return;
    }

    setCancellingId(orderId);

    try {
      const { data, error } = await supabase.rpc('cancel_order', {
        p_order_id: orderId,
        p_reason: 'Cancelado pelo cliente via painel'
      });

      if (error) throw error;

      if (data && data.success) {
        // Atualiza a lista localmente para refletir o cancelamento
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
      } else {
        alert('Não foi possível cancelar o pedido: ' + (data?.error || 'Erro desconhecido'));
      }
    } catch (err) {
      console.error('Erro ao cancelar:', err);
      alert('Erro ao processar o cancelamento.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="text-yellow-400" />
          </button>
          <h1 className="text-3xl font-bold text-yellow-400">Meus Pedidos</h1>
        </div>
        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-400">Carregando pedidos...</p>
          ) : orders.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <p className="text-gray-300">Você ainda não fez nenhum pedido.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white/5 border border-white/10 rounded-xl p-6 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Pedido <span className="text-white font-mono">#{order.id.slice(0, 8)}</span></p>
                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()} às {new Date(order.created_at).toLocaleTimeString()}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Botão de Cancelar (Apenas para pedidos pendentes) */}
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingId === order.id}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all text-xs font-bold uppercase disabled:opacity-50"
                      >
                        {cancellingId === order.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        Cancelar
                      </button>
                    )}

                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                      {order.status === 'pending' ? 'Pendente' : order.status === 'paid' ? 'Pago' : order.status}
                    </span>
                    <p className="text-xl font-bold text-white">R$ {Number(order.total_amount).toFixed(2)}</p>
                  </div>
                </div>

                {/* Lista de Itens */}
                <div className="border-t border-white/10 pt-4 space-y-3">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center overflow-hidden">
                          {item.products?.image_url ? (
                            <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-4 h-4 bg-gray-600 rounded-full" />
                          )}
                        </div>
                        <span className="text-gray-300">
                          <span className="text-yellow-400 font-bold">{item.quantity}x</span> {item.products?.name || 'Produto indisponível'}
                        </span>
                      </div>
                      <span className="text-gray-400">R$ {item.unit_price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Endereço e Rastreio */}
                <div className="mt-4 pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between text-xs text-gray-500 gap-2">
                  <p>Entrega em: {order.customer_address}, {order.customer_city} - {order.customer_zipcode}</p>
                  {order.tracking_code && <p className="text-yellow-400">Rastreio: {order.tracking_code}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}