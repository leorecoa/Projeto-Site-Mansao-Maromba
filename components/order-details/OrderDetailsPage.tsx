import React from 'react';
import { ArrowLeft, Package, MapPin, CreditCard, Calendar, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { formatCurrency } from '@/utils/format';
import OrderStatusBadge from '@/utils/OrderStatusBadge';

interface Props {
  orderId: string;
  onBack: () => void;
}

interface OrderItemProduct {
  id: string;
  name: string;
  image_url: string | null;
}

interface OrderDetailsItem {
  id: string;
  quantity: number;
  unit_price: number;
  products: OrderItemProduct | null;
}

interface ShippingAddressSnapshot {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
}

interface OrderDetails {
  created_at: string;
  status: string;
  total_amount: number;
  order_items: OrderDetailsItem[];
  shipping_address_snapshot?: ShippingAddressSnapshot | null;
}

export default function OrderDetailsPage({ orderId, onBack }: Props) {
  const { data: order, isLoading } = useQuery<OrderDetails>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            unit_price,
            products (
              id,
              name,
              image_url
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
        <p className="text-red-400">Pedido não encontrado</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar para pedidos
      </button>
      
      <div className="bg-zinc-900 rounded-lg border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Pedido #{orderId.substring(0, 8)}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                {new Date(order.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        {/* Produtos */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white">Produtos</h2>
          </div>
          <div className="space-y-4">
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex gap-4 bg-black/30 p-4 rounded-lg">
                <div className="w-20 h-20 bg-zinc-800 rounded-lg flex-shrink-0 overflow-hidden">
                  {item.products?.image_url && (
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{item.products?.name}</h3>
                  <p className="text-gray-400 text-sm mt-1">Quantidade: {item.quantity}</p>
                  <p className="text-gray-400 text-sm">Preço unitário: {formatCurrency(item.unit_price)}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{formatCurrency(item.unit_price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Endereço de Entrega */}
        {order.shipping_address_snapshot && (
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-semibold text-white">Endereço de Entrega</h2>
            </div>
            <div className="text-gray-300 space-y-1">
              <p>{order.shipping_address_snapshot.street}, {order.shipping_address_snapshot.number}</p>
              {order.shipping_address_snapshot.complement && <p>{order.shipping_address_snapshot.complement}</p>}
              <p>{order.shipping_address_snapshot.neighborhood}</p>
              <p>{order.shipping_address_snapshot.city} - {order.shipping_address_snapshot.state}</p>
              <p>CEP: {order.shipping_address_snapshot.zip}</p>
            </div>
          </div>
        )}

        {/* Resumo do Pagamento */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white">Resumo do Pagamento</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-300">
              <span>Subtotal</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Frete</span>
              <span className="text-green-400">Grátis</span>
            </div>
            <div className="border-t border-white/10 pt-2 mt-2">
              <div className="flex justify-between text-white font-bold text-lg">
                <span>Total</span>
                <span className="text-yellow-400">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
