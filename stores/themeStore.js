import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
  persist(
    (set) => ({
      currentTheme: null,
      selectedProductId: null,
      
      setTheme: (theme, productId) => set({ 
        currentTheme: theme, 
        selectedProductId: productId 
      }),
      
      resetTheme: () => set({ 
        currentTheme: null, 
        selectedProductId: null 
      })
    }),
    { name: 'maromba-theme-storage' }
  )
)