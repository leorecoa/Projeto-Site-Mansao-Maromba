
import React from 'react';
import { X, Trash2, Plus, Minus, CreditCard } from 'lucide-react';
import { CartItem, Theme } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  activeTheme: Theme;
  onUpdateQuantity: (id: string, q: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ 
  isOpen, 
  onClose, 
  cart, 
  total, 
  activeTheme,
  onUpdateQuantity,
  onRemove,
  onCheckout
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0a0a0a] h-full shadow-2xl flex flex-col transition-transform duration-500 transform translate-x-0 border-l border-white/5">
        <div className="p-6 flex justify-between items-center border-b border-white/5">
          <h2 className="text-2xl font-syncopate font-bold">CARRINHO</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-white flex items-center justify-center">
                <Minus size={32} />
              </div>
              <p className="font-bold uppercase tracking-widest">Seu carrinho está vazio</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 glass-card p-4 rounded-2xl relative overflow-hidden">
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: item.theme.primary }}
                />
                <div className="w-20 h-20 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                  <img src={item.image} alt={item.name} className="h-16 object-contain" />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm leading-tight">{item.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{item.volume}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3 bg-white/5 rounded-lg px-2 py-1">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-white/70"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-white/70"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">R$ {item.price.toFixed(2)}</p>
                      <p className="font-bold text-lg">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => onRemove(item.id)}
                  className="absolute top-2 right-2 text-red-500/40 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 bg-white/5 border-t border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Total do Pedido</span>
              <span className="text-3xl font-syncopate font-bold">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-95 shadow-2xl"
              style={{ 
                backgroundColor: activeTheme.primary, 
                color: '#000',
                boxShadow: `0 10px 40px ${activeTheme.glow}`
              }}
            >
              <CreditCard size={20} />
              FINALIZAR PEDIDO
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
