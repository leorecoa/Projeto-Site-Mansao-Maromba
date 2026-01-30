import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { useAuth } from './hooks/useAuth'

import LoginPage from './components/pages/LoginPage'
import Dashboard from './components/pages/Dashboard'

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
          <Route
            path="/"
            element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
          />

          {/* público */}
          <Route path="/login" element={<LoginPage />} />

          {/* privado */}
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard /> : <Navigate to="/login" replace />
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
