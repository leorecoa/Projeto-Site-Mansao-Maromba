import { useAppStore } from '../../stores/useAppStore';
import { formatCurrency } from '../../utils/format';

type CartItemType = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
};

type CartItemProps = {
    item: CartItemType;
};

const CartItem = ({ item }: CartItemProps) => {
    const { addToCart, removeFromCart } = useAppStore();

    return (
        <div
            className="cart-item"
            style={{ borderBottom: '1px solid var(--color-secondary)', padding: '10px 0' }}
        >
            <img
                src={item.image_url}
                alt={item.name}
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            />

            <div>
                <h4>{item.name}</h4>
                <p>
                    {formatCurrency(item.price)} x {item.quantity}
                </p>
                <p>Subtotal: {formatCurrency(item.price * item.quantity)}</p>

                <button
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: '#ff3333', marginRight: '5px' }}
                >
                    -
                </button>

                <button
                    onClick={() => addToCart(item)}
                    style={{ background: 'var(--color-primary)' }}
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default CartItem;
