'use client'
import { useAuth } from '@/hooks/useAuth'

export default function AdminCustomersPage() {
  const { isAdmin } = useAuth()

  if (!isAdmin) return <div>Acesso negado. Apenas administradores.</div>

  return (
    <div className="admin-container">
      <h1>Gerenciar Clientes</h1>
      <p>Ver lista de clientes, saldo da carteira, histórico de transações.</p>
      {/* Adicionar listagem de clientes aqui */}
    </div>
  )
}