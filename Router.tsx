import React, { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useNavigation } from './hooks/useNavigation';
import LoginPage from './components/auth/LoginPage';
import AuthCallback from './components/auth/AuthCallback';
import AdminPanel from './components/admin/AdminPanel';
import CheckoutPage from './components/checkout/CheckoutPage';
import OrdersPage from './components/checkout/OrdersPage';
import App from './App';

export default function Router() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const { currentPath, navigate } = useNavigation();
  const [loading, setLoading] = useState(true);
  const hasOAuthCallback = window.location.hash.includes('access_token');

  useEffect(() => {
    if (!authLoading) {
      const timer = setTimeout(() => setLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (loading || authLoading) return;

    if (!isAuthenticated && currentPath !== '/login') {
      navigate('/login');
    } else if (isAuthenticated && currentPath === '/login') {
      navigate('/');
    }
  }, [isAuthenticated, currentPath, loading, authLoading, navigate]);

  if (hasOAuthCallback) {
    return <AuthCallback />;
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && currentPath !== '/login') {
    return null;
  }

  if (currentPath === '/login') {
    if (isAuthenticated) {
      return null;
    }
    return <LoginPage />;
  }

  if (currentPath === '/admin') {
    return <AdminPanel />;
  }

  if (currentPath === '/checkout') {
    return <CheckoutPage />;
  }

  if (currentPath === '/orders') {
    return <OrdersPage />;
  }

  return <App />;
}