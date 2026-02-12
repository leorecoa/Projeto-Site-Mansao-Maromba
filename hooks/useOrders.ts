import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../services/supabase'
import { useAuth } from './useAuth'

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
  customer_city: string
  customer_zipcode: string
  payment_method: string
  notes?: string
  items: OrderItem[]
  total_amount: number
}

function buildShippingSnapshot(data: CreateOrderData) {
  if (
    !data.customer_name ||
    !data.customer_email ||
    !data.customer_phone ||
    !data.customer_address ||
    !data.customer_city ||
    !data.customer_zipcode
  ) {
    throw new Error('Dados de entrega incompletos. O snapshot do endereço é obrigatório.')
  }

  return {
    name: data.customer_name,
    email: data.customer_email,
    phone: data.customer_phone,
    address: data.customer_address,
    city: data.customer_city,
    zipcode: data.customer_zipcode,
    created_at: new Date().toISOString()
  }
}

export const useOrders = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user?.id) return []

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
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2,
  })

  const createOrder = useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      // Usa o user do contexto para garantir consistência, 
      // mas valida novamente se necessário ou usa o do contexto
      if (!user?.id) throw new Error('Usuário não autenticado')

      const shippingSnapshot = buildShippingSnapshot(orderData)

      // Prepara o payload completo para a transação no banco
      const rpcPayload = {
        user_id: user.id,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        customer_address: orderData.customer_address,
        customer_city: orderData.customer_city,
        customer_zipcode: orderData.customer_zipcode,
        payment_method: orderData.payment_method,
        notes: orderData.notes,
        total_amount: orderData.total_amount,
        shipping_address_snapshot: shippingSnapshot,
        items: orderData.items
      }

      const { data, error } = await supabase.rpc('create_order', { payload: rpcPayload })

      if (error) {
        console.error('Erro RPC create_order:', error)
        throw new Error(error.message || 'Erro ao processar pedido no servidor.')
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', user?.id] })
    }
  })

  return {
    orders,
    loading: isLoading,
    createOrder: createOrder.mutateAsync,
    isCreating: createOrder.isPending
  }
}
