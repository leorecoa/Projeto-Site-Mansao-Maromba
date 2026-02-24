import { useCartStore } from '@/store/useCart';

export const useCart = () => {
  const cart = useCartStore((state) => state.cart);
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const isHydrated = useCartStore((state) => state.isHydrated);
  const cartTotal = useCartStore((state) => state.cartTotal);
  const cartCount = useCartStore((state) => state.cartCount);

  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);

  return {
    cart,
    isCartOpen,
    isHydrated,
    loading: !isHydrated,
    total: cartTotal, // Mantém compatibilidade com testes que esperam 'total'
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setIsCartOpen,
  };
};
