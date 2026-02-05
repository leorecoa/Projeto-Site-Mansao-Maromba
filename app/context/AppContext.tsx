// context/AppContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Theme } from '../../types';

// Tema padrão
const DEFAULT_THEME: Theme = {
    primary: '#facc15',
    secondary: '#111827',
    glow: 'rgba(250, 204, 21, 0.4)',
    text: '#FFFFFF',
    bg: 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)',
};

// Mock de produtos (movido para cá para ser acessível globalmente)
const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Combo Tigrinho',
        price: 149.90,
        description: 'Energia pura para quem busca resultados extremos. O combo mais vendido da Mansão.',
        image_url: 'https://i.imgur.com/2CMQ6GJ.png', // Placeholder
        volume: '700ml',
        type: 'Combo',
        theme: {
            primary: '#facc15',
            secondary: '#111827',
            glow: 'rgba(250, 204, 21, 0.4)',
            text: '#FFFFFF',
            bg: 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)',
        }
    },
    {
        id: '2',
        name: 'Kit Fortune',
        price: 299.90,
        description: 'Para quem joga alto. Sabor premium e embalagem exclusiva.',
        image_url: 'https://i.imgur.com/2CMQ6GJ.png', // Placeholder
        volume: '1L',
        type: 'Kit',
        theme: {
            primary: '#a855f7',
            secondary: '#3b0764',
            glow: 'rgba(168, 85, 247, 0.4)',
            text: '#FFFFFF',
            bg: 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)',
        }
    }
];

interface AppContextType {
    activeTheme: Theme;
    cartCount: number;
    activeIndex: number;
    products: Product[];
    setActiveIndex: (index: number) => void;
    handleOpenCart: () => void;
    setCartCount: React.Dispatch<React.SetStateAction<number>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [activeTheme, setActiveTheme] = useState<Theme>(DEFAULT_THEME);
    const [cartCount, setCartCount] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    // Mantemos os produtos no estado caso precisem ser carregados de uma API depois
    const [products] = useState<Product[]>(mockProducts);

    // Efeito para sincronizar o tema com o produto ativo
    useEffect(() => {
        if (products.length > 0 && products[activeIndex]?.theme) {
            setActiveTheme(products[activeIndex].theme);
        } else {
            setActiveTheme(DEFAULT_THEME);
        }
    }, [activeIndex, products]);

    const handleOpenCart = () => {
        console.log('Abrir carrinho');
    };

    return (
        <AppContext.Provider value={{
            activeTheme,
            cartCount,
            activeIndex,
            products,
            setActiveIndex,
            handleOpenCart,
            setCartCount
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp deve ser usado dentro de um AppProvider');
    }
    return context;
}
