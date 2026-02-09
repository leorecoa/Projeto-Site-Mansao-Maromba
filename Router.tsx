import React, { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/auth/LoginPage';
import App from './App';

export default function Router() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const path = window.location.pathname;

  useEffect(() => {
    if (!authLoading) {
      const timer = setTimeout(() => setLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [authLoading, user]);

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

  if (path === '/login') {
    if (isAuthenticated) {
      window.location.href = '/';
      return null;
    }
    return <LoginPage />;
  }

  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }

  return <App />;
}