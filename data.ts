
import { Product, Review } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'tigrinho',
    name: 'Combo Tigrinho',
    description: 'MANGA + MARACUJÁ. ENERGIA INTENSA QUE INCENDEIA A NOITE.',
    price: 89.90,
    volume: '1L',
    type: 'Cocktail Alcoólico Gaseificado',
    image_url: 'https://i.ibb.co/bMK7dDH2/mansao-maromba.png',
    theme: {
      primary: '#ff0000',
      secondary: '#4b0000',
      glow: 'rgba(255, 0, 0, 0.8)',
      text: '#FFFFFF',
      bg: 'linear-gradient(180deg, #1a0000 0%, #000000 100%)'
    }
  },
  {
    id: 'darkness',
    name: 'Double Darkness',
    description: 'PRETO FOSCO. MISTÉRIO E ELEGÂNCIA PARA O ROLÊ URBANO.',
    price: 99.90,
    volume: '1L',
    type: 'Cocktail Alcoólico Gaseificado',
    image_url: 'https://i.ibb.co/tT20W8bn/mansao-maromba1.png',
    theme: {
      primary: '#444444',
      secondary: '#0a0a0a',
      glow: 'rgba(100, 100, 100, 0.3)',
      text: '#EEEEEE',
      bg: 'linear-gradient(180deg, #0d0d0d 0%, #000000 100%)'
    }
  },
  {
    id: 'pink',
    name: 'Combo Pink',
    description: 'VIBE NEON. ATITUDE QUE BRILHA NO ESCURO DO CLUB.',
    price: 94.90,
    volume: '1L',
    type: 'Cocktail Alcoólico Gaseificado',
    image_url: 'https://i.ibb.co/Q3QX4G3g/mansao-maromba2.png',
    theme: {
      primary: '#ff00ff',
      secondary: '#200020',
      glow: 'rgba(255, 0, 255, 0.6)',
      text: '#FFFFFF',
      bg: 'linear-gradient(180deg, #150015 0%, #000000 100%)'
    }
  },
  {
    id: 'vodka',
    name: 'Vodka Combo',
    description: 'AZUL E ROSA. O EQUILÍBRIO PERFEITO ENTRE GELO E FOGO.',
    price: 84.90,
    volume: '1L',
    type: 'Cocktail Alcoólico Gaseificado',
    image_url: 'https://i.ibb.co/fzDdqd5Z/mansao-maromba3.png',
    theme: {
      primary: '#00f0ff',
      secondary: '#001a1c',
      glow: 'rgba(0, 240, 255, 0.5)',
      text: '#FFFFFF',
      bg: 'linear-gradient(180deg, #001012 0%, #000000 100%)'
    }
  }
];
// No seu data.ts (linhas ~72-74 e outros reviews)
export const reviews = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567891", // ✅ String UUID
    product_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", // ✅ Referência a um produto
    customer_name: "João Silva",
    rating: 5,
    comment: "Excelente produto! Entrega super rápida.",
    is_visible: true,
    created_at: "2024-01-15T10:30:00Z",
    user_id: "user-uuid-123" // Opcional, mas se incluir, deve ser string
  },
  
  {
    id: "b2c3d4e5-f678-9012-bcde-f12345678902", // ✅ String UUID
    product_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    customer_name: "Maria Santos",
    rating: 4,
    comment: "Muito bom, mas poderia ter mais gás.",
    is_visible: true,
    created_at: "2024-01-16T14:20:00Z"
  },
  
  {
    id: "c3d4e5f6-7890-1234-cdef-123456789003", // ✅ String UUID
    product_id: "b2c3d4e5-f678-9012-bcde-f12345678901", // Outro produto
    customer_name: "Carlos Oliveira",
    rating: 5,
    comment: "Perfeito para a balada! 🔥",
    is_visible: true,
    created_at: "2024-01-17T18:45:00Z"
  }
];