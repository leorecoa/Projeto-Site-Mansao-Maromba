'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export default function AdminProductsPage() {
  const { isAdmin } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!isAdmin) return
    
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error) setProducts(data)
      setLoading(false)
    }
    
    fetchProducts()
  }, [isAdmin])
  
  if (!isAdmin) return <div>Acesso negado. Apenas administradores.</div>
  
  return (
    <div className="admin-container">
      <h1>Gerenciar Produtos</h1>
      <button 
        className="btn-add-product"
        style={{ background: 'var(--color-primary, #ff0000)' }}
      >
        + Novo Produto
      </button>
      
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="admin-product-card">
            <img src={product.image_url} alt={product.name} />
            <h3>{product.name}</h3>
            <p>R$ {product.price}</p>
            <div className="product-actions">
              <button>Editar</button>
              <button style={{ background: '#ff3333' }}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}