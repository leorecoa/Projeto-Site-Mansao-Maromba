import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/types';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

export default function ProductDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, setIsCartOpen } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProduct() {
            if (!id) return;

            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (data) {
                setProduct(data);
            }
            setLoading(false);
        }
        loadProduct();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Carregando...</div>;
    if (!product) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Produto não encontrado</div>;

    return (
        <div className="min-h-screen bg-zinc-900 text-white pt-24 px-4">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
                {/* Imagem do Produto */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-800 border border-white/10">
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 left-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
                    >
                        <ArrowLeft className="text-white w-6 h-6" />
                    </button>
                </div>

                {/* Informações */}
                <div className="space-y-8 flex flex-col justify-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{product.name}</h1>
                        <p className="text-3xl text-yellow-400 font-bold">R$ {product.price?.toFixed(2)}</p>
                    </div>

                    <div className="prose prose-invert max-w-none">
                        <h3 className="text-xl font-bold text-white mb-2">Descrição</h3>
                        <p className="text-gray-400 leading-relaxed">{product.description}</p>
                    </div>

                    <button
                        onClick={() => {
                            addToCart({
                                ...product,
                                description: product.description || ''
                            });
                            setIsCartOpen(true);
                        }}
                        className="w-full py-4 bg-yellow-400 text-black font-bold text-lg rounded-xl hover:bg-yellow-300 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-yellow-400/20"
                    >
                        <ShoppingCart className="w-6 h-6" />
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </div>
    );
}