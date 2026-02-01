'use client'
import { useAuth } from '@/hooks/useAuth'

export default function AdminOrdersPage() {
  const { isAdmin } = useAuth()

  if (!isAdmin) return <div>Acesso negado. Apenas administradores.</div>

  return (
    <div className="admin-container">
      <h1>Gerenciar Pedidos</h1>
      <p>Listar todos os pedidos, alterar status (pending → processing → shipped → delivered).</p>
      {/* Adicionar listagem de pedidos aqui */}
    </div>
  )
}