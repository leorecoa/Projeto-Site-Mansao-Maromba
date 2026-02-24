import React from 'react';
import type { CartItem } from '@/types';

interface Props {
  items: CartItem[];
  total: number;
}

export default function OrderSummary({ items, total }: Props) {
  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-white/10 h-fit sticky top-24">
      <h2 className="text-xl font-bold text-yellow-400 mb-6">Resumo do Pedido</h2>

      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 items-start">
            <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white line-clamp-2">{item.name}</h3>
              <p className="text-xs text-gray-400 mt-1">Qtd: {item.quantity}</p>
            </div>
            <p className="text-sm font-bold text-white">
              R$ {(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 pt-4 space-y-2">
        <div className="flex justify-between text-gray-400">
          <span>Subtotal</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span>Frete</span>
          <span className="text-green-400">Grátis</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-yellow-400 pt-2 border-t border-white/10 mt-2">
          <span>Total</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
