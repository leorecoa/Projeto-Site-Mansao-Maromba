import React from 'react';
import { formatCurrency } from '@/utils/format';
import OrderStatusBadge from '@/utils/OrderStatusBadge';
import { Package } from 'lucide-react';
import type { Order } from '@/types/order';

interface Props {
    order: Order;
}

export default function OrderItem({ order }: Props) {
    const firstItem = order.order_items[0]?.products;
    const remainingItemsCount = order.order_items.length - 1;

    return (
        <div className="bg-zinc-900 p-4 rounded-lg border border-white/10 transition-all hover:border-yellow-400/50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-mono text-sm text-gray-400">
                    Pedido <span className="text-yellow-400">#{order.id.substring(0, 8)}</span>
                </h3>
                <span className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                </span>
            </div>

            <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex-shrink-0 bg-black/50 rounded-md flex items-center justify-center">
                    {firstItem?.image_url ? (
                        <img src={firstItem.image_url} alt={firstItem.name} className="w-full h-full object-cover rounded-md" />
                    ) : (
                        <Package className="w-8 h-8 text-gray-500" />
                    )}
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-white">{firstItem?.name || 'Produto indisponível'}</p>
                    {remainingItemsCount > 0 && (
                        <p className="text-sm text-gray-400">+ {remainingItemsCount} outro(s) item(ns)</p>
                    )}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-400">Total</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(order.total_amount)}</p>
                </div>
                <OrderStatusBadge status={order.status} />
            </div>
        </div>
    );
}