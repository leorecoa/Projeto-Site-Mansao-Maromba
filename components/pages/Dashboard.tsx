import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../layout/Navbar';
import type { Theme } from '../../types';
import { Loader, ShoppingBag, Package, Truck, CheckCircle } from 'lucide-react';

// Tipos para os dados dos pedidos - CORRIGIDOS para aceitar null
interface OrderItemProduct {
    name: string;
    image_url: string | null;  // ← ACEITA null
}

interface OrderItem {
    quantity: number;
    unit_price: number;
    products: OrderItemProduct | null;  // ← ACEITA null
}

interface Order {
    id: string;
    created_at: string | null;  // ← CORREÇÃO: ACEITA null
    total_amount: number;
    status: string | null;     
    order_items: OrderItem[];
}

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const dashboardTheme: Theme = {
        primary: '#facc15',
        secondary: '#1f2937',
        glow: 'rgba(250, 204, 21, 0.4)',
        text: '#FFFFFF',
        bg: 'linear-gradient(180deg, #111827 0%, #000000 100%)',
    };

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('orders')
                    .select(`
                        id,
                        created_at,
                        total_amount,
                        status,
                        order_items (
                            quantity,
                            unit_price,
                            products (
                                name,
                                image_url
                            )
                        )
                    `)
                    .eq('customer_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // ✅ Agora funciona porque data é compatível com Order[]
                setOrders(data || []);
            } catch (error) {
                console.error("Erro ao buscar pedidos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const getStatusIcon = (status: string | null) => {  // ← ACEITA null
        if (!status) return <ShoppingBag className="h-5 w-5 text-gray-400" />;

        switch (status.toLowerCase()) {
            case 'pending':
                return <Package className="h-5 w-5 text-yellow-400" />;
            case 'shipped':
                return <Truck className="h-5 w-5 text-blue-400" />;
            case 'delivered':
                return <CheckCircle className="h-5 w-5 text-green-400" />;
            default:
                return <ShoppingBag className="h-5 w-5 text-gray-400" />;
        }
    };

    // Função para formatar data segura
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Data não disponível';
        try {
            return new Date(dateString).toLocaleDateString('pt-BR');
        } catch {
            return 'Data inválida';
        }
    };

    return (
        <div className="min-h-screen" style={{ background: dashboardTheme.bg }}>
            <Navbar theme={dashboardTheme} />

            <main className="container mx-auto px-4 py-12 pt-24">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white font-syncopate">Meus Pedidos</h1>
                    <Link
                        to="/"
                        className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
                    >
                        Voltar para a Loja
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="animate-spin h-8 w-8 text-yellow-400" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-16 bg-white/5 rounded-lg border border-white/10">
                        <ShoppingBag className="mx-auto h-12 w-12 text-gray-500" />
                        <h3 className="mt-2 text-lg font-medium text-white">Nenhum pedido encontrado</h3>
                        <p className="mt-1 text-sm text-gray-400">Você ainda não fez nenhuma compra.</p>
                        <div className="mt-6">
                            <Link
                                to="/"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-yellow-400 hover:bg-yellow-300"
                            >
                                Começar a comprar
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
                                <div className="p-4 sm:p-6 bg-white/5 flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-yellow-400">Pedido #{order.id.substring(0, 8)}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Realizado em {formatDate(order.created_at)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-semibold text-white">
                                            R$ {order.total_amount.toFixed(2).replace('.', ',')}
                                        </p>
                                        <div className="flex items-center justify-end gap-2 mt-1 text-sm text-gray-300">
                                            {getStatusIcon(order.status)}
                                            <span className="capitalize">{order.status || 'Pendente'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 sm:p-6 border-t border-white/10">
                                    <ul className="space-y-4">
                                        {order.order_items.map((item, index) => (
                                            <li key={index} className="flex items-center gap-4">
                                                <img
                                                    src={item.products?.image_url || 'https://via.placeholder.com/100'}
                                                    alt={item.products?.name || 'Produto'}
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                                <div className="flex-grow">
                                                    <p className="font-semibold text-white">{item.products?.name || 'Produto sem nome'}</p>
                                                    <p className="text-sm text-gray-400">
                                                        {item.quantity} x R$ {item.unit_price.toFixed(2).replace('.', ',')}
                                                    </p>
                                                </div>
                                                <p className="font-semibold text-white">
                                                    R$ {(item.quantity * item.unit_price).toFixed(2).replace('.', ',')}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;