
import React, { useState, useEffect, Suspense } from 'react';
import { useNavigation } from './hooks/useNavigation';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './sections/Hero/Hero';
import ProductSection from './sections/Products/ProductSection';
import AboutSection from './sections/About/AboutSection';
import ReviewSection from './sections/Reviews/ReviewSection';
import MapSection from './sections/Map/MapSection';
import CartModal from './components/feedback/CartModal';
import SplashScreen from './components/feedback/SplashScreen';
import { REVIEWS } from './data/products';
import { useProducts } from './hooks/useProducts';

const MainApp: React.FC = () => {
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [isFadingOutSplash, setIsFadingOutSplash] = useState(false);
  const { products, loading } = useProducts();
  const { navigate } = useNavigation();

  const activeProduct = products[activeProductIndex];
  const activeTheme = activeProduct?.theme;

  useEffect(() => {
    document.body.style.background = activeTheme.bg;
    document.body.style.transition = 'background 1.2s cubic-bezier(0.42, 0, 0.58, 1)';
  }, [activeTheme]);

  useEffect(() => {
    const timer = setTimeout(() => setIsFadingOutSplash(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen transition-colors duration-1000 overflow-x-hidden">
      {showSplashScreen && (
        <SplashScreen 
          onAnimationEnd={() => setShowSplashScreen(false)} 
          isFadingOut={isFadingOutSplash} 
        />
      )}
      
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
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
          <CartModal activeTheme={activeTheme} onCheckout={handleCheckout} />
        </>
      )}
    </div>
  );
};

const App: React.FC = () => <MainApp />;

export default App;