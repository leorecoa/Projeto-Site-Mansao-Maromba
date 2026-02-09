import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  image_url: string
  volume: string
  type: string
  quantity: number
}

interface AppStore {
  cart: CartItem[]
  user: any | null
  theme: any
  cartTotal: number
  cartCount: number
  
  addToCart: (product: any) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setUser: (user: any) => void
  logout: () => void
  setTheme: (theme: any) => void
}

export const useStore = create<AppStore>()((
  persist(
    (set, get) => ({
      cart: [],
      user: null,
      theme: null,
      cartTotal: 0,
      cartCount: 0,

      addToCart: (product: any) => {
        const cart = get().cart
        const existing = cart.find((item: CartItem) => item.id === product.id)
        
        let newCart: CartItem[]
        if (existing) {
          newCart = cart.map((item: CartItem) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        } else {
          newCart = [...cart, { ...product, quantity: 1 }]
        }
        
        const total = newCart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0)
        const count = newCart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
        
        set({ cart: newCart, cartTotal: total, cartCount: count })
      },

      removeFromCart: (id: string) => {
        const newCart = get().cart.filter((item: CartItem) => item.id !== id)
        const total = newCart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0)
        const count = newCart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
        set({ cart: newCart, cartTotal: total, cartCount: count })
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(id)
        } else {
          const newCart = get().cart.map((item: CartItem) =>
            item.id === id ? { ...item, quantity } : item
          )
          const total = newCart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0)
          const count = newCart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
          set({ cart: newCart, cartTotal: total, cartCount: count })
        }
      },

      clearCart: () => set({ cart: [], cartTotal: 0, cartCount: 0 }),
      setUser: (user: any) => set({ user }),
      logout: () => set({ user: null, cart: [], cartTotal: 0, cartCount: 0 }),
      setTheme: (theme: any) => set({ theme }),
    }),
    {
      name: 'maromba-store',
    }
  ) as any
))