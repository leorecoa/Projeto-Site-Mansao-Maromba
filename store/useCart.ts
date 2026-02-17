import { create } from 'zustand'
import type { CartItem } from '@/types'


interface CartState {
  cart: CartItem[]
  isCartOpen: boolean
  isHydrated: boolean

  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setIsCartOpen: (open: boolean) => void
  setHydrated: (value: boolean) => void
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  isCartOpen: false,
  isHydrated: true, // deixe true se não estiver usando persist

  addToCart: (item) => {
    const existingItem = get().cart.find((i) => i.id === item.id)

    if (existingItem) {
      set((state) => ({
        cart: state.cart.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        ),
      }))
    } else {
      set((state) => ({
        cart: [...state.cart, item],
      }))
    }
  },

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),

  clearCart: () => set({ cart: [] }),

  setIsCartOpen: (open) => set({ isCartOpen: open }),

  setHydrated: (value) => set({ isHydrated: value }),
}))
