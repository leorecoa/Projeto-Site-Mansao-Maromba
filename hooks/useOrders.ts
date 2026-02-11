import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../services/supabase'

interface OrderItem {
  product_id: string
  product_name: string
  product_image: string
  quantity: number
  unit_price: number
  subtotal: number
}

interface CreateOrderData {
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  payment_method: string
  notes?: string
  items: OrderItem[]
  total_amount: number
}

export const useOrders = () => {
  const queryClient = useQueryClient()

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('orders')
        .select('*,order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar pedidos:', error)
        return []
      }
      return data || []
    },
    staleTime: 1000 * 60 * 2,
  })

  const createOrder = useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone,
          customer_address: orderData.customer_address,
          payment_method: orderData.payment_method,
          notes: orderData.notes,
          total_amount: orderData.total_amount,
          status: 'pending'
        }])
        .select()
        .single()

      if (orderError) throw orderError

      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        ...item
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      return order
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    }
  })

  return {
    orders,
    loading: isLoading,
    createOrder: createOrder.mutateAsync,
    isCreating: createOrder.isPending
  }
}
