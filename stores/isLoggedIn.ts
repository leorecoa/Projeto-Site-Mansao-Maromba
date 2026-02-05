import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

export interface CartItem extends Product {
  quantity: number;
}

interface AppState {
  cart: CartItem[];
  cartTotal: number;
  currentTheme: any | null;
  user: any | null;
  walletBalance: number;
  isLoggedIn: boolean; // ✅ ADICIONE ESTA LINHA
  
  // Ações
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateWalletBalance: (newBalance: number) => void;
  setUser: (userData: any) => void;
  login: (userData: any) => void; // ✅ ADICIONE ESTA AÇÃO
  logout: () => void; // ✅ ADICIONE ESTA AÇÃO
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      cartTotal: 0,
      currentTheme: null,
      user: null,
      walletBalance: 0,
      isLoggedIn: false, // ✅ INICIALIZE AQUI

      // Ação de login
      login: (userData) => {
        set({ 
          user: userData, 
          isLoggedIn: true,
          walletBalance: userData.balance || 0 
        });
      },

      // Ação de logout
      logout: () => {
        set({ 
          user: null, 
          isLoggedIn: false,
          cart: [],
          cartTotal: 0 
        });
      },

      addToCart: (product) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find(
          (item) => item.id === product.id
        );

        let updatedCart: CartItem[];

        if (existingItem) {
          updatedCart = currentCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          updatedCart = [...currentCart, { ...product, quantity: 1 }];
        }

        const newTotal = updatedCart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        set({ cart: updatedCart, cartTotal: newTotal });

        if (product.theme) {
          set({ currentTheme: product.theme });
        }
      },

      removeFromCart: (productId) => {
        const updatedCart = get().cart.filter(
          (item) => item.id !== productId
        );

        const newTotal = updatedCart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        set({ cart: updatedCart, cartTotal: newTotal });
      },

      clearCart: () => set({ cart: [], cartTotal: 0 }),

      updateWalletBalance: (newBalance) =>
        set({ walletBalance: newBalance }),

      setUser: (userData) => set({ user: userData }),
    }),
    { 
      name: 'maromba-app-storage',
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn, // ✅ PERSISTA O ESTADO DE LOGIN
        walletBalance: state.walletBalance,
        cart: state.cart,
        cartTotal: state.cartTotal,
      })
    }
  )
);