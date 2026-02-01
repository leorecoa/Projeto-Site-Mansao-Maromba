import React, { useState } from 'react';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/stores/useAppStore';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, currentBalance }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const updateWalletBalance = useAppStore(state => state.updateWalletBalance);

  if (!isOpen) return null;

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Por favor, insira um valor válido.');
      return;
    }

    setLoading(true);

    try {
      // NOTA: Em um ambiente real, aqui você integraria com Stripe, Mercado Pago ou PIX.
      // Para este exemplo, vamos simular que o pagamento foi aprovado e atualizar o saldo diretamente.
      
      if (user) {
        const depositAmount = Number(amount);
        const newBalance = currentBalance + depositAmount;
        
        // 1. Atualizar ou criar a carteira do usuário
        const { error: walletError } = await supabase
          .from('user_wallet')
          .upsert({ 
            customer_id: user.id, 
            balance: newBalance,
            updated_at: new Date().toISOString()
          }, { onConflict: 'customer_id' });

        if (walletError) throw walletError;

        // 2. Registrar a transação no histórico
        const { error: txError } = await supabase.from('wallet_transactions').insert({
          wallet_id: user.id, // Certifique-se que sua tabela usa wallet_id ou customer_id
          amount: depositAmount,
          type: 'deposit',
          description: 'Depósito via PIX (Simulado)',
          status: 'completed',
          created_at: new Date().toISOString()
        });

        if (txError) throw txError;

        // Atualizar estado local
        updateWalletBalance(newBalance);
        
        alert(`Depósito de R$ ${depositAmount.toFixed(2)} realizado com sucesso!`);
        setAmount('');
        onClose();
      }
    } catch (error) {
      console.error('Erro ao depositar:', error);
      alert('Erro ao processar o depósito. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl w-full max-w-md shadow-2xl relative overflow-hidden animate-float">
        {/* Efeito de brilho no topo */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>

        <h2 className="text-2xl font-bold text-white mb-6 font-syncopate text-center">Adicionar Saldo</h2>
        
        <div className="mb-8">
          <label className="block text-zinc-400 text-sm mb-2 font-inter">Valor do Depósito (R$)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-black border border-zinc-700 rounded-lg p-4 text-white text-center text-2xl focus:border-yellow-500 focus:outline-none transition-colors placeholder-zinc-700"
            placeholder="0.00"
            min="1"
            step="0.01"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-3 text-zinc-400 hover:text-white transition-colors font-inter text-sm"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleDeposit}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed font-inter uppercase tracking-wider"
          >
            {loading ? 'Processando...' : 'Pagar com PIX'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
