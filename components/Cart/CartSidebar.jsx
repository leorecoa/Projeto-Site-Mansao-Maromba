'use client'
import { useAppStore } from '@/stores/useAppStore'
import Link from 'next/link'
import CartItem from './CartItem' // Será criado em breve

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, cartTotal, clearCart } = useAppStore()

  const sidebarClass = isOpen ? 'sidebar-open' : 'sidebar-closed'

  return (
    <div className={`cart-sidebar ${sidebarClass}`} style={{ background: 'var(--color-bg)', borderLeft: '1px solid var(--color-secondary)' }}>
      <div className="sidebar-header">
        <h2>Seu Carrinho</h2>
        <button onClick={onClose}>X</button>
      </div>
      <div className="sidebar-content">
        {cart.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <>
            {cart.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
            <div className="cart-summary">
              <h3>Total: R$ {cartTotal.toFixed(2)}</h3>
              <button onClick={clearCart} style={{ background: 'var(--color-secondary)' }}>Limpar Carrinho</button>
              <Link href="/checkout">
                <button onClick={onClose} style={{ background: 'var(--color-primary)' }}>Finalizar Compra</button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartSidebar