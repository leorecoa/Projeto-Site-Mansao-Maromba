'use client';

import { redirect } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function OrdersAdminPage() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return null;

  if (!user || !isAdmin) {
    redirect('/');
  }

  return (
    <div>
      <h1>Pedidos (Admin)</h1>
    </div>
  );
}
