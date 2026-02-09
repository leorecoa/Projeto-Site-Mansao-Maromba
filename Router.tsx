import React from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/auth/LoginPage';
import App from './App';

export default function Router() {
  const { isAuthenticated } = useAuth();
  const path = window.location.pathname;

  if (path === '/login') {
    return <LoginPage />;
  }

  if (!isAuthenticated && path !== '/') {
    window.location.href = '/login';
    return null;
  }

  return <App />;
}