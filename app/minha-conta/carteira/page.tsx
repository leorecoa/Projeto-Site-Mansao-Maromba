import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/services/supabase'
import DepositModal from '@/components/Wallet/DepositModal'

interface Transaction {
    id: string;
    type: 'deposit' | 'purchase' | 'refund';
    amount: number;
    description: string;
    created_at: string;
    wallet_id: string;
}

export default function WalletPage() {
    const { user } = useAuth()
    const walletBalance = useAppStore((state) => state.walletBalance)
    const updateWalletBalance = useAppStore((state) => state.updateWalletBalance)
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {
        if (!user) return

        const fetchWalletData = async () => {
            // Buscar saldo da carteira
            const { data: walletData, error: walletError } = await supabase
                .from('user_wallet')
                .select('balance')
                .eq('customer_id', user.id)
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
                .eq('wallet_id', user.id)
                .order('created_at', { ascending: false })

            if (transactionsError) {
                console.error('Erro ao buscar transações:', transactionsError)
            } else if (transactionsData) {
                setTransactions(transactionsData as Transaction[])
            }
        }

        fetchWalletData()
    }, [user, updateWalletBalance])

    if (!user) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Faça login para ver sua carteira.</div>

    return (
        <div className="min-h-screen pt-24 px-6 bg-black text-white font-inter">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-syncopate font-bold mb-8 text-white">Minha Carteira</h1>

                <div className="glass-card p-8 rounded-2xl mb-12 flex flex-col md:flex-row justify-between items-center gap-6 border border-white/10">
                    <div>
                        <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">Saldo Disponível</p>
                        <p className="text-5xl font-bold text-white">R$ {walletBalance.toFixed(2)}</p>
                    </div>
                    <button
                        onClick={() => setIsDepositModalOpen(true)}
                        className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 uppercase tracking-wider shadow-[0_0_15px_rgba(255,0,0,0.5)]"
                        style={{ backgroundColor: 'var(--color-primary, #ff0000)' }}
                    >
                        Adicionar Saldo
                    </button>
                </div>

                <h2 className="text-2xl font-syncopate font-bold mb-6 text-white/80">Histórico de Transações</h2>

                <div className="glass-card rounded-xl overflow-hidden border border-white/10">
                    {transactions.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            Nenhuma transação encontrada.
                        </div>
                    ) : (
                        <div className="divide-y divide-white/10">
                            {transactions.map(tx => (
                                <div key={tx.id} className="p-6 flex justify-between items-center hover:bg-white/5 transition-colors">
                                    <div>
                                        <p className="font-bold text-white mb-1">{tx.description}</p>
                                        <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleDateString()} às {new Date(tx.created_at).toLocaleTimeString()}</p>
                                    </div>
                                    <div className={`font-bold text-xl ${tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                                        {tx.type === 'deposit' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DepositModal
                    isOpen={isDepositModalOpen}
                    onClose={() => setIsDepositModalOpen(false)}
                    currentBalance={walletBalance}
                />
            </div>
        </div>
    )
}