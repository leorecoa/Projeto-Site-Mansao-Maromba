// =======================
// Helpers
// =======================
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
// Database Tables
// =======================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at?: string;
}

export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  address_street: string | null;
  address_number: string | null;
  address_complement: string | null;
  address_neighborhood: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  created_at?: string;
  auth_user_id: string | null;
  user_role: 'customer' | 'admin' | 'staff';
}

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
  updated_at?: string;
}

export interface ProductIngredient {
  id: string;
  product_id: string;
  name: string;
  quantity: string | null;
  created_at?: string;
}

export interface Order {
  id: string;
  customer_id: string | null;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'paid';
  payment_method: string | null;
  tracking_code: string | null;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
  used_wallet_balance: number;
  final_charge_amount: number | null;
  shipping_address_snapshot: Json;
}

export interface OrderItem {
  id: string;
  order_id: string | null;
  product_id: string | null;
  quantity: number;
  unit_price: number;
  created_at?: string;
}

export interface Review {
  id: string;
  product_id: string | null;
  customer_name: string;
  rating: number;
  comment: string | null;
  is_visible: boolean;
  created_at?: string;
  user_id?: string | null;
}

export interface UserWallet {
  id: string;
  customer_id: string;
  balance: number;
  total_deposited: number;
  updated_at?: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  type: 'DEPOSIT' | 'PURCHASE' | 'REFUND' | 'ADMIN_ADJUSTMENT';
  amount: number;
  description: string | null;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  stripe_payment_intent_id: string | null;
  metadata: Json | null;
  created_at?: string;
}
export interface Theme {
  primary: string;
  secondary: string;
  glow: string;
  text: string;
  bg: string;
  sound?: string | null; // 🔥 opcional
}

// =======================
// Cart & App State
// =======================
export interface CartItem extends Product {
  quantity: number;
}
