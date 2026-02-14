import { Routes, Route } from 'react-router-dom';

import App from './App';
import AuthCallback from '@/components/auth/AuthCallback';
import LoginPage from '@/components/auth/LoginPage';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AdminPanel from '@/components/admin/AdminPanel';
import CheckoutPage from '@/components/checkout/CheckoutPage';
import OrdersPage from '@/components/checkout/OrdersPage';

export default function Router() {
  // A lógica de roteamento agora é declarativa e gerenciada pelo react-router-dom.
  // A verificação de autenticação foi movida para os componentes ProtectedRoute e AdminRoute.

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Rotas Protegidas para usuários autenticados */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<App />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Route>

      {/* Rotas Protegidas de Administrador */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminPanel />} />
      </Route>
    </Routes>
  );
}
