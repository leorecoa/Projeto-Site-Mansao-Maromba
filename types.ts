
export interface Theme {
    primary: string;
    secondary: string;
    glow: string;
    text: string;
    bg: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    volume: string;
    type: string;
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

export interface OrderItem {
    quantity: number;
    unit_price: number;
    products: {
        name: string;
        image_url: string | null;
    } | null;
}

export interface Order {
    id: string;
    created_at: string | null;  
    total_amount: number;
    status: string | null;      
    order_items: Array<{
        quantity: number;
        unit_price: number;
        products: {
            name: string;
            image_url: string | null;
        } | null;
    }>;
}