import { useQuery } from '@tanstack/react-query'
import { supabase } from '../services/supabase'
import { Product } from '../types'
import { PRODUCTS } from '../data/products'

const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw error

  if (data && data.length > 0) {
    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      volume: p.volume,
      type: p.type,
      image: p.image_url || p.image,
      theme: typeof p.theme === 'string' ? JSON.parse(p.theme) : p.theme
    }))
  }

  return PRODUCTS
}

export const useProducts = () => {
  const { data: products = PRODUCTS, isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  })

  return { 
    products, 
    loading: isLoading, 
    error: error?.message || null, 
    refetch 
  }
}
