'use client';

import { useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';
import { Product } from '../types';

export const useDynamicTheme = (selectedProduct: Product | null) => {
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    if (!selectedProduct?.theme) return;

    const theme = selectedProduct.theme;
    const root = document.documentElement;

    // Aplicar variáveis CSS
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-glow', theme.glow);
    root.style.setProperty('--color-text', theme.text);
    root.style.setProperty('--color-bg', theme.bg);

    // Atualiza store global
    setTheme(
      {
        primary: theme.primary,
        secondary: theme.secondary,
        glow: theme.glow,
        text: theme.text,
        bg: theme.bg,
      },
      selectedProduct.id
    );

    // Som (opcional e protegido)
    if (theme.sound) {
      const audio = new Audio(theme.sound);
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }

    // 🧹 Cleanup ao desmontar ou trocar produto
    return () => {
      root.style.removeProperty('--color-primary');
      root.style.removeProperty('--color-secondary');
      root.style.removeProperty('--color-glow');
      root.style.removeProperty('--color-text');
      root.style.removeProperty('--color-bg');
    };
  }, [selectedProduct, setTheme]);
};
