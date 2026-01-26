
import React, { useState, useEffect, Suspense } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './sections/Hero/Hero';
import ProductSection from './sections/Products/ProductSection';
import AboutSection from './sections/About/AboutSection';
import ReviewSection from './sections/Reviews/ReviewSection';
import MapSection from './sections/Map/MapSection';
import CartModal from './components/feedback/CartModal';
import SplashScreen from './components/feedback/SplashScreen';
import { PRODUCTS, REVIEWS } from './data/products';
import { CartProvider } from './context/CartContext';

const MainApp: React.FC = () => {
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [isFadingOutSplash, setIsFadingOutSplash] = useState(false);

  const activeProduct = PRODUCTS[activeProductIndex];
  const activeTheme = activeProduct.theme;

  // Atualiza o background dinamicamente baseado no tema do produto ativo
  useEffect(() => {
    document.body.style.background = activeTheme.bg;
    document.body.style.transition = 'background 1.2s cubic-bezier(0.42, 0, 0.58, 1)';
  }, [activeTheme]);

  // Gerenciamento do Splash Screen
  useEffect(() => {
    const timer = setTimeout(() => setIsFadingOutSplash(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckout = () => {
    // Aqui entrará a lógica de integração com o checkout do Supabase/Stripe
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
        <Suspense fallback={<div className="h-screen bg-black" />}>
          <Hero 
            products={PRODUCTS} 
            activeIndex={activeProductIndex} 
            setActiveIndex={setActiveProductIndex} 
          />
        </Suspense>
        
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

const App: React.FC = () => (
  <CartProvider>
    <MainApp />
  </CartProvider>
);

export default App;
