'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

export default function MyOrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(name, image_url))') // Buscar itens do pedido e detalhes do produto
        .eq('customer_id', user.id) // Supondo que customer_id na orders é o auth.uid
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar pedidos:', error)
      } else if (data) {
        setOrders(data)
      }
      setLoading(false)
    }

    fetchOrders()
  }, [user])

  if (!user) return <div>Faça login para ver seus pedidos.</div>
  if (loading) return <div>Carregando pedidos...</div>

  return (
    <div className="my-orders-container">
      <h1>Meus Pedidos</h1>
      {orders.length === 0 ? (
        <p>Você não fez nenhum pedido ainda.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <h3>Pedido #{order.id.substring(0, 8)}</h3>
              <p>Data: {new Date(order.created_at).toLocaleDateString()}</p>
              <p>Total: R$ {order.total_amount.toFixed(2)}</p>
              <p>Status: {order.status}</p>
              <h4>Itens do Pedido:</h4>
              <ul>
                {order.order_items.map(item => (
                  <li key={item.id}>
                    {item.products.name} x {item.quantity} (R$ {item.unit_price.toFixed(2)} cada)
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}