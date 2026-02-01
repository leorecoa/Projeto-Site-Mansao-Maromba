'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const ProductForm = ({ product, onClose, onSuccess }) => {
  const [name, setName] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.description || '')
  const [price, setPrice] = useState(product?.price || 0)
  const [imageUrl, setImageUrl] = useState(product?.image_url || '')
  const [volume, setVolume] = useState(product?.volume || '')
  const [type, setType] = useState(product?.type || '')
  const [stockQuantity, setStockQuantity] = useState(product?.stock_quantity || 0)
  const [categoryId, setCategoryId] = useState(product?.category_id || '')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('id, name')
      if (!error) setCategories(data)
      else console.error('Erro ao buscar categorias:', error)
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const productData = {
      name,
      description,
      price,
      image_url: imageUrl,
      volume,
      type,
      stock_quantity: stockQuantity,
      category_id: categoryId,
      slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') // Gerar slug simples
    }

    let error = null
    if (product?.id) {
      // Editar produto existente
      ({ error } = await supabase.from('products').update(productData).eq('id', product.id))
    } else {
      // Criar novo produto
      ({ error } = await supabase.from('products').insert(productData))
    }

    if (error) {
      alert('Erro ao salvar produto:' + error.message)
    } else {
      onSuccess()
      onClose()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <label>
        Nome:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Descrição:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
      </label>
      <label>
        Preço:
        <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required min="0" step="0.01" />
      </label>
      <label>
        URL da Imagem:
        <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      </label>
      <label>
        Volume:
        <input type="text" value={volume} onChange={(e) => setVolume(e.target.value)} />
      </label>
      <label>
        Tipo:
        <input type="text" value={type} onChange={(e) => setType(e.target.value)} />
      </label>
      <label>
        Estoque:
        <input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(Number(e.target.value))} required min="0" />
      </label>
      <label>
        Categoria:
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
          <option value="">Selecione uma categoria</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </label>
      <div>
        <button type="button" onClick={onClose} disabled={loading}>Cancelar</button>
        <button type="submit" disabled={loading} style={{ background: 'var(--color-primary)' }}>
          {loading ? 'Salvando...' : 'Salvar Produto'}
        </button>
      </div>
    </form>
  )
}

export default ProductForm