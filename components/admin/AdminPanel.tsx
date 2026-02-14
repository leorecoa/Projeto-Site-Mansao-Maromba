import React, { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase';

export default function AdminPanel() {
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    customers: 0
  });

  useEffect(() => {
    async function fetchStats() {
      const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { count: customersCount } = await supabase.from('customers').select('*', { count: 'exact', head: true });

      setStats({
        orders: ordersCount || 0,
        products: productsCount || 0,
        customers: customersCount || 0
      });
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6">Painel Administrativo</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm uppercase">Total de Pedidos</h3>
            <p className="text-3xl font-bold text-white mt-2">{stats.orders}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm uppercase">Produtos Ativos</h3>
            <p className="text-3xl font-bold text-white mt-2">{stats.products}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm uppercase">Clientes Cadastrados</h3>
            <p className="text-3xl font-bold text-white mt-2">{stats.customers}</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">Ações Rápidas</h2>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-500 transition">
              Adicionar Produto
            </button>
            <button className="px-4 py-2 bg-white/10 text-white font-bold rounded hover:bg-white/20 transition">
              Ver Todos os Pedidos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}