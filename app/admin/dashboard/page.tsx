'use client'
import React from 'react';
import { useAuth } from '@/hooks/useAuth'

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth()
  const isAdmin = !!user // TODO: Implementar verificação de role 'admin' via metadados do usuário

  if (!isAdmin) return <div>Acesso negado. Apenas administradores.</div>

  return (
    <div className="admin-container">
      <h1>Painel de Administração - Dashboard</h1>
      <p>Visão geral de vendas, usuários ativos, saldo total em carteiras.</p>
      {/* Adicionar conteúdo do dashboard aqui */}
    </div>
  )
}

export default AdminDashboardPage;