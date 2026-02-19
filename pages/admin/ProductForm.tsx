import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { ArrowLeft, Save, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { logError } from '@/utils/logger';

interface ProductFormData {
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    category_id: string;
    image_url: string;
}

const PRODUCTS_BUCKET = import.meta.env.VITE_SUPABASE_PRODUCTS_BUCKET || 'products';
const MAX_UPLOAD_SIZE_MB = Number(import.meta.env.VITE_PRODUCTS_MAX_FILE_SIZE_MB || '5');
const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;
const ALLOWED_MIME_TYPES = (import.meta.env.VITE_PRODUCTS_ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/webp,image/gif')
    .split(',')
    .map((type: string) => type.trim())
    .filter(Boolean);

export default function ProductForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { success, error: showError } = useToast();
    const isEditing = !!id;

    const [loading, setLoading] = useState(isEditing);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<ProductFormData>();
    const currentImage = watch('image_url');

    useEffect(() => {
        async function loadData() {
            try {
                const { data: cats } = await supabase.from('categories').select('id, name');
                setCategories(cats || []);

                if (isEditing) {
                    const { data: product, error } = await supabase
                        .from('products')
                        .select('*')
                        .eq('id', id)
                        .single();

                    if (error) throw error;
                    if (product) {
                        reset(product);
                    }
                }
            } catch (error) {
                logError('ProductForm.loadData', error);
                showError('Nao foi possivel carregar os dados do produto.');
                navigate('/admin/products');
            } finally {
                setLoading(false);
            }
        }
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isEditing, navigate, reset]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = e.target.files?.[0];
            if (!file) return;

            if (file.size > MAX_UPLOAD_SIZE_BYTES) {
                showError(`Arquivo muito grande. Limite: ${MAX_UPLOAD_SIZE_MB}MB.`);
                return;
            }

            if (!ALLOWED_MIME_TYPES.includes(file.type)) {
                showError(`Tipo de arquivo nao permitido. Use: ${ALLOWED_MIME_TYPES.join(', ')}`);
                return;
            }

            const fileExt = file.name.split('.').pop() || 'bin';
            const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(PRODUCTS_BUCKET)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from(PRODUCTS_BUCKET).getPublicUrl(filePath);
            setValue('image_url', data.publicUrl);
            success('Imagem enviada com sucesso!');
        } catch (error) {
            logError('ProductForm.handleImageUpload', error);
            const message = error instanceof Error ? error.message.toLowerCase() : '';
            if (message.includes('bucket not found')) {
                showError(`Bucket "${PRODUCTS_BUCKET}" nao encontrado no Supabase Storage.`);
            } else {
                showError('Nao foi possivel enviar a imagem.');
            }
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data: ProductFormData) => {
        try {
            const payload = {
                name: data.name,
                description: data.description || '',
                price: Number(data.price),
                stock_quantity: Number(data.stock_quantity),
                category_id: data.category_id || null,
                image_url: data.image_url || null,
                updated_at: new Date().toISOString(),
            };

            let error;
            if (isEditing) {
                const { error: updateError } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('products')
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw error;

            success(`Produto ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
            navigate('/admin/products');
        } catch (error) {
            logError('ProductForm.onSubmit', error);
            showError('Nao foi possivel salvar o produto.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-white">
                        {isEditing ? 'Editar Produto' : 'Novo Produto'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="bg-zinc-900 p-6 rounded-xl border border-white/10 space-y-6">
                    <div className="flex justify-center">
                        <div className="relative group w-40 h-40 bg-black/50 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden">
                            {currentImage ? (
                                <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="w-10 h-10 text-gray-600" />
                            )}
                            <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                {uploading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : <Upload className="w-6 h-6 text-white" />}
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                            </label>
                        </div>
                    </div>
                    <div className="text-center text-xs text-gray-400">
                        <p>Bucket: <span className="text-yellow-400">{PRODUCTS_BUCKET}</span></p>
                        <p>Tipos permitidos: {ALLOWED_MIME_TYPES.join(', ')}</p>
                        <p>Tamanho maximo: {MAX_UPLOAD_SIZE_MB}MB</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Nome do Produto</label>
                            <input {...register('name', { required: 'Nome e obrigatorio' })} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-400 outline-none" />
                            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Categoria</label>
                            <select {...register('category_id', { required: 'Categoria e obrigatoria' })} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-400 outline-none">
                                <option value="">Selecione...</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Preco (R$)</label>
                            <input type="number" step="0.01" {...register('price', { required: 'Preco e obrigatorio', min: 0 })} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-400 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Estoque</label>
                            <input type="number" {...register('stock_quantity', { required: 'Estoque e obrigatorio', min: 0 })} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-400 outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-1">Descricao</label>
                            <textarea {...register('description')} rows={4} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-400 outline-none resize-none" />
                        </div>
                    </div>

                    <button type="submit" disabled={isSubmitting || uploading} className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Salvar Produto</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
