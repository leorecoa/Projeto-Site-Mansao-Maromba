
export interface Theme {
  bg: string;
  primary: string;
  secondary: string;
  accent?: string;
  glow?: string;
  text?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  image?: string;
  description?: string;
  ingredients?: string;
  volume?: string;
  type?: string;
  stock_quantity?: number;
  theme: Theme;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}
