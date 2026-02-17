import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
    Package,
    Calendar,
    CreditCard,
    Loader2,
    ShoppingBag,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    AlertCircle
} from 'lucide-react';

interface OrderItem {
    product_name: string;
    quantity: number;
    unit_price: number;
}

interface Order {
    id: string;
    created_at: string;
    status: string;
    payment_method: string;
    total_amount: number;
    order_items: OrderItem[];
}

export default function OrdersPage() {
    // Utilizando o hook existente conforme solicitado
    const { orders, loading } = useOrders();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Utilitários de formatação (mantidos dentro do componente para isolamento)
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Data desconhecida';
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusConfig = (status: string) => {
        const normalizedStatus = status?.toLowerCase() || 'pending';
        switch (normalizedStatus) {
            case 'paid':
                return { label: 'Pago', color: 'text-green-400 bg-green-400/10 border-green-400/20', icon: CheckCircle };
            case 'pending':
                return { label: 'Pendente', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: Clock };
            case 'shipped':
                return { label: 'Enviado', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: Truck };
            case 'cancelled':
                return { label: 'Cancelado', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: XCircle };
            default:
                return { label: status, color: 'text-gray-400 bg-gray-400/10 border-gray-400/20', icon: Package };
        }
    };

    // 1. Loading State Global
    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
                    <p className="text-gray-400 text-sm">Carregando histórico...</p>
                </div>
            </div>
        );
    }

    // 2. Auth Guard (Proteção de Interface)
    if (!user) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-white/10">
                    <AlertCircle className="w-8 h-8 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
                <p className="text-gray-400 mb-6 max-w-md">
                    Você precisa estar logado para visualizar seus pedidos.
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-colors"
                >
                    Fazer Login
                </button>
            </div>
        );
    }

    // 3. Empty State (Sem pedidos)
    if (!orders || orders.length === 0) {
        return (
            <div className="min-h-screen bg-black pt-24 px-4 pb-12">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                        <ShoppingBag className="w-10 h-10 text-gray-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Nenhum pedido encontrado</h2>
                    <p className="text-gray-400 mb-8">Parece que você ainda não fez compras conosco.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-all transform hover:scale-105"
                    >
                        Ir para a Loja
                    </button>
                </div>
            </div>
        );
    }

    // 4. Lista de Pedidos (Renderização Principal)
    return (
        <div className="min-h-screen bg-black text-white pt-24 px-4 pb-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <Package className="text-yellow-400" />
                    Meus Pedidos
                </h1>

                <div className="space-y-6">
                    {orders.map((order: Order) => {
                        const statusConfig = getStatusConfig(order.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                            <div
                                key={order.id}
                                className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden hover:border-yellow-400/30 transition-all duration-300"
                            >
                                {/* Header do Card */}
                                <div className="p-4 md:p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(order.created_at)}
                                        </div>
                                        <p className="text-xs text-gray-500 font-mono">ID: {order.id}</p>
                                    </div>

                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium w-fit ${statusConfig.color}`}>
                                        <StatusIcon className="w-4 h-4" />
                                        {statusConfig.label}
                                    </div>
                                </div>

                                {/* Itens do Pedido */}
                                <div className="p-4 md:p-6 space-y-4">
                                    {order.order_items?.map((item: OrderItem, index: number) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-black rounded-lg border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                <Package className="w-6 h-6 text-gray-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-white line-clamp-1">{item.product_name || 'Produto sem nome'}</h3>
                                                <p className="text-sm text-gray-400">Qtd: {item.quantity} x {formatCurrency(item.unit_price)}</p>
                                            </div>
                                            <div className="text-right font-medium text-yellow-400">
                                                {formatCurrency((item.unit_price || 0) * (item.quantity || 1))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer do Card */}
                                <div className="p-4 md:p-6 bg-black/20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <CreditCard className="w-4 h-4" />
                                        Pagamento via <span className="text-white capitalize">{(order.payment_method || 'Indefinido').replace('_', ' ')}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400">Total:</span>
                                        <span className="text-xl font-bold text-white">{formatCurrency(order.total_amount || 0)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}