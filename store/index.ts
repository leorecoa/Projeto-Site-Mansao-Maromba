import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  cart: CartItem[];
  isCartOpen: boolean;
  cartTotal: number;
  cartCount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setIsCartOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      cartTotal: 0,
      cartCount: 0,

      addToCart: (product) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.id === product.id);

        let newCart;
        if (existingItem) {
          newCart = cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          newCart = [...cart, { ...product, quantity: 1 }];
        }

        const total = newCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const count = newCart.reduce((acc, item) => acc + item.quantity, 0);

        set({ cart: newCart, cartTotal: total, cartCount: count, isCartOpen: true });
      },

      removeFromCart: (productId) => {
        const { cart } = get();
        const newCart = cart.filter((item) => item.id !== productId);

        const total = newCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const count = newCart.reduce((acc, item) => acc + item.quantity, 0);

        set({ cart: newCart, cartTotal: total, cartCount: count });
      },

      updateQuantity: (productId, quantity) => {
        const { cart } = get();
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        const newCart = cart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        );

        const total = newCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const count = newCart.reduce((acc, item) => acc + item.quantity, 0);

        set({ cart: newCart, cartTotal: total, cartCount: count });
      },

      clearCart: () => set({ cart: [], cartTotal: 0, cartCount: 0 }),

      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
    }),
    {
      name: 'mansao-maromba-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);