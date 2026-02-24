// hooks/useAnalytics.ts
import { useEffect } from 'react';
import { useNavigation } from './useNavigation';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Tipos para window.gtag
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer?: any[];
  }
}

export function useAnalytics() {
  const { currentPath } = useNavigation();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;

    // Inicializa dataLayer e gtag imediatamente
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function (...args: unknown[]) {
        window.dataLayer?.push(args);
      };

    // Carrega script do Google Analytics dinamicamente (apenas 1x)
    if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);
    }

    // Configura GA
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);
  }, []);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return;

    // Track page view apenas quando mudar de página
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: currentPath,
    });
  }, [currentPath]);

  const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return;

    window.gtag('event', eventName, params);
  };

  return { trackEvent };
}
