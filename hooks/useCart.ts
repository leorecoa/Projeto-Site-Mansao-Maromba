import { useCartStore } from '../useCart'

export const useCart = () => {
  const cart = useCartStore(state => state.cart)
  const isCartOpen = useCartStore(state => state.isCartOpen)
  const isHydrated = useCartStore(state => state.isHydrated)

  const addToCart = useCartStore(state => state.addToCart)
  const removeFromCart = useCartStore(state => state.removeFromCart)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const clearCart = useCartStore(state => state.clearCart)
  const setIsCartOpen = useCartStore(state => state.setIsCartOpen)

  // Derived state
  const count = cart.reduce((acc, item) => acc + item.quantity, 0)
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return {
    cart,
    isCartOpen,
    isHydrated,
    loading: !isHydrated,
    total,
    cartCount: count,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setIsCartOpen,
  }
}
