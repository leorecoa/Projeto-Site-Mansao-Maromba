import { Routes, Route } from 'react-router-dom';

import App from './App';
import AuthCallback from '@/components/auth/AuthCallback';
import LoginPage from '@/components/auth/LoginPage';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AdminPanel from '@/components/admin/AdminPanel';
import ProductForm from '@/components/admin/ProductForm';
import CheckoutPage from '@/components/checkout/CheckoutPage';
import OrdersPage from '@/components/checkout/OrdersPage';
import PaymentPage from '@/components/checkout/PaymentPage';
import ProductDetailsPage from './ProductDetailsPage';

export default function Router() {
  // A lógica de roteamento agora é declarativa e gerenciada pelo react-router-dom.
  // A verificação de autenticação foi movida para os componentes ProtectedRoute e AdminRoute.

  return (
    <Routes>

      {/* Públicas */}
      <Route path="/" element={<App />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/payment/:orderId" element={<PaymentPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Route>

      {/* Admin */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/products/new" element={<ProductForm />} />
      </Route>

    </Routes>

  );
}
