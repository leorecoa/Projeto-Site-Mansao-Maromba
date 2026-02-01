import { useEffect } from 'react'
import { useThemeStore } from '@/stores/themeStore'

export const useDynamicTheme = (selectedProduct) => {
  const setTheme = useThemeStore((state) => state.setTheme)
  
  useEffect(() => {
    if (selectedProduct?.theme) {
      const theme = selectedProduct.theme
      
      // Aplicar variáveis CSS no documento
      const root = document.documentElement
      root.style.setProperty('--color-primary', theme.primary)
      root.style.setProperty('--color-secondary', theme.secondary)
      root.style.setProperty('--color-glow', theme.glow)
      root.style.setProperty('--color-text', theme.text)
      root.style.backgroundColor = theme.bg
      
      // Salvar no estado global (Zustand)
      setTheme({
        primary: theme.primary,
        secondary: theme.secondary,
        glow: theme.glow,
        text: theme.text,
        bg: theme.bg
      })
      
      // (OPCIONAL) Tocar um som ao selecionar
      if (theme.sound) {
        const audio = new Audio(theme.sound)
        audio.volume = 0.3
        audio.play().catch(e => console.log("Auto-play bloqueado:", e))
      }
    }
  }, [selectedProduct, setTheme])
}