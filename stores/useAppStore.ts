import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface CartItem extends Product {
    quantity: number;
}

interface AppState {
    cart: CartItem[];
    cartTotal: number;
    currentTheme: any | null;
    user: any | null;
    walletBalance: number;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    updateWalletBalance: (newBalance: number) => void;
    setUser: (userData: any) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            cart: [],
            cartTotal: 0,
            currentTheme: null,
            user: null,
            walletBalance: 0,

            addToCart: (product) => {
                const currentCart = get().cart;
                const existingItem = currentCart.find(item => item.id === product.id);

                let updatedCart;
                if (existingItem) {
                    updatedCart = currentCart.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    updatedCart = [...currentCart, { ...product, quantity: 1 }];
                }

                const newTotal = updatedCart.reduce((sum, item) =>
                    sum + (item.price * item.quantity), 0
                );

                set({ cart: updatedCart, cartTotal: newTotal });

                if (product.theme) {
                    set({ currentTheme: product.theme });
                }
            },

            removeFromCart: (productId) => {
                const currentCart = get().cart;
                const updatedCart = currentCart.filter(item => item.id !== productId);
                const newTotal = updatedCart.reduce((sum, item) =>
                    sum + (item.price * item.quantity), 0
                );

                set({ cart: updatedCart, cartTotal: newTotal });
            },

            clearCart: () => set({ cart: [], cartTotal: 0 }),

            updateWalletBalance: (newBalance) => set({ walletBalance: newBalance }),

            setUser: (userData) => set({ user: userData })
        }),
        { name: 'maromba-app-storage' }
    )
);