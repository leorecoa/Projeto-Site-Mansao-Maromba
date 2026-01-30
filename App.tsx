
import React, { useState, useEffect, Suspense } from 'react';
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
import { PRODUCTS as MOCK_PRODUCTS, REVIEWS } from './data/products';
import { CartProvider, useCart } from './context/CartContext';
import { useAuth } from './hooks/useAuth';
import { productsService } from './services/supabase';
import { Product } from './types';

const MainContent: React.FC = () => {
  const { cart, cartTotal, clearCart, setIsCartOpen } = useCart();
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [dataSource, setDataSource] = useState<'mock' | 'supabase'>('mock');
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [isFadingOutSplash, setIsFadingOutSplash] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const activeProduct = products[activeProductIndex] || MOCK_PRODUCTS[0];
  const activeTheme = activeProduct.theme;

  useEffect(() => {
    const fetchDBData = async () => {
      setIsLoadingProducts(true);
      try {
        const dbProducts = await productsService.getProducts();
        if (dbProducts && dbProducts.length > 0) {
          setProducts(dbProducts);
          setDataSource('supabase');
        }
      } catch (error) {
        console.error('Erro de conexão com o Banco:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchDBData();
  }, []);

  useEffect(() => {
    if (activeTheme) {
      document.body.style.background = activeTheme.bg;
    }
  }, [activeTheme]);

  useEffect(() => {
    const timer = setTimeout(() => setIsFadingOutSplash(true), 2500);
    return () => clearTimeout(timer);
  }, []);

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
        <Suspense fallback={<div className="h-screen bg-black" />}>
          <Hero 
            products={products} 
            activeIndex={activeProductIndex} 
            setActiveIndex={setActiveProductIndex} 
          />
        </Suspense>
        
        <ProductSection products={products} activeTheme={activeTheme} />
        <AboutSection activeTheme={activeTheme} />
        <ReviewSection reviews={REVIEWS} activeTheme={activeTheme} />
        <MapSection activeTheme={activeTheme} />
      </main>

      <Footer activeTheme={activeTheme} />
      
      <CartModal activeTheme={activeTheme} onCheckout={() => setIsCheckoutOpen(true)} />

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

const App: React.FC = () => (
  <BrowserRouter>
    <CartProvider>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  </BrowserRouter>
);

export default App;
