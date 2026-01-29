// App.tsx - CORREÇÃO
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { supabase } from './supabase';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './sections/Hero/Hero';
import ProductSection from './sections/Products/ProductSection';
import AboutSection from './sections/About/AboutSection';
import ReviewSection from './sections/Reviews/ReviewSection';
import MapSection from './sections/Map/MapSection';
import CartModal from './components/feedback/CartModal';
import SplashScreen from './components/feedback/SplashScreen';
import AuthCallback from './components/Auth/AuthCallback';
import { PRODUCTS, REVIEWS } from './data/products';
import { CartProvider } from './context/CartContext';
import { useAuth } from './hooks/useAuth';
import type { Theme as ProductTheme } from './types';

// Lazy load para páginas
const Dashboard = lazy(() => import('./components/pages/Dashboard'));
const LoginPage = lazy(() => import('./components/pages/LoginPage'));
const Profile = lazy(() => import('./components/pages/Profile'));

// Componente para rotas protegidas - CORRIGIDO
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // Só redireciona se estiver tentando acessar uma rota protegida SEM estar autenticado
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // NÃO redireciona se já estiver autenticado e tentando acessar rota pública
  // Isso permite que usuário logado veja a loja (/)
  return <>{children}</>;
};

// Componente principal da landing page - AGORA FUNCIONAL
const LandingPage: React.FC = () => {
  const [activeProductIndex, setActiveProductIndex] = useState<number>(0);
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);
  const [isFadingOutSplash, setIsFadingOutSplash] = useState<boolean>(false);

  const activeProduct = PRODUCTS[activeProductIndex];
  const activeTheme: ProductTheme = activeProduct.theme;

  useEffect(() => {
    document.body.style.background = activeTheme.bg;
    document.body.style.transition = 'background 1.2s cubic-bezier(0.42, 0, 0.58, 1)';
  }, [activeTheme]);

  useEffect(() => {
    const timer = setTimeout(() => setIsFadingOutSplash(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckout = () => {
    alert('Redirecionando para o Checkout Seguro Mansão Maromba...');
  };

  return (
    <div className="min-h-screen transition-colors duration-1000 overflow-x-hidden">
      {showSplashScreen && (
        <SplashScreen
          onAnimationEnd={() => setShowSplashScreen(false)}
          isFadingOut={isFadingOutSplash}
        />
      )}

      <Navbar theme={activeTheme} />

      <main>
        <Hero
          products={PRODUCTS}
          activeIndex={activeProductIndex}
          setActiveIndex={setActiveProductIndex}
        />

        <ProductSection products={PRODUCTS} activeTheme={activeTheme} />
        <AboutSection activeTheme={activeTheme} />
        <ReviewSection reviews={REVIEWS} activeTheme={activeTheme} />
        <MapSection activeTheme={activeTheme} />
      </main>

      <Footer activeTheme={activeTheme} />
      <CartModal activeTheme={activeTheme} onCheckout={handleCheckout} />
    </div>
  );
};

// Componente App principal com rotas - CORRIGIDO
const App: React.FC = () => {
  const { user, loading } = useAuth();

  // Se está carregando, mostra loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Rota pública - Landing Page (SEMPRE acessível) */}
          <Route path="/" element={<LandingPage />} />

          {/* Rota de login - Só acessível se NÃO estiver logado */}
          <Route path="/login" element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen bg-black">
                  <div className="text-white">Carregando...</div>
                </div>
              }>
                <LoginPage />
              </Suspense>
            )
          } />

          {/* Rota de callback do Google OAuth */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Rotas protegidas - Só acessíveis se ESTIVER logado */}
          <Route path="/dashboard" element={
            user ? (
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen bg-black">
                  <div className="text-white">Carregando dashboard...</div>
                </div>
              }>
                <Dashboard />
              </Suspense>
            ) : (
              <Navigate to="/login" replace />
            )
          } />

          <Route path="/profile" element={
            user ? (
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen bg-black">
                  <div className="text-white">Carregando perfil...</div>
                </div>
              }>
                <Profile />
              </Suspense>
            ) : (
              <Navigate to="/login" replace />
            )
          } />

          {/* Rota 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;