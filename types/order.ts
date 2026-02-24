export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'paid';

export interface OrderProduct {
  name: string;
  image_url: string | null;
}

export interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  products: OrderProduct | null;
}

export interface OrderCustomer {
  full_name: string | null;
  email: string | null;
}

export interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: OrderStatus | string;
  order_items: OrderItem[];
  customers?: OrderCustomer | null;
}
