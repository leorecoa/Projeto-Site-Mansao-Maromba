// c:\Users\Leorecoa\MM\Projeto-Site-Mansao-Maromba\App.tsx

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { useAuth } from './hooks/useAuth'

import LoginPage from './components/pages/LoginPage'
import OrdersPage from './components/pages/OrdersPage'
import AuthCallback from './components/Auth/AuthCallback'

const App: React.FC = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500" />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>

          {/* decisão central */}
          <Route path="/" element={<LoginPage />} />

          {/* público */}
          <Route path="/login" element={<LoginPage />} />

          {/* Callback de Autenticação do Supabase */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* privado */}
          <Route
            path="/OrdersPage"
            element={
              user ? <OrdersPage /> : <Navigate to="/login" replace />
            }
          />

          {/* Dashboard (Redireciona para OrdersPage por enquanto) */}
          <Route
            path="/dashboard"
            element={
              user ? <OrdersPage /> : <Navigate to="/login" replace />
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
