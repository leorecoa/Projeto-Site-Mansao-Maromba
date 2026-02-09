import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '../types'

interface CartItem extends Product {
  quantity: number
}

interface AppStore {
  cart: CartItem[]
  user: any | null
  theme: any
  
  addToCart: (product: Product) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setUser: (user: any) => void
  logout: () => void
  setTheme: (theme: any) => void
  
  get cartTotal(): number
  get cartCount(): number
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      cart: [],
      user: null,
      theme: null,

      addToCart: (product) => {
        const cart = get().cart
        const existing = cart.find(item => item.id === product.id)
        
        if (existing) {
          set({
            cart: cart.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          })
        } else {
          set({ cart: [...cart, { ...product, quantity: 1 }] })
        }
      },

      removeFromCart: (id) => {
        set({ cart: get().cart.filter(item => item.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id)
        } else {
          set({
            cart: get().cart.map(item =>
              item.id === id ? { ...item, quantity } : item
            )
          })
        }
      },

      clearCart: () => set({ cart: [] }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, cart: [] }),
      setTheme: (theme) => set({ theme }),

      get cartTotal() {
        return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      get cartCount() {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'maromba-store',
    }
  )
)