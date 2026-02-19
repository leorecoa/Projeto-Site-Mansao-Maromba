import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { useToast } from '@/store/useToast';
import { logError } from '@/utils/logger';

export default function ProductForm() {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image_url: '',
        stock_quantity: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const price = parseFloat(formData.price);
        const stock = parseInt(formData.stock_quantity, 10);

        if (isNaN(price) || isNaN(stock)) {
            addToast('Insira valores validos para preco e estoque.', 'error');
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase
                .from('products')
                .insert([{
                    name: formData.name,
                    description: formData.description,
                    price,
                    image_url: formData.image_url,
                    stock_quantity: stock,
                    is_active: true,
                    theme: {
                        primary: '#FFD700',
                        secondary: '#000000',
                        glow: 'rgba(255, 215, 0, 0.5)',
                        text: '#FFFFFF',
                        bg: '#111111'
                    }
                }]);

            if (error) throw error;

            addToast('Produto criado com sucesso!', 'success');
            navigate('/admin');
        } catch (error) {
            logError('AdminProductForm.handleSubmit', error);
            addToast('Nao foi possivel criar o produto.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-yellow-400">Novo Produto</h1>
                    <button
                        onClick={() => navigate('/admin')}
                        className="text-gray-400 hover:text-white"
                    >
                        Voltar
                    </button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Nome do Produto</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:border-yellow-400 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Descricao</label>
                            <textarea
                                name="description"
                                rows={3}
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:border-yellow-400 focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Preco (R$)</label>
                                <input
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    required
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:border-yellow-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Estoque</label>
                                <input
                                    type="number"
                                    name="stock_quantity"
                                    required
                                    value={formData.stock_quantity}
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:border-yellow-400 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">URL da Imagem</label>
                            <input
                                type="url"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full bg-black/50 border border-white/20 rounded p-3 text-white focus:border-yellow-400 focus:outline-none"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-yellow-400 text-black font-bold py-3 rounded hover:bg-yellow-500 transition disabled:opacity-50"
                            >
                                {loading ? 'Salvando...' : 'Criar Produto'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
