'use client'
import React from 'react';
import { useAuth } from '@/hooks/useAuth'

const AdminCustomersPage: React.FC = () => {
  const { user } = useAuth()
  const isAdmin = !!user // TODO: Implementar verificação de role 'admin' via metadados do usuário

  if (!isAdmin) return <div>Acesso negado. Apenas administradores.</div>

  return (
    <div className="admin-container">
      <h1>Gerenciar Clientes</h1>
      <p>Ver lista de clientes, saldo da carteira, histórico de transações.</p>
      {/* Adicionar listagem de clientes aqui */}
    </div>
  )
}

export default AdminCustomersPage;