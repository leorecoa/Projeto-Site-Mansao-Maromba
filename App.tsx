
import React, { useState, useEffect, Suspense } from 'react';
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
import { PRODUCTS as MOCK_PRODUCTS, REVIEWS } from './data/products';
import { CartProvider, useCart } from './context/CartContext';
import { productsService } from './services/supabase';
import { Product } from './types';

const MainApp: React.FC = () => {
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
          console.log('✅ Conectado ao Supabase: Dados carregados com sucesso.');
        } else {
          console.warn('⚠️ Supabase retornou vazio ou chaves não configuradas. Usando Mock Data.');
        }
      } catch (error) {
        console.error('❌ Erro de conexão com o Banco:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchDBData();
  }, []);

  useEffect(() => {
    if (activeTheme) {
      document.body.style.background = activeTheme.bg;
      document.body.style.transition = 'background 1.2s cubic-bezier(0.42, 0, 0.58, 1)';
    }
  }, [activeTheme]);

  useEffect(() => {
    const timer = setTimeout(() => setIsFadingOutSplash(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = () => {
    clearCart();
    setIsCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen transition-colors duration-1000 overflow-x-hidden">
      {/* Indicador de Debug (Apenas para você saber se o banco funcionou) */}
      <div className="fixed bottom-4 left-4 z-[200] opacity-20 hover:opacity-100 transition-opacity">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${dataSource === 'supabase' ? 'bg-green-500 text-black' : 'bg-yellow-500 text-black'}`}>
          DB: {dataSource}
        </span>
      </div>

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
      
      <CartModal 
        activeTheme={activeTheme} 
        onCheckout={handleOpenCheckout} 
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        activeTheme={activeTheme}
        cart={cart}
        total={cartTotal}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
};

const App: React.FC = () => (
  <CartProvider>
    <MainApp />
  </CartProvider>
);

export default App;
