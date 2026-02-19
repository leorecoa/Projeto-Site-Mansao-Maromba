import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { useCartStore } from '@/store/useCart';
import { useToast } from '@/hooks/useToast';
import { ArrowLeft, ShoppingCart, Star, Package, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import type { Product } from '@/types';
import { logError } from '@/utils/logger';

export default function ProductDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCartStore();
    const { success, error: showError } = useToast();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string>('');

    useEffect(() => {
        async function fetchProduct() {
            if (!id) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                setProduct(data);
                setSelectedImage(data.image_url || '');
            } catch (error) {
                logError('ProductDetailsPage.fetchProduct', error);
                showError('Produto nao encontrado.');
                navigate('/');
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, navigate]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
            success('Produto adicionado ao carrinho!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Voltar
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div className="space-y-4">
                        <div className="aspect-square bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
                            {selectedImage ? (
                                <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <Package className="w-24 h-24 text-gray-600" />
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{product.name}</h1>
                            <div className="flex items-center gap-2 text-yellow-400">
                                <Star className="w-5 h-5 fill-yellow-400" />
                                <span className="font-medium">4.8</span>
                                <span className="text-gray-500 text-sm">(12 avaliacoes)</span>
                            </div>
                        </div>

                        <div className="text-3xl font-bold text-white">
                            {formatCurrency(product.price)}
                        </div>

                        <p className="text-gray-300 leading-relaxed">
                            {product.description || 'Sem descricao disponivel.'}
                        </p>

                        <button
                            onClick={handleAddToCart}
                            className="w-full md:w-auto px-8 py-4 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 text-lg"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            Adicionar ao Carrinho
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-white/10 pt-12">
                    <div className="lg:col-span-1">
                        <h2 className="text-2xl font-bold text-white mb-6">Avalie este produto</h2>
                        <ReviewForm productId={product.id} onSubmit={() => { }} />
                    </div>
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-white mb-6">O que dizem sobre ele</h2>
                        <ReviewList productId={product.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
