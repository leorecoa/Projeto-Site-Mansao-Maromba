import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { Search, Filter, ArrowUpDown, Loader2, Package } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import type { Product } from '@/types';
import { useToast } from '@/hooks/useToast';
import { logError } from '@/utils/logger';

type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { error: showError } = useToast();

    const initialQuery = searchParams.get('q') || '';
    const initialCategory = searchParams.get('category') || '';

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [query, setQuery] = useState(initialQuery);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [sortBy, setSortBy] = useState<SortOption>('name-asc');

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setLoadError(null);
            try {
                const { data: cats } = await supabase.from('categories').select('id, name');
                setCategories(cats || []);

                let productQuery = supabase.from('products').select('*');

                if (query) {
                    productQuery = productQuery.ilike('name', `%${query}%`);
                }

                if (selectedCategory) {
                    productQuery = productQuery.eq('category_id', selectedCategory);
                }

                switch (sortBy) {
                    case 'price-asc':
                        productQuery = productQuery.order('price', { ascending: true });
                        break;
                    case 'price-desc':
                        productQuery = productQuery.order('price', { ascending: false });
                        break;
                    case 'name-desc':
                        productQuery = productQuery.order('name', { ascending: false });
                        break;
                    case 'name-asc':
                    default:
                        productQuery = productQuery.order('name', { ascending: true });
                        break;
                }

                const { data: prods, error } = await productQuery;
                if (error) throw error;
                setProducts(prods || []);

            } catch (error) {
                logError('SearchPage.fetchData', error);
                setLoadError('Nao foi possivel carregar os produtos.');
                showError('Nao foi possivel carregar os produtos.');
            } finally {
                setLoading(false);
            }
        }

        setSearchParams({ q: query, category: selectedCategory });

        const timeoutId = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, selectedCategory, sortBy, setSearchParams, showError]);

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Buscar Produtos</h1>

                <div className="bg-zinc-900 p-4 rounded-xl border border-white/10 mb-8 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="O que voce procura?"
                            className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:border-yellow-400 outline-none"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-black/50 border border-white/10 rounded-lg pl-10 pr-8 py-2 text-white focus:border-yellow-400 outline-none appearance-none cursor-pointer"
                            >
                                <option value="">Todas as Categorias</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="relative">
                            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="bg-black/50 border border-white/10 rounded-lg pl-10 pr-8 py-2 text-white focus:border-yellow-400 outline-none appearance-none cursor-pointer"
                            >
                                <option value="name-asc">Nome (A-Z)</option>
                                <option value="name-desc">Nome (Z-A)</option>
                                <option value="price-asc">Menor Preco</option>
                                <option value="price-desc">Maior Preco</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loadError && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                        {loadError}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <div
                                key={product.id}
                                onClick={() => navigate(`/products/${product.id}`)}
                                className="bg-zinc-900 rounded-xl border border-white/10 overflow-hidden cursor-pointer group hover:border-yellow-400/50 transition-all"
                            >
                                <div className="aspect-square bg-zinc-800 flex items-center justify-center overflow-hidden relative">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <Package className="w-12 h-12 text-gray-600" />
                                    )}
                                    {product.stock_quantity === 0 && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">ESGOTADO</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-white font-medium mb-1 truncate">{product.name}</h3>
                                    <p className="text-yellow-400 font-bold">{formatCurrency(product.price)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-zinc-900/50 rounded-xl border border-white/5">
                        <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Nenhum produto encontrado</h3>
                        <p className="text-gray-400">Tente buscar por outro termo ou limpe os filtros.</p>
                        <button
                            onClick={() => { setQuery(''); setSelectedCategory(''); }}
                            className="mt-6 text-yellow-400 hover:underline"
                        >
                            Limpar filtros
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
