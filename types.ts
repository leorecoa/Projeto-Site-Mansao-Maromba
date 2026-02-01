// =======================
// Theme (JSONB do Supabase)
// =======================
export interface Theme {
  primary: string;
  secondary: string;
  glow: string;
  text: string;
  bg: string;
}

// =======================
// Product (tabela products)
// =======================
export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  volume?: string | null;
  type?: string | null;
  image_url?: string | null;
  theme?: Theme | null;
  created_at?: string;
  category_id?: string | null;
  is_active?: boolean;
}

// =======================
// Cart
// =======================
export interface CartItem extends Product {
  quantity: number;
}

// =======================
// Review (tabela reviews)
// =======================
export interface Review {
  id: string;
  product_id?: string | null;
  customer_name: string;
  rating: number;
  comment?: string | null;
  created_at?: string;
}
