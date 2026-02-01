import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const DepositModal = ({ isOpen, onClose, currentBalance }) => {
  const [amount, setAmount] = useState(50)
  const [loading, setLoading] = useState(false)
  
  const quickAmounts = [20, 50, 100, 200, 500]
  
  const handleDeposit = async () => {
    setLoading(true)
    
    try {
      // 1. Criar uma intenção de pagamento no backend (API Route)
      //    Esta rota prepara o pagamento no Stripe e registra a transação como PENDING.
      const response = await fetch('/api/stripe/create-deposit-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      })
      
      const { clientSecret, transactionId } = await response.json()
      
      // 2. (FUTURO) Integrar com o Stripe Elements para coletar dados do cartão
      //    Por enquanto, apenas simulamos o sucesso.
      //    QUANDO VOCÊ TIVER AS CHAVES DO STRIPE, DESCOMENTE E CONFIGURE:
      /*
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      })
      */
      
      // 3. Simular pagamento bem-sucedido (REMOVA ISSO QUANDO INTEGRAR COM STRIPE)
      console.log(`[SIMULAÇÃO] Depósito de R$ ${amount} processado.`)
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simula processamento
      
      // 4. Atualizar o saldo no frontend (via Supabase Realtime)
      onClose()
      alert(`Depósito de R$ ${amount} simulado com sucesso!`) // Remover na produção
      
    } catch (error) {
      console.error('Erro no depósito:', error)
      alert('Erro ao processar depósito.')
    } finally {
      setLoading(false)
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.8)' }}>
      <div className="modal-content" style={{ 
        background: 'var(--color-bg, #0a0a0a)',
        border: '2px solid var(--color-primary, #ff0000)'
      }}>
        <h3>🎯 ADICIONAR SALDO</h3>
        <p>Seu saldo atual: <strong>R$ {currentBalance.toFixed(2)}</strong></p>
        
        <div className="quick-amounts">
          {quickAmounts.map(quickAmount => (
            <button
              key={quickAmount}
              className={`amount-btn ${amount === quickAmount ? 'active' : ''}`}
              onClick={() => setAmount(quickAmount)}
              style={{
                background: amount === quickAmount 
                  ? 'var(--color-primary, #ff0000)' 
                  : 'var(--color-secondary, #4b0000)'
              }}
            >
              R$ {quickAmount}
            </button>
          ))}
        </div>
        
        <div className="custom-amount">
          <label>Outro valor:</label>
          <input 
            type="number" 
            min="10" 
            value={amount} 
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        
        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button 
            onClick={handleDeposit} 
            disabled={loading || amount < 10}
            className="deposit-btn"
            style={{ background: 'var(--color-primary, #ff0000)' }}
          >
            {loading ? 'Processando...' : `Depositar R$ ${amount}`}
          </button>
        </div>
        
        <div className="dev-note">
          <small>
            ⚠️ Modo de desenvolvimento: O pagamento está simulado.
            Para ativar pagamentos reais, adicione suas chaves do Stripe no `.env.local`
          </small>
        </div>
      </div>
    </div>
  )
}