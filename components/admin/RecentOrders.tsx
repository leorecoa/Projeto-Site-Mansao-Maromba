import React from 'react';
import { formatCurrency } from '@/utils/format';
import OrderStatusBadge from '@/utils/OrderStatusBadge';
import type { Order } from '@/types/order';

interface Props {
    orders: Order[];
}

export default function RecentOrders({ orders }: Props) {
    return (
        <div className="bg-zinc-900 p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Pedidos Recentes</h3>
            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="flex justify-between items-center">
                        <div>
                            <p className="font-mono text-sm text-gray-300">#{order.id.substring(0, 8)}</p>
                            <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <OrderStatusBadge status={order.status} />
                        <p className="font-semibold text-white">{formatCurrency(order.total_amount)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}