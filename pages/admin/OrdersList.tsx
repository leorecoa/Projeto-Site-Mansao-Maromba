import React, { useState } from 'react';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import { Search, Filter, Eye, Loader2, AlertCircle } from 'lucide-react';
import OrderStatusBadge from '@/utils/OrderStatusBadge';
import { formatCurrency } from '@/utils/format';

export default function OrdersList() {
    const { orders, isLoading, error } = useAdminOrders();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Lógica de filtragem
    const filteredOrders = orders?.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            // @ts-expect-error - customers é injetado pelo hook useAdminOrders via join
            order.customers?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            // @ts-expect-error - customers é injetado pelo hook useAdminOrders via join
            order.customers?.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    }) || [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5" />
                <p>Erro ao carregar pedidos: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-white">Gerenciar Pedidos</h1>
                    <div className="text-gray-400 text-sm">
                        Total: <span className="text-white font-bold">{filteredOrders.length}</span> pedidos
                    </div>
                </div>

                {/* Barra de Ferramentas */}
                <div className="bg-zinc-900 p-4 rounded-xl border border-white/10 mb-6 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por ID, nome ou email..."
                            className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:border-yellow-400 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                        <Filter className="w-4 h-4 text-gray-400" />
                        {['all', 'paid', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${statusFilter === status
                                        ? 'bg-yellow-400 text-black'
                                        : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                                    }`}
                            >
                                {status === 'all' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tabela de Pedidos */}
                <div className="bg-zinc-900 rounded-xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-800/50 text-gray-400 text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-4">Pedido</th>
                                    <th className="px-6 py-4">Cliente</th>
                                    <th className="px-6 py-4">Data</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-mono text-sm text-yellow-400">#{order.id.substring(0, 8)}</td>
                                        {/* @ts-expect-error - customers injetado pelo join */}
                                        <td className="px-6 py-4 text-white text-sm">{order.customers?.full_name || 'Cliente Desconhecido'}</td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4"><OrderStatusBadge status={order.status} /></td>
                                        <td className="px-6 py-4 text-white font-medium">{formatCurrency(order.total_amount)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors" title="Ver Detalhes">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            Nenhum pedido encontrado com os filtros atuais.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}