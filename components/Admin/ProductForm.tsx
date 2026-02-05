import { useEffect, useState, FormEvent } from 'react'
import { supabase } from '../../services/supabase'

/* =====================
   TIPAGENS
===================== */

interface Category {
  id: string
  name: string
}

interface Product {
  id?: string
  name: string
  description?: string
  price: number
  image_url?: string
  volume?: string
  type?: string
  stock_quantity: number
  category_id: string
}

interface ProductFormProps {
  product?: Product | null
  onClose: () => void
  onSuccess: () => void
}

/* =====================
   COMPONENTE
===================== */

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState<string>(product?.name ?? '')
  const [description, setDescription] = useState<string>(product?.description ?? '')
  const [price, setPrice] = useState<number>(product?.price ?? 0)
  const [imageUrl, setImageUrl] = useState<string>(product?.image_url ?? '')
  const [volume, setVolume] = useState<string>(product?.volume ?? '')
  const [type, setType] = useState<string>(product?.type ?? '')
  const [stockQuantity, setStockQuantity] = useState<number>(product?.stock_quantity ?? 0)
  const [categoryId, setCategoryId] = useState<string>(product?.category_id ?? '')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  /* =====================
     FETCH CATEGORIES
  ===================== */

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')

      if (error) {
        console.error('Erro ao buscar categorias:', error)
        return
      }

      setCategories(data as Category[])
    }

    fetchCategories()
  }, [])

  /* =====================
     SUBMIT
  ===================== */

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const productData: Omit<Product, 'id'> = {
      name,
      description,
      price,
      image_url: imageUrl,
      volume,
      type,
      stock_quantity: stockQuantity,
      category_id: categoryId,
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')

    let error = null

    if (product?.id) {
      ;({ error } = await supabase
        .from('products')
        .update({ ...productData, slug })
        .eq('id', product.id))
    } else {
      ;({ error } = await supabase
        .from('products')
        .insert({ ...productData, slug }))
    }

    if (error) {
      alert('Erro ao salvar produto: ' + error.message)
    } else {
      onSuccess()
      onClose()
    }

    setLoading(false)
  }

  /* =====================
     RENDER
  ===================== */

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <label>
        Nome:
        <input value={name} onChange={e => setName(e.target.value)} required />
      </label>

      <label>
        Descrição:
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
      </label>

      <label>
        Preço:
        <input
          type="number"
          value={price}
          min={0}
          step={0.01}
          onChange={e => setPrice(Number(e.target.value))}
          required
        />
      </label>

      <label>
        URL da Imagem:
        <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
      </label>

      <label>
        Volume:
        <input value={volume} onChange={e => setVolume(e.target.value)} />
      </label>

      <label>
        Tipo:
        <input value={type} onChange={e => setType(e.target.value)} />
      </label>

      <label>
        Estoque:
        <input
          type="number"
          min={0}
          value={stockQuantity}
          onChange={e => setStockQuantity(Number(e.target.value))}
          required
        />
      </label>

      <label>
        Categoria:
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
          <option value="">Selecione uma categoria</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </label>

      <div>
        <button type="button" onClick={onClose} disabled={loading}>
          Cancelar
        </button>

        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Produto'}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
