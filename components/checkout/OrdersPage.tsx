import React, { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/hooks/useAuth';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  tracking_code: string | null;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
      setLoading(false);
    }

    fetchOrders();
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">Meus Pedidos</h1>
        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-400">Carregando pedidos...</p>
          ) : orders.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <p className="text-gray-300">Você ainda não fez nenhum pedido.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white/5 border border-white/10 rounded-xl p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">Pedido #{order.id.slice(0, 8)}</p>
                  <p className="text-xl font-bold text-white">R$ {Number(order.total_amount).toFixed(2)}</p>
                  <p className="text-sm text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                    }`}>
                    {order.status}
                  </span>
                  {order.tracking_code && (
                    <p className="text-xs text-gray-400 mt-2">Rastreio: {order.tracking_code}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}