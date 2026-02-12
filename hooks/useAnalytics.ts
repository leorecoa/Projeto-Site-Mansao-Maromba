// hooks/useAnalytics.ts
import { useEffect } from 'react'
import { useNavigation } from './useNavigation'

const GA_MEASUREMENT_ID = 'G-GF264GFHB4'

export function useAnalytics() {
  const { currentPath } = useNavigation()

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
