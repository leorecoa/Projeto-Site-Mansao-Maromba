'use client'
import { useEffect } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

export const useWalletBalance = () => {
  const { user } = useAuth()
  const updateWalletBalance = useAppStore((state) => state.updateWalletBalance)

  useEffect(() => {
    if (!user) {
      updateWalletBalance(0) // Reseta o saldo se o usuário deslogar
      return
    }

    const fetchAndSubscribeBalance = async () => {
      // 1. Buscar saldo inicial
      const { data: walletData, error: walletError } = await supabase
        .from('user_wallet')
        .select('balance')
        .eq('customer_id', user.id)
        .single()
      
      if (walletError && walletError.code !== 'PGRST116') { // PGRST116 = linha não encontrada (OK para novos usuários)
        console.error('Erro ao buscar saldo inicial da carteira:', walletError)
      } else if (walletData) {
        updateWalletBalance(walletData.balance)
      } else { // Se não encontrou carteira, assume 0
        updateWalletBalance(0)
      }

      // 2. Assinar mudanças em tempo real
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
    }

    fetchAndSubscribeBalance()
  }, [user, updateWalletBalance])

  // O saldo em si é acessado via useAppStore diretamente nos componentes que precisam
  // Este hook é para inicializar e manter a escuta do saldo.
}
