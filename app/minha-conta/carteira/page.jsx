'use client'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import DepositModal from '@/components/Wallet/DepositModal'

export default function WalletPage() {
  const { user } = useAuth()
  const walletBalance = useAppStore((state) => state.walletBalance)
  const updateWalletBalance = useAppStore((state) => state.updateWalletBalance)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    if (!user) return

    const fetchWalletData = async () => {
      // Buscar saldo da carteira
      const { data: walletData, error: walletError } = await supabase
        .from('user_wallet')
        .select('balance')
        .eq('customer_id', user.id) // Supondo que customer_id na wallet é o auth.uid
        .single()

      if (walletError) {
        console.error('Erro ao buscar carteira:', walletError)
      } else if (walletData) {
        updateWalletBalance(walletData.balance)
      }

      // Buscar histórico de transações
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', user.id) // Supondo que wallet_id na transactions é o auth.uid
        .order('created_at', { ascending: false })
      
      if (transactionsError) {
        console.error('Erro ao buscar transações:', transactionsError)
      } else if (transactionsData) {
        setTransactions(transactionsData)
      }
    }

    fetchWalletData()
  }, [user, updateWalletBalance])

  if (!user) return <div>Faça login para ver sua carteira.</div>

  return (
    <div className="wallet-page-container">
      <h1>Minha Carteira</h1>
      <p>Saldo Atual: <strong>R$ {walletBalance.toFixed(2)}</strong></p>
      <button 
        onClick={() => setIsDepositModalOpen(true)}
        style={{ background: 'var(--color-primary)' }}
      >
        Adicionar Saldo
      </button>

      <h2>Histórico de Transações</h2>
      {transactions.length === 0 ? (
        <p>Nenhuma transação ainda.</p>
      ) : (
        <ul>
          {transactions.map(tx => (
            <li key={tx.id}>
              {tx.type}: R$ {tx.amount.toFixed(2)} - {tx.description} ({new Date(tx.created_at).toLocaleDateString()})
            </li>
          ))}
        </ul>
      )}

      <DepositModal 
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        currentBalance={walletBalance}
      />
    </div>
  )
}