import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/hooks/useAuth';

export default function CheckoutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Mock de dados do carrinho (idealmente viria de um Context/Store)
  const cartTotal = 150.00;
  const [address, setAddress] = useState({
    street: '',
    number: '',
    city: '',
    zip: ''
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // 1. Criar o pedido na tabela orders
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: cartTotal,
          status: 'pending',
          shipping_address_snapshot: address, // Salvando JSONB conforme schema
          customer_email: user.email,
          customer_address: `${address.street}, ${address.number}`,
          customer_city: address.city,
          customer_zipcode: address.zip
        })
        .select()
        .single();

      if (error) throw error;

      // 2. Redirecionar para sucesso ou pagamento
      alert('Pedido criado com sucesso! ID: ' + order.id);
      navigate('/orders');

    } catch (error) {
      console.error('Erro no checkout:', error);
      alert('Erro ao processar pedido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">Checkout</h1>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <form onSubmit={handleCheckout} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text" placeholder="Rua" required
                className="bg-black/50 border border-white/20 rounded p-3 text-white"
                onChange={e => setAddress({ ...address, street: e.target.value })}
              />
              <input
                type="text" placeholder="Número" required
                className="bg-black/50 border border-white/20 rounded p-3 text-white"
                onChange={e => setAddress({ ...address, number: e.target.value })}
              />
              <input
                type="text" placeholder="Cidade" required
                className="bg-black/50 border border-white/20 rounded p-3 text-white"
                onChange={e => setAddress({ ...address, city: e.target.value })}
              />
              <input
                type="text" placeholder="CEP" required
                className="bg-black/50 border border-white/20 rounded p-3 text-white"
                onChange={e => setAddress({ ...address, zip: e.target.value })}
              />
            </div>

            <div className="border-t border-white/10 pt-4 mt-4">
              <div className="flex justify-between text-xl font-bold mb-4">
                <span>Total</span>
                <span className="text-yellow-400">R$ {cartTotal.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 text-black font-bold py-3 rounded hover:bg-yellow-500 transition disabled:opacity-50"
              >
                {loading ? 'Processando...' : 'Finalizar Compra'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}