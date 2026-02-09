import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { Product } from '../types'
import { PRODUCTS } from '../data/products'

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS)
  const [loading, setLoading] = useState(false)
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
      console.error('Usando produtos locais:', err.message)
      setProducts(PRODUCTS)
    }
  }

  return { products, loading, error, refetch: loadProducts }
}
