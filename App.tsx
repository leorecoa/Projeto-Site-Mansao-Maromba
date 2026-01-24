
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductSection from './components/ProductSection';
import AboutSection from './components/AboutSection';
import ReviewSection from './components/ReviewSection';
import MapSection from './components/MapSection';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import SplashScreen from './components/SplashScreen'; // Import the new component
import { PRODUCTS, REVIEWS } from './data';
import { useCart } from './hooks/useCart';

const App: React.FC = () => {
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [isFadingOutSplash, setIsFadingOutSplash] = useState(false);

  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    cartTotal, 
    cartCount, 
    isCartOpen, 
    setIsCartOpen 
  } = useCart();

  const activeProduct = PRODUCTS[activeProductIndex];
  const activeTheme = activeProduct.theme;

  // Handle background transition
  useEffect(() => {
    document.body.style.background = activeTheme.bg;
    document.body.style.transition = 'background 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
  }, [activeTheme]);

  // Splash screen logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOutSplash(true); // Start fade-out animation
    }, 2500); // Show splash for 2.5 seconds before starting fade-out

    return () => clearTimeout(timer);
  }, []);

  const handleSplashAnimationEnd = () => {
    setShowSplashScreen(false); // Remove splash screen component from DOM after animation
  };

  const handleCheckout = () => {
    alert('Pedido finalizado com sucesso! (Integração com Supabase preparada)');
    // logic to push to supabase would go here
  };

  return (
    <>
      {showSplashScreen && (
        <SplashScreen 
          onAnimationEnd={handleSplashAnimationEnd} 
          isFadingOut={isFadingOutSplash} 
        />
      )}
      {/* Main content is always rendered but covered by splash screen initially */}
      <div className="min-h-screen transition-colors duration-1000">
        <Navbar 
          theme={activeTheme} 
          cartCount={cartCount} 
          onOpenCart={() => setIsCartOpen(true)} 
        />
        
        <main>
          <Hero 
            products={PRODUCTS} 
            activeIndex={activeProductIndex} 
            setActiveIndex={setActiveProductIndex}
            onAddToCart={addToCart}
          />
          
          <ProductSection 
            products={PRODUCTS} 
            activeTheme={activeTheme}
            onAddToCart={addToCart}
          />
          
          <AboutSection activeTheme={activeTheme} />
          
          <ReviewSection 
            reviews={REVIEWS} 
            activeTheme={activeTheme} 
          />
          
          <MapSection activeTheme={activeTheme} />
        </main>

        <Footer activeTheme={activeTheme} />

        <CartModal 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          total={cartTotal}
          activeTheme={activeTheme}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onCheckout={handleCheckout}
        />
      </div>
    </>
  );
};

export default App;
