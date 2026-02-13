import React from 'react'
import { useOrders } from '../../hooks/useOrders'
import { useAuth } from '../../hooks/useAuth'
import { useNavigation } from '../../hooks/useNavigation'
import { Package, Clock, Truck, CheckCircle, XCircle, Loader2 } from 'lucide-react'

const statusConfig = {
  pending: { label: 'Pendente', icon: Clock, color: 'text-yellow-400' },
  processing: { label: 'Processando', icon: Package, color: 'text-blue-400' },
  shipped: { label: 'Enviado', icon: Truck, color: 'text-purple-400' },
  delivered: { label: 'Entregue', icon: CheckCircle, color: 'text-green-400' },
  cancelled: { label: 'Cancelado', icon: XCircle, color: 'text-red-400' }
}

interface OrderItem {
  id: string
  product_name: string
  product_image: string
  quantity: number
  unit_price: number
  subtotal: number
}

interface Order {
  id: string
  created_at: string
  status: string
  total_amount: number
  payment_method: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  order_items: OrderItem[]
}

export default function OrdersPage() {
  const { user } = useAuth()
  const { orders, loading } = useOrders()
  const { navigate } = useNavigation()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 size={48} className="text-yellow-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold font-syncopate text-yellow-400">
            Meus Pedidos
          </h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20"
          >
            Voltar
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl text-center border border-white/10">
            <Package size={64} className="text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Nenhum pedido ainda</h2>
            <p className="text-gray-400 mb-6">
              Você ainda não fez nenhum pedido. Explore nossos produtos!
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500"
            >
              Ver Produtos
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: Order) => {
              const status = statusConfig[order.status as keyof typeof statusConfig]
              const StatusIcon = status.icon

              return (
                <div key={order.id} className="glass-card p-6 rounded-2xl border border-white/10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <StatusIcon size={24} className={status.color} />
                        <span className={`font-bold ${status.color}`}>{status.label}</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Pedido #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(order.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-yellow-400">
                        R$ {order.total_amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-400 capitalize">
                        {order.payment_method === 'pix' ? 'PIX' : 'Cartão'}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <h3 className="font-bold mb-3">Itens do Pedido</h3>
                    <div className="space-y-3">
                      {order.order_items?.map((item: OrderItem) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-16 h-16 object-contain"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.product_name}</h4>
                            <p className="text-sm text-gray-400">
                              Quantidade: {item.quantity} x R$ {item.unit_price.toFixed(2)}
                            </p>
                          </div>
                          <p className="font-bold text-yellow-400">
                            R$ {item.subtotal.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-white/10 mt-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Cliente</p>
                        <p className="font-semibold">{order.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Email</p>
                        <p className="font-semibold">{order.customer_email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Telefone</p>
                        <p className="font-semibold">{order.customer_phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Endereço</p>
                        <p className="font-semibold">{order.customer_address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
