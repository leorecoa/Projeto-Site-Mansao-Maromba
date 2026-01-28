import { Product, Review } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'tigrinho', // <-- PODE SER string
    name: 'Combo Tigrinho',
    description: 'MANGA + MARACUJÁ. ENERGIA INTENSA QUE INCENDEIA A NOITE.',
    price: 89.90,
    volume: '1L',
    type: 'Cocktail Alcoólico Gaseificado',
    image: 'https://i.ibb.co/bMK7dDH2/mansao-maromba.png',
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
    image: 'https://i.ibb.co/tT20W8bn/mansao-maromba1.png',
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
    image: 'https://i.ibb.co/Q3QX4G3g/mansao-maromba2.png',
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
    image: 'https://i.ibb.co/fzDdqd5Z/mansao-maromba3.png',
    theme: {
      primary: '#00f0ff',
      secondary: '#001a1c',
      glow: 'rgba(0, 240, 255, 0.5)',
      text: '#FFFFFF',
      bg: 'linear-gradient(180deg, #001012 0%, #000000 100%)'
    }
  }
];

export const REVIEWS: Review[] = [
  {
    id: 1,
    user: "Lucas Silva", // <-- Mude "name" para "user"
    rating: 5,
    comment: "Melhor combo de SP. Entrega rápida demais!", // <-- Mude "text" para "comment"
    date: "2 dias atrás"
  },
  {
    id: 2,
    user: "Ana Paula",
    rating: 4,
    comment: "O Tigrinho é sensacional, voltarei a pedir com certeza.",
    date: "1 semana atrás"
  },
  {
    id: 3,
    user: "Ricardo",
    rating: 4,
    comment: "O Double Darkness é o brabo. Visual do site tá animal.",
    date: "1 mês atrás"
  }
];