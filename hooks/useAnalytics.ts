// hooks/useAnalytics.ts
import { useEffect } from 'react'
import { useNavigation } from './useNavigation'

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

export function useAnalytics() {
  const { currentPath } = useNavigation()

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return

    // Carrega script do Google Analytics dinamicamente
    if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      window.gtag = function() { window.dataLayer.push(arguments) }
      window.gtag('js', new Date())
      window.gtag('config', GA_MEASUREMENT_ID)
    }
  }, [])

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return

    // Track page view
    if (window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: currentPath,
      })
    }
  }, [currentPath])

  const trackEvent = (eventName: string, params?: Record<string, any>) => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return
    
    window.gtag('event', eventName, params)
  }

  return { trackEvent }
}

// Tipos para window.gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}
