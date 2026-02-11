import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, CartItem } from '../types'

interface CartStore {
  cart: CartItem[]
  isCartOpen: boolean
  cartTotal: number
  cartCount: number
  
  addToCart: (product: Product) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setIsCartOpen: (isOpen: boolean) => void
}

export const useCartStore = create<CartStore>()((
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      cartTotal: 0,
      cartCount: 0,

      addToCart: (product: Product) => {
        const cart = get().cart
        const existing = cart.find(item => item.id === product.id)
        
        let newCart: CartItem[]
        if (existing) {
          newCart = cart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        } else {
          newCart = [...cart, { ...product, quantity: 1 }]
        }
        
        const total = newCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const count = newCart.reduce((sum, item) => sum + item.quantity, 0)
        
        set({ cart: newCart, cartTotal: total, cartCount: count, isCartOpen: true })
      },

      removeFromCart: (id: string) => {
        const newCart = get().cart.filter(item => item.id !== id)
        const total = newCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const count = newCart.reduce((sum, item) => sum + item.quantity, 0)
        set({ cart: newCart, cartTotal: total, cartCount: count })
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(id)
        } else {
          const newCart = get().cart.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
          const total = newCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
          const count = newCart.reduce((sum, item) => sum + item.quantity, 0)
          set({ cart: newCart, cartTotal: total, cartCount: count })
        }
      },

      clearCart: () => set({ cart: [], cartTotal: 0, cartCount: 0 }),
      setIsCartOpen: (isOpen: boolean) => set({ isCartOpen: isOpen }),
    }),
    {
      name: 'maromba-cart',
      partialize: (state) => ({ cart: state.cart, cartTotal: state.cartTotal, cartCount: state.cartCount }),
    }
  )
))