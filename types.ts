
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
