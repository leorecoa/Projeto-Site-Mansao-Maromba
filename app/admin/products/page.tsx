'use client';

import React from 'react';
import { useApp } from '@/app/context/AppContext';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

export default function AdminProductsPage() {
  const { products } = useApp();

  return (
    <div className="p-6 md:p-10 min-h-screen bg-black text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-syncopate text-yellow-500">Produtos</h1>
          <p className="text-zinc-400 text-sm mt-1">Gerencie o catálogo da Mansão Maromba</p>
        </div>

        <button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-5 py-3 rounded-xl transition-all transform active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
          <Plus size={20} />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input
            type="text"
            placeholder="Buscar produto por nome..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-yellow-500 transition-colors placeholder-zinc-600"
          />
        </div>
      </div>

      {/* Tabela de Produtos */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400 text-xs uppercase tracking-wider">
                <th className="p-5 font-bold">Produto</th>
                <th className="p-5 font-bold">Categoria</th>
                <th className="p-5 font-bold">Preço</th>
                <th className="p-5 font-bold">Status</th>
                <th className="p-5 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center opacity-50">
                        <Package size={32} />
                      </div>
                      <p>Nenhum produto encontrado no catálogo.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden border border-zinc-700 shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={20} className="text-zinc-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-yellow-500 transition-colors">{product.name}</p>
                          <p className="text-xs text-zinc-500">{product.volume || 'Volume não def.'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-sm text-zinc-300">
                      <span className="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-medium">
                        {product.type || 'Geral'}
                      </span>
                    </td>
                    <td className="p-5 font-mono text-yellow-500 font-bold">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${product.is_active !== false ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></span>
                        <span className="text-sm text-zinc-400">{product.is_active !== false ? 'Ativo' : 'Inativo'}</span>
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors" title="Editar">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 hover:bg-red-900/20 rounded-lg text-red-500 hover:text-red-400 transition-colors" title="Excluir">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
