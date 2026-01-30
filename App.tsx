import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { useAuth } from './hooks/useAuth';

import LoginPage from './components/pages/LoginPage'; // ajuste conforme SUA árvore

// lazy
const Dashboard = lazy(() => import('./components/pages/Dashboard'));

const App: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>

          {/* LANDING PAGE = loja */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* LOGIN */}
          <Route path="/login" element={<LoginPage />} />

          {/* DASHBOARD protegido */}
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<div className="text-white">Carregando…</div>}>
                <Dashboard />
              </Suspense>
            }
          />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
