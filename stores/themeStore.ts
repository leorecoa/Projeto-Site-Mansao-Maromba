import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Theme {
    primary: string;
    secondary: string;
    glow: string;
    text: string;
    bg: string;
}

interface ThemeState {
    currentTheme: Theme | null;
    selectedProductId: string | null;
    setTheme: (theme: Theme, productId: string) => void;
    resetTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
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
);