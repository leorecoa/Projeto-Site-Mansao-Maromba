import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useToast } from './useToast';
import type { CartItem, Product } from '@/types';

interface CartState {
  cart: CartItem[];
  isCartOpen: boolean;
  isHydrated: boolean;
  cartTotal: number;
  cartCount: number;

  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setIsCartOpen: (open: boolean) => void;
  setHydrated: (value: boolean) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      isHydrated: false,
      cartTotal: 0,
      cartCount: 0,

      addToCart: (product) => {
        const { cart } = get();
        const existingItem = cart.find((i) => i.id === product.id);
        let newCart: CartItem[];

        if (existingItem) {
          newCart = cart.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
          newCart = [...cart, { ...product, quantity: 1 }];
        }

        const cartTotal = newCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const cartCount = newCart.reduce((acc, item) => acc + item.quantity, 0);

        set({ cart: newCart, cartTotal, cartCount, isCartOpen: true });

        // Dispara o toast de sucesso
        useToast.getState().addToast(`${product.name} adicionado!`, 'success');
      },

      removeFromCart: (id) => {
        const { cart } = get();
        const newCart = cart.filter((item) => item.id !== id);

        const cartTotal = newCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const cartCount = newCart.reduce((acc, item) => acc + item.quantity, 0);

        set({ cart: newCart, cartTotal, cartCount });
      },

      updateQuantity: (id, quantity) => {
        const { cart } = get();
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }

        const newCart = cart.map((item) => (item.id === id ? { ...item, quantity } : item));

        const cartTotal = newCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const cartCount = newCart.reduce((acc, item) => acc + item.quantity, 0);

        set({ cart: newCart, cartTotal, cartCount });
      },

      clearCart: () => set({ cart: [], cartTotal: 0, cartCount: 0 }),

      setIsCartOpen: (open) => set({ isCartOpen: open }),

      setHydrated: (value) => set({ isHydrated: value }),
    }),
    {
      name: 'mansao-maromba-cart',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      partialize: (state) => ({
        cart: state.cart,
        cartTotal: state.cartTotal,
        cartCount: state.cartCount,
      }),
    }
  )
);

export const useCartStore = useCart;
