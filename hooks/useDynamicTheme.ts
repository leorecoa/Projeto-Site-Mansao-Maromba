import { useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';
import { Product } from '../types';

export const useDynamicTheme = (selectedProduct: Product | null) => {
    const setTheme = useThemeStore((state) => state.setTheme);

    useEffect(() => {
        if (selectedProduct?.theme) {
            const theme = selectedProduct.theme;

            // Aplicar variáveis CSS no documento
            const root = document.documentElement;
            root.style.setProperty('--color-primary', theme.primary);
            root.style.setProperty('--color-secondary', theme.secondary);
            root.style.setProperty('--color-glow', theme.glow);
            root.style.setProperty('--color-text', theme.text);
            root.style.backgroundColor = theme.bg;

            // Salvar no estado global (Zustand)
            // O ID do produto é necessário para o setTheme, usando o ID do produto selecionado
            setTheme({
                primary: theme.primary,
                secondary: theme.secondary,
                glow: theme.glow,
                text: theme.text,
                bg: theme.bg
            }, selectedProduct.id);

            // (OPCIONAL) Tocar um som ao selecionar
            // Verificamos se a propriedade sound existe no tema (pode precisar estender a interface Theme em types.ts)
            const themeWithSound = theme as any;
            if (themeWithSound.sound) {
                const audio = new Audio(themeWithSound.sound);
                audio.volume = 0.3;
                audio.play().catch(e => console.log("Auto-play bloqueado:", e));
            }
        }
    }, [selectedProduct, setTheme]);
};