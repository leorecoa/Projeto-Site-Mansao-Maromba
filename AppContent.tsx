import React, { useEffect, useState, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Hero from './sections/Hero/Hero';
import ProductSection from './sections/Products/ProductSection';
import AboutSection from './sections/About/AboutSection';
import ReviewSection from './sections/Reviews/ReviewSection';
import MapSection from './sections/Map/MapSection';

import CartModal from './components/feedback/CartModal';
import CheckoutModal from './components/feedback/CheckoutModal';
import SplashScreen from './components/feedback/SplashScreen';
import LoginPage from './pages/LoginPage';

import { CartProvider, useCart } from './context/CartContext';
import { useAuth } from './hooks/useAuth';

import { getProducts } from './services/products';
import { getReviews } from './services/reviews';

import { Product, Review, Theme } from './types';

/* =======================
   TEMA PADRÃO GLOBAL
======================= */
const DEFAULT_THEME: Theme = {
  primary: '#facc15',
  secondary: '#1f2937',
  glow: 'rgba(250,204,21,0.4)',
  text: '#ffffff',
  bg: '#000000',
};

/* =======================
   Conteúdo principal
======================= */
const MainContent: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [showSplash, setShowSplash] = useState(true);
  const [isFadingOutSplash, setIsFadingOutSplash] = useState(false);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  /* =======================
     Tema ativo (blindado)
  ======================= */
  const activeTheme: Theme =
    products[activeIndex]?.theme ?? DEFAULT_THEME;

  /* =======================
     Buscar dados
  ======================= */
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      const [productsData, reviewsData] = await Promise.all([
        getProducts(),
        getReviews(),
      ]);

      setProducts(productsData);
      setReviews(reviewsData);

      setIsLoading(false);
    }

    loadData();
  }, []);

  /* =======================
     Atualizar background
  ======================= */
  useEffect(() => {
    document.body.style.background = activeTheme.bg;
  }, [activeTheme.bg]);

  /* =======================
     Splash screen
  ======================= */
  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFadingOutSplash(true), 2000);
    const endTimer = setTimeout(() => setShowSplash(false), 2600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, []);

  /* =======================
     Loading / Empty
  ======================= */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-yellow-400" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Nenhum produto encontrado.
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-700 overflow-x-hidden">
      {showSplash && (
        <SplashScreen
          isFadingOut={isFadingOutSplash}
          onAnimationEnd={() => setShowSplash(false)}
        />
      )}

      <Navbar theme={activeTheme} />

      <main>
        <Suspense fallback={<div className="h-screen bg-black" />}>
          <Hero
            products={products}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        </Suspense>

        <ProductSection products={products} activeTheme={activeTheme} />
        <AboutSection activeTheme={activeTheme} />
        <ReviewSection reviews={reviews} activeTheme={activeTheme} />
        <MapSection activeTheme={activeTheme} />
      </main>

      <Footer activeTheme={activeTheme} />

      <CartModal
        activeTheme={activeTheme}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        activeTheme={activeTheme}
        cart={cart}
        total={cartTotal}
        onSuccess={() => {
          clearCart();
          setIsCheckoutOpen(false);
        }}
      />
    </div>
  );
};

/* =======================
   App / Rotas
======================= */
const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-yellow-400" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={user ? <MainContent /> : <Navigate to="/login" replace />}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
