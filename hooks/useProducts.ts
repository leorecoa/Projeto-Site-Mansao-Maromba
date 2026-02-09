import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { Product } from '../types'
import { PRODUCTS } from '../data/products'

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error

      if (data && data.length > 0) {
        setProducts(data as Product[])
      }
    } catch (err: any) {
      console.error('Erro ao carregar produtos:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { products, loading, error, refetch: loadProducts }
}
