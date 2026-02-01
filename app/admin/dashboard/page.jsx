'use client'
import { useAuth } from '@/hooks/useAuth'

export default function AdminDashboardPage() {
  const { isAdmin } = useAuth()

  if (!isAdmin) return <div>Acesso negado. Apenas administradores.</div>

  return (
    <div className="admin-container">
      <h1>Painel de Administração - Dashboard</h1>
      <p>Visão geral de vendas, usuários ativos, saldo total em carteiras.</p>
      {/* Adicionar conteúdo do dashboard aqui */}
    </div>
  )
}