import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { Theme } from '../../types';

interface CartModalProps {
  activeTheme?: Theme;
  onCheckout: () => void;
}

export default function CartModal({ activeTheme, onCheckout }: CartModalProps) {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (!isCartOpen) return null;

  const primaryColor = activeTheme?.primary || '#FACC15';

  // Função auxiliar para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop - Clicar fora fecha o modal */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#111] border-l border-white/10 shadow-2xl flex flex-col h-full transform transition-transform duration-300 animate-in slide-in-from-right">

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/50">
          <h2 className="text-xl font-bold font-syncopate text-white flex items-center gap-2">
            <ShoppingBag style={{ color: primaryColor }} />
            SEU CARRINHO
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <ShoppingBag size={64} className="text-gray-600" />
              <p className="text-gray-400 text-lg">Seu carrinho está vazio.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-white underline hover:text-yellow-400"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="w-20 h-20 bg-white/5 rounded-lg flex items-center justify-center p-2">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-gray-400">{item.volume}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 bg-black/50 rounded-lg px-2 py-1 border border-white/10">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-400 hover:text-white w-6 h-6 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-400 hover:text-white w-6 h-6 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-bold text-white">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-500 hover:text-red-400 self-start p-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-black/50 space-y-4">
            <div className="flex items-center justify-between text-lg font-bold">
              <span className="text-gray-400">Total</span>
              <span className="text-2xl text-white">{formatCurrency(cartTotal)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-4 rounded-xl font-bold text-black text-lg uppercase tracking-wider hover:brightness-110 transition-all active:scale-[0.98]"
              style={{ backgroundColor: primaryColor }}
            >
              Finalizar Pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}