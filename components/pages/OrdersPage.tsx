import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle,
  Loader
} from 'lucide-react'

import { supabase } from '../../supabase'
import { useAuth } from '../../hooks/useAuth'
import Navbar from '../layout/Navbar'
import type { Theme } from '../../types'

/* =======================
   TIPOS
======================= */

interface Product {
  name: string
  image_url: string | null
}

interface OrderItem {
  quantity: number
  unit_price: number
  products: Product | null
}

interface Order {
  id: string
  created_at: string | null
  total_amount: number
  status: string | null
  order_items: OrderItem[]
}

/* =======================
   COMPONENT
======================= */

const OrdersPage = () => {
  const { user } = useAuth()

  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const theme: Theme = {
    primary: '#facc15',
    secondary: '#1f2937',
    glow: 'rgba(250, 204, 21, 0.4)',
    text: '#FFFFFF',
    bg: 'linear-gradient(180deg, #111827 0%, #000000 100%)'
  }

  /* =======================
     DATA
  ======================= */

  useEffect(() => {
    if (!user) return

    const loadOrders = async () => {
      setIsLoading(true)

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          total_amount,
          status,
          order_items (
            quantity,
            unit_price,
            products (
              name,
              image_url
            )
          )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar pedidos:', error)
      } else {
        setOrders(data ?? [])
      }

      setIsLoading(false)
    }

    loadOrders()
  }, [user])

  /* =======================
     HELPERS
  ======================= */

  const formatDate = (value: string | null) => {
    if (!value) return 'Data indisponível'
    return new Date(value).toLocaleDateString('pt-BR')
  }

  const statusIcon = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Package className="h-5 w-5 text-yellow-400" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-400" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      default:
        return <ShoppingBag className="h-5 w-5 text-gray-400" />
    }
  }

  /* =======================
     RENDER
  ======================= */

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <Navbar theme={theme} />

      <main className="container mx-auto px-4 py-12 pt-24">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white font-syncopate">
            Meus Pedidos
          </h1>

          <Link
            to="/"
            className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition"
          >
            Voltar para a Loja
          </Link>
        </header>

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-8 w-8 animate-spin text-yellow-400" />
          </div>
        )}

        {!isLoading && orders.length === 0 && (
          <EmptyState />
        )}

        {!isLoading && orders.length > 0 && (
          <section className="space-y-6">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </section>
        )}
      </main>
    </div>
  )
}

export default OrdersPage

/* =======================
   SUBCOMPONENTS
======================= */

const EmptyState = () => (
  <div className="text-center py-16 bg-white/5 rounded-lg border border-white/10">
    <ShoppingBag className="mx-auto h-12 w-12 text-gray-500" />
    <h3 className="mt-3 text-lg font-medium text-white">
      Nenhum pedido encontrado
    </h3>
    <p className="text-sm text-gray-400">
      Você ainda não fez nenhuma compra.
    </p>

    <Link
      to="/"
      className="inline-block mt-6 px-4 py-2 bg-yellow-400 text-black font-medium rounded-md hover:bg-yellow-300"
    >
      Começar a comprar
    </Link>
  </div>
)

const OrderCard = ({ order }: { order: Order }) => (
  <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
    <div className="p-4 sm:p-6 flex justify-between items-start bg-white/5">
      <div>
        <p className="text-sm font-medium text-yellow-400">
          Pedido #{order.id.slice(0, 8)}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Realizado em {formatOrderDate(order.created_at)}
        </p>
      </div>

      <div className="text-right">
        <p className="text-lg font-semibold text-white">
          R$ {order.total_amount.toFixed(2).replace('.', ',')}
        </p>
        <div className="flex items-center justify-end gap-2 mt-1 text-sm text-gray-300">
          {statusIcon(order.status)}
          <span className="capitalize">
            {order.status ?? 'Pendente'}
          </span>
        </div>
      </div>
    </div>

    <ul className="p-4 sm:p-6 border-t border-white/10 space-y-4">
      {order.order_items.map((item, index) => (
        <li key={index} className="flex items-center gap-4">
          <img
            src={item.products?.image_url ?? 'https://via.placeholder.com/100'}
            alt={item.products?.name ?? 'Produto'}
            className="w-16 h-16 object-cover rounded-md"
          />

          <div className="flex-1">
            <p className="font-semibold text-white">
              {item.products?.name ?? 'Produto sem nome'}
            </p>
            <p className="text-sm text-gray-400">
              {item.quantity} × R$ {item.unit_price.toFixed(2).replace('.', ',')}
            </p>
          </div>

          <p className="font-semibold text-white">
            R$ {(item.quantity * item.unit_price).toFixed(2).replace('.', ',')}
          </p>
        </li>
      ))}
    </ul>
  </div>
)

/* helpers isolados */
const formatOrderDate = (date: string | null) =>
  date ? new Date(date).toLocaleDateString('pt-BR') : 'Data indisponível'

const statusIcon = (status: string | null) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return <Package className="h-5 w-5 text-yellow-400" />
    case 'shipped':
      return <Truck className="h-5 w-5 text-blue-400" />
    case 'delivered':
      return <CheckCircle className="h-5 w-5 text-green-400" />
    default:
      return <ShoppingBag className="h-5 w-5 text-gray-400" />
  }
}
