'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useAppStore } from '@/stores/useAppStore';

interface UserData {
  name: string;
  email: string;
  memberSince: string;
  lastLogin: string;
  ordersCount: number;
}

interface RecentOrder {
  id: string;
  date: string;
  total: number;
  status: 'Pendente' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';
}

export default function MinhaContaPage() {
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const user = useAppStore((state) => state.user);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      redirect('/login');
    }

    const loadData = async () => {
      setLoading(true);

      const mockUserData: UserData = {
        name: user?.name || 'João Silva',
        email: user?.email || 'joao@exemplo.com',
        memberSince: '2023-01-15',
        lastLogin: new Date().toISOString(),
        ordersCount: 5,
      };

      const mockRecentOrders: RecentOrder[] = [
        { id: 'ORD-001', date: '2024-01-15', total: 249.9, status: 'Entregue' },
        { id: 'ORD-002', date: '2024-01-10', total: 129.5, status: 'Enviado' },
      ];

      await new Promise((r) => setTimeout(r, 400));

      setUserData(mockUserData);
      setRecentOrders(mockRecentOrders);
      setLoading(false);
    };

    loadData();
  }, [isLoggedIn, user]);

  if (loading) {
    return <div className="p-6 text-zinc-400">Carregando...</div>;
  }

  return (
    <div className="my-account-page">
      <section className="account-summary">
        <h2>Olá, {userData?.name} 👋</h2>

        <div className="account-stats">
          <div className="stat-card">
            <h3>Total de Pedidos</h3>
            <p className="stat-number">{userData?.ordersCount}</p>
          </div>

          <div className="stat-card">
            <h3>Membro desde</h3>
            <p>{userData && new Date(userData.memberSince).toLocaleDateString('pt-BR')}</p>
          </div>

          <div className="stat-card">
            <h3>Último acesso</h3>
            <p>{userData && new Date(userData.lastLogin).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </section>

      <section className="recent-orders">
        <h2>Pedidos Recentes</h2>

        {recentOrders.length > 0 ? (
          <div className="orders-list">
            {recentOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-info">
                  <span>#{order.id}</span>
                  <span>{order.date}</span>
                  <span className={`status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-total">
                  R$ {order.total.toFixed(2)}
                </div>

                <Link href={`/minha-conta/pedidos/${order.id}`}>
                  Ver detalhes
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhum pedido recente encontrado.</p>
        )}

        <Link href="/minha-conta/pedidos">
          Ver todos os pedidos →
        </Link>
      </section>
    </div>
  );
}
