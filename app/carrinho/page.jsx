'use client'
import { useAppStore } from '@/stores/useAppStore'

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, clearCart } = useAppStore()

  return (
    <div className="cart-container">
      <h1>Seu Carrinho</h1>
      {cart.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item-card">
              <img src={item.image_url} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>Quantidade: {item.quantity}</p>
                <p>Preço unitário: R$ {item.price.toFixed(2)}</p>
                <p>Subtotal: R$ {(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.id)} style={{ background: '#ff3333' }}>Remover</button>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <h2>Total do Carrinho: R$ {cartTotal.toFixed(2)}</h2>
            <button onClick={clearCart} style={{ background: 'var(--color-secondary)' }}>Limpar Carrinho</button>
            <button style={{ background: 'var(--color-primary)' }}>Finalizar Compra</button>
          </div>
        </div>
      )}
    </div>
  )
}