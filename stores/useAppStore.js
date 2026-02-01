import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Carrinho de Compras
      cart: [],
      cartTotal: 0,
      
      // Tema Atual
      currentTheme: null,
      
      // Usuário e Carteira
      user: null,
      walletBalance: 0,
      
      // Ações
      addToCart: (product) => {
        const currentCart = get().cart
        const existingItem = currentCart.find(item => item.id === product.id)
        
        let updatedCart
        if (existingItem) {
          updatedCart = currentCart.map(item =>
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        } else {
          updatedCart = [...currentCart, { ...product, quantity: 1 }]
        }
        
        const newTotal = updatedCart.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0
        )
        
        set({ 
          cart: updatedCart,
          cartTotal: newTotal
        })
        
        // Aplicar tema do produto adicionado
        if (product.theme) {
          set({ currentTheme: product.theme })
        }
      },
      
      removeFromCart: (productId) => {
        const currentCart = get().cart
        const updatedCart = currentCart.filter(item => item.id !== productId)
        const newTotal = updatedCart.reduce((sum, item) => 
          sum + (item.price * item.quantity), 0
        )
        
        set({ 
          cart: updatedCart,
          cartTotal: newTotal
        })
      },
      
      clearCart: () => set({ cart: [], cartTotal: 0 }),
      
      updateWalletBalance: (newBalance) => set({ walletBalance: newBalance }),
      
      setUser: (userData) => set({ user: userData })
    }),
    { name: 'maromba-app-storage' }
  )
)