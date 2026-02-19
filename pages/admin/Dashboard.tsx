import React from 'react';
import { DollarSign, ShoppingCart, Package, BarChart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
    const { user, profile } = useAuth();

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">🛡️ Dashboard Admin</h1>
                    <p className="text-gray-400">Bem-vindo, {user?.email}</p>
                    <p className="text-yellow-400 text-sm">Role: {profile?.role}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-zinc-900 p-6 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm">Receita Total</h3>
                            <DollarSign className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-2xl font-bold text-white">R$ 0,00</p>
                    </div>

                    <div className="bg-zinc-900 p-6 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm">Vendas Totais</h3>
                            <ShoppingCart className="w-5 h-5 text-blue-400" />
                        </div>
                        <p className="text-2xl font-bold text-white">0</p>
                    </div>

                    <div className="bg-zinc-900 p-6 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm">Novos Pedidos</h3>
                            <Package className="w-5 h-5 text-yellow-400" />
                        </div>
                        <p className="text-2xl font-bold text-white">0</p>
                    </div>

                    <div className="bg-zinc-900 p-6 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm">Ticket Médio</h3>
                            <BarChart className="w-5 h-5 text-purple-400" />
                        </div>
                        <p className="text-2xl font-bold text-white">R$ 0,00</p>
                    </div>
                </div>

                <div className="mt-8 bg-zinc-900 p-6 rounded-lg border border-white/10">
                    <h2 className="text-xl font-bold text-white mb-4">Links Rápidos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a href="/admin/orders" className="p-4 bg-black/50 rounded-lg hover:bg-black/70 transition-colors">
                            <h3 className="text-white font-semibold mb-1">Pedidos</h3>
                            <p className="text-gray-400 text-sm">Gerenciar todos os pedidos</p>
                        </a>
                        <a href="/admin/products" className="p-4 bg-black/50 rounded-lg hover:bg-black/70 transition-colors">
                            <h3 className="text-white font-semibold mb-1">Produtos</h3>
                            <p className="text-gray-400 text-sm">CRUD de produtos</p>
                        </a>
                        <a href="/admin/products/new" className="p-4 bg-black/50 rounded-lg hover:bg-black/70 transition-colors">
                            <h3 className="text-white font-semibold mb-1">Novo Produto</h3>
                            <p className="text-gray-400 text-sm">Adicionar produto</p>
                        </a>
                    </div>
                </div>

                <div className="mt-8 bg-green-900/20 border border-green-700 p-4 rounded-lg">
                    <p className="text-green-400">✅ Admin funcionando! Todas as rotas estão protegidas com RBAC.</p>
                </div>
            </div>
        </div>
    );
}