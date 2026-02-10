import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../hooks/useAuth';
import { useUploadImage } from '../../hooks/useUploadImage';
import { useQueryClient } from '@tanstack/react-query';
import { Package, Users, ShoppingBag, TrendingUp, Plus, Edit, Trash2, X, Upload, Loader2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  volume: string;
  image: string;
  description: string;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const { uploadImage, uploading } = useUploadImage();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'users' | 'stats'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    volume: '',
    image: '',
    description: ''
  });

  const isAdmin = !!user;

  useEffect(() => {
    if (activeTab === 'products') {
      loadProducts();
    }
  }, [activeTab]);

  const loadProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (!error && data) {
      const mappedProducts = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        volume: p.volume,
        image: p.image_url || p.image,
        description: p.description
      }))
      setProducts(mappedProducts);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let imageUrl = formData.image

    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile)
      if (uploadedUrl) imageUrl = uploadedUrl
    }

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      volume: formData.volume,
      image_url: imageUrl,
      description: formData.description,
      type: 'combo'
    };

    const { error } = editingProduct
      ? await supabase.from('products').update(productData).eq('id', editingProduct.id)
      : await supabase.from('products').insert([productData]);

    if (error) {
      console.error('Erro ao salvar produto:', error)
      alert('Erro ao salvar produto: ' + error.message)
      return
    }

    await loadProducts();
    queryClient.invalidateQueries({ queryKey: ['products'] })
    setShowModal(false);
    setEditingProduct(null);
    setImageFile(null)
    setImagePreview('')
    setFormData({ name: '', price: '', volume: '', image: '', description: '' });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      volume: product.volume,
      image: product.image,
      description: product.description
    });
    setImagePreview(product.image)
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
      await supabase.from('products').delete().eq('id', id);
      queryClient.invalidateQueries({ queryKey: ['products'] })
      loadProducts();
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-red-400">Acesso negado. Apenas administradores.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-syncopate text-yellow-400 mb-2">Painel Admin</h1>
          <p className="text-gray-400">Bem-vindo, {user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 rounded-xl border border-yellow-400/20">
            <Package className="w-8 h-8 text-yellow-400 mb-2" />
            <p className="text-gray-400 text-sm">Produtos</p>
            <p className="text-3xl font-bold">{products.length}</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-blue-400/20">
            <ShoppingBag className="w-8 h-8 text-blue-400 mb-2" />
            <p className="text-gray-400 text-sm">Pedidos</p>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-green-400/20">
            <Users className="w-8 h-8 text-green-400 mb-2" />
            <p className="text-gray-400 text-sm">Usuários</p>
            <p className="text-3xl font-bold">-</p>
          </div>
          <div className="glass-card p-6 rounded-xl border border-purple-400/20">
            <TrendingUp className="w-8 h-8 text-purple-400 mb-2" />
            <p className="text-gray-400 text-sm">Vendas</p>
            <p className="text-3xl font-bold">R$ 0</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6 border-b border-white/10">
          {['products', 'orders', 'users', 'stats'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === tab
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'products' && 'Produtos'}
              {tab === 'orders' && 'Pedidos'}
              {tab === 'users' && 'Usuários'}
              {tab === 'stats' && 'Estatísticas'}
            </button>
          ))}
        </div>

        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({ name: '', price: '', volume: '', image: '', description: '' });
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors"
              >
                <Plus size={20} />
                Novo Produto
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="glass-card p-6 rounded-xl border border-white/10">
                  <img src={product.image} alt={product.name} className="w-full h-40 object-contain mb-4" />
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{product.volume}</p>
                  <p className="text-yellow-400 font-bold text-xl mb-4">R$ {product.price.toFixed(2)}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 size={16} />
                      Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="glass-card p-8 rounded-xl text-center">
            <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Nenhum pedido ainda. Aguardando implementação do checkout.</p>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="glass-card p-8 rounded-xl text-center">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Gerenciamento de usuários em desenvolvimento.</p>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="glass-card p-8 rounded-xl text-center">
            <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Relatórios e estatísticas em desenvolvimento.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-card p-8 rounded-2xl max-w-md w-full mx-4 border border-yellow-400/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">{editingProduct ? 'Editar' : 'Novo'} Produto</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Preço</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Volume</label>
                <input
                  type="text"
                  value={formData.volume}
                  onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Imagem do Produto</label>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-400/10 border-2 border-dashed border-yellow-400/30 rounded-lg cursor-pointer hover:bg-yellow-400/20 transition-colors">
                      <Upload size={20} className="text-yellow-400" />
                      <span className="text-yellow-400 font-semibold">
                        {imageFile ? imageFile.name : 'Escolher arquivo'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {imagePreview && (
                    <div className="relative w-full h-40 bg-white/5 rounded-lg overflow-hidden">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}

                  <div className="text-center text-gray-400 text-sm">ou</div>

                  <input
                    type="url"
                    placeholder="Cole a URL da imagem"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value })
                      setImagePreview(e.target.value)
                    }}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  rows={3}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Enviando imagem...
                  </>
                ) : (
                  <>{editingProduct ? 'Atualizar' : 'Criar'} Produto</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
