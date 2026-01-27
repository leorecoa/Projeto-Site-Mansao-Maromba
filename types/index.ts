// types/index.ts
export interface ProductTheme {
  primary: string;
  secondary: string;
  glow: string;
  text: string;
  bg: string;
  accent?: string; // Adicione se precisar
}

export interface Product {
  id: string | number; // <-- ACEITA string OU number
  name: string;
  description: string;
  price: number;
  volume: string; // <-- ADICIONE volume
  type: string; // <-- ADICIONE type
  image: string;
  theme: ProductTheme;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Review {
  id: number;
  user: string; // <-- Mude "name" para "user" se seu código usa "user"
  rating: number;
  comment: string; // <-- Mude "text" para "comment" se seu código usa "comment"
  date: string;
}