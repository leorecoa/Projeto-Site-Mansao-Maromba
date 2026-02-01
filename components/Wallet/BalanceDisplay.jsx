'use client'
import { useAppStore } from '@/stores/useAppStore'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const BalanceDisplay = () => {
  const { user } = useAuth()
  const walletBalance = useAppStore((state) => state.walletBalance)
  const updateWalletBalance = useAppStore((state) => state.updateWalletBalance)

  useEffect(() => {
    if (!user) return

    const fetchBalance = async () => {
      const { data, error } = await supabase
        .from('user_wallet')
        .select('balance')
        .eq('customer_id', user.id)
        .single()
      
      if (error) {
        console.error('Erro ao buscar saldo da carteira:', error)
      } else if (data) {
        updateWalletBalance(data.balance)
      }
    }

    fetchBalance()

    // Opcional: Escutar mudanças em tempo real no Supabase
    const channel = supabase
      .channel('wallet_changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'user_wallet', filter: `customer_id=eq.${user.id}` },
        (payload) => {
          updateWalletBalance(payload.new.balance)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, updateWalletBalance])

  if (!user) return null

  return (
    <div className="balance-display" style={{ color: 'var(--color-text)' }}>
      <span>Saldo: <strong>R$ {walletBalance.toFixed(2)}</strong></span>
    </div>
  )
}

export default BalanceDisplay