import React, { useState } from 'react';
import { useOrders } from '@/hooks/useOrders'; // Supondo que o hook exista neste caminho
import OrderItem from '@/components/account/OrderItem';
import OrderSkeleton from '@/components/account/OrderSkeleton';
import { AlertCircle, ShoppingBag } from 'lucide-react';
import OrderDetailsPage from '@/components/order-details/OrderDetailsPage';
import type { Order } from '@/types/order';

export default function MyOrders() {
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    // Adaptando para a assinatura real do hook useOrders (baseado nos erros apresentados)
    const { orders: rawOrders, loading } = useOrders();
    const orders = rawOrders as Order[]; // Tipagem explícita para corrigir o 'any' e usar a interface Order
    const isLoading = loading;
    const error = null; // O hook atual não parece retornar erro, definindo como null por enquanto

    if (selectedOrderId) {
        return (
            <OrderDetailsPage
                orderId={selectedOrderId}
                onBack={() => setSelectedOrderId(null)}
            />
        );
    }

    const renderContent = () => {
        if (isLoading) {
            return Array.from({ length: 3 }).map((_, index) => <OrderSkeleton key={index} />);
        }

        if (error) {
            return (
                <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p>Ocorreu um erro ao buscar seus pedidos. Tente novamente mais tarde.</p>
                </div>
            );
        }

        if (!orders || orders.length === 0) {
            return (
                <div className="text-center py-16 px-6 bg-zinc-900 border border-dashed border-white/10 rounded-lg">
                    <ShoppingBag className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-xl font-semibold text-white">Nenhum pedido encontrado</h3>
                    <p className="text-gray-400 mt-2">Você ainda não fez nenhuma compra. Que tal começar agora?</p>
                    <button className="mt-6 bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg hover:bg-yellow-500 transition-colors">
                        Ver Produtos
                    </button>
                </div>
            );
        }

        return orders.map((order) => (
            <div key={order.id} onClick={() => setSelectedOrderId(order.id)} className="cursor-pointer">
                <OrderItem order={order} />
            </div>
        ));
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <h1 className="text-3xl font-bold text-white mb-6">Meus Pedidos</h1>
            <div className="space-y-4">
                {renderContent()}
            </div>
        </div>
    );
}
