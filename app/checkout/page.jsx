'use client'
import { useState } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { useAuth } from '@/hooks/useAuth'

export default function CheckoutPage() {
  const { cart, cartTotal, walletBalance, clearCart } = useAppStore()
  const { user } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState('wallet') // 'wallet' ou 'card'
  const [loading, setLoading] = useState(false)
  
  const handleCheckout = async () => {
    setLoading(true)
    
    try {
      if (paymentMethod === 'wallet' && walletBalance >= cartTotal) {
        // Pagamento com saldo da carteira
        // 1. Criar registro na tabela `orders`
        // 2. Deduzir valor da `user_wallet`
        // 3. Registrar transação em `wallet_transactions`
        alert('Compra realizada com saldo da carteira!')
        clearCart()
      } else if (paymentMethod === 'card') {
        // Pagamento com cartão (Stripe)
        // Integrar com Stripe Checkout ou Elements
        alert('Redirecionando para pagamento com cartão...')
      } else {
        alert('Saldo insuficiente. Escolha outra forma de pagamento.')
      }
    } catch (error) {
      console.error('Erro no checkout:', error)
      alert('Erro ao processar pedido.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="checkout-container">
      <h2>Finalizar Pedido</h2>
      <div className="order-summary">
        <h3>Resumo do Pedido</h3>
        {cart.map(item => (
          <div key={item.id} className="checkout-item">
            <span>{item.name} x{item.quantity}</span>
            <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="checkout-total">
          <strong>Total:</strong>
          <strong>R$ {cartTotal.toFixed(2)}</strong>
        </div>
      </div>
      
      <div className="payment-methods">
        <h3>Forma de Pagamento</h3>
        <div className="payment-option">
          <input 
            type="radio" 
            id="wallet" 
            name="payment" 
            checked={paymentMethod === 'wallet'}
            onChange={() => setPaymentMethod('wallet')}
          />
          <label htmlFor="wallet">
            Carteira Maromba 
            <span className="wallet-balance"> (Saldo: R$ {walletBalance.toFixed(2)})</span>
            {walletBalance < cartTotal && paymentMethod === 'wallet' && (
              <span className="insufficient-balance"> - Saldo insuficiente</span>
            )}
          </label>
        </div>
        
        <div className="payment-option">
          <input 
            type="radio" 
            id="card" 
            name="payment" 
            checked={paymentMethod === 'card'}
            onChange={() => setPaymentMethod('card')}
          />
          <label htmlFor="card">
            Cartão de Crédito/Débito (Stripe)
          </label>
        </div>
      </div>
      
      <button 
        onClick={handleCheckout}
        disabled={loading || (paymentMethod === 'wallet' && walletBalance < cartTotal)}
        className="checkout-button"
        style={{ background: 'var(--color-primary, #ff0000)' }}
      >
        {loading ? 'Processando...' : 'Confirmar Pedido'}
      </button>
    </div>
  )
}