import React from 'react';
import { useCartStore as useCart } from '@/store/useCart';
import { X, Minus, Plus, Trash2, ShoppingBag, Loader2 } from 'lucide-react';
import type { Theme } from '@/types';

interface CartModalProps {
    activeTheme?: Theme;
    onCheckout: () => void;
}

export default function CartModal({ onCheckout }: CartModalProps) {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, isHydrated } = useCart();

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const loading = !isHydrated;

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-zinc-900 h-full shadow-2xl flex flex-col border-l border-white/10 transform transition-transform duration-300">

                {/* Header */}
                <div className="p-6 flex items-center justify-between border-b border-white/10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-yellow-400" />
                        Carrinho
                    </h2>
                    <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-2 text-yellow-400" />
                        <p>Carregando carrinho...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                                    <ShoppingBag className="w-16 h-16 opacity-20" />
                                    <p>Seu carrinho está vazio</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="text-yellow-400 hover:text-yellow-300 font-bold"
                                    >
                                        Continuar Comprando
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                                        <div className="w-20 h-20 bg-black/20 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-white line-clamp-1">{item.name}</h3>
                                                <p className="text-yellow-400 font-bold">R$ {item.price.toFixed(2)}</p>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-3 bg-black/40 rounded-lg p-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:bg-white/10 rounded transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4 text-gray-400" />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:bg-white/10 rounded transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4 text-gray-400" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 hover:bg-red-500/20 rounded-lg group transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-6 bg-zinc-900 border-t border-white/10 space-y-4">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span className="text-gray-400">Total</span>
                                    <span className="text-yellow-400">R$ {total.toFixed(2)}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={clearCart}
                                        className="py-3 px-4 rounded-xl border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white transition-all font-bold text-sm"
                                    >
                                        Limpar
                                    </button>
                                    <button
                                        onClick={onCheckout}
                                        className="py-3 px-4 rounded-xl bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20 text-sm"
                                    >
                                        Finalizar Compra
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}