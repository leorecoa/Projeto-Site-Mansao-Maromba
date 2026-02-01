'use client'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

export default function MyAccountPage() {
  const { user } = useAuth()

  if (!user) return <div>Carregando ou não autenticado...</div>

  return (
    <div className="my-account-container">
      <h1>Minha Conta</h1>
      <p>Bem-vindo, {user.email}!</p>
      <nav>
        <ul>
          <li><Link href="/minha-conta/carteira">Minha Carteira</Link></li>
          <li><Link href="/minha-conta/pedidos">Meus Pedidos</Link></li>
          {/* Adicionar mais links conforme necessário */}
        </ul>
      </nav>
    </div>
  )
}