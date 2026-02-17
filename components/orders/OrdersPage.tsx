import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../hooks/useAuth';
import { ArrowLeft, XCircle, Loader2, Package, Calendar, CheckCircle, Clock, Truck, CreditCard } from 'lucide-react';

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
    payment_method: string;
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
                    <h1 className="text-3xl font-bold text-yellow-400 flex items-center gap-2">
                        <Package className="w-8 h-8" /> Meus Pedidos
                    </h1>
                </div>
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-zinc-900 border border-white/10 rounded-xl p-12 text-center">
                            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Nenhum pedido encontrado</h3>
                            <p className="text-gray-400">Você ainda não fez nenhuma compra na Mansão Maromba.</p>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="bg-zinc-900 border border-white/10 rounded-xl p-6 overflow-hidden hover:border-yellow-400/30 transition-colors">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 border-b border-white/5 pb-4">
                                    <div>
                                        <p className="text-sm text-gray-400 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(order.created_at).toLocaleDateString()} às {new Date(order.created_at).toLocaleTimeString()}
                                        </p>
                                        <p className="text-xs text-gray-500 font-mono mt-1">ID: {order.id}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                disabled={cancellingId === order.id}
                                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all text-xs font-bold uppercase disabled:opacity-50"
                                            >
                                                {cancellingId === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                                                Cancelar
                                            </button>
                                        )}

                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${order.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                                                order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {order.status === 'paid' ? <CheckCircle className="w-3 h-3" /> : order.status === 'pending' ? <Clock className="w-3 h-3" /> : null}
                                            {order.status === 'pending' ? 'Pendente' : order.status === 'paid' ? 'Pago' : order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {order.order_items?.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center overflow-hidden border border-white/10">
                                                    {item.products?.image_url ? (
                                                        <img src={item.products.image_url} alt={item.products.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-gray-600" />
                                                    )}
                                                </div>
                                                <span className="text-gray-300">
                                                    <span className="text-yellow-400 font-bold">{item.quantity}x</span> {item.products?.name || 'Produto indisponível'}
                                                </span>
                                            </div>
                                            <span className="text-white font-medium">R$ {item.unit_price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-2">
                                    <div className="flex items-center gap-2">
                                        <Truck className="w-4 h-4" />
                                        <span>{order.customer_address}, {order.customer_city} - {order.customer_zipcode}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {order.payment_method && (
                                            <span className="flex items-center gap-1 capitalize"><CreditCard className="w-4 h-4" /> {order.payment_method}</span>
                                        )}
                                        <p className="text-xl font-bold text-white">Total: R$ {Number(order.total_amount).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}