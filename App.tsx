
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
import { useAuth } from './hooks/useAuth'; // Importar useAuth
import { productsService } from './services/supabase';
// FIX: Adjusted the import path for the 'Product' type for consistency.
import { Product } from './types'; 

// Componente para o conteúdo principal, acessível após o login
const MainContent: React.FC = () => {
  const { cart, cartTotal, clearCart, setIsCartOpen } = useCart();
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [dataSource, setDataSource] = useState<'mock' | 'supabase'>('mock');
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  // FIX: Renamed the useState setter setActiveProductIndex to setHeroActiveIndex for clarity and to prevent potential naming conflicts.
  const [activeProductIndex, setHeroActiveIndex] = useState(0);
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

  // Use Auth para proteger rotas ou mostrar informações do usuário
  const { user, loading: authLoading } = useAuth(); // Usar o hook useAuth

  if (authLoading) {
    // Exibe um carregador enquanto verifica o estado de autenticação
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  // Exemplo de proteção de rota: se não houver usuário logado, redireciona para o login
  // NOTA: Para este projeto, o MainContent é público, então essa proteção pode ser removida se desejado.
  // if (!user) {
  //   return <Navigate to="/login" replace state={{ from: location }} />;
  // }


  return (
    <div className="min-h-screen transition-colors duration-1000 overflow-x-hidden">
      {showSplashScreen && (
        <SplashScreen 
          onAnimationEnd={() => setShowSplashScreen(false)} 
          isFadingOut={isFadingOutSplash} 
        />
      )}
      
      {/* Navbar não precisa mais de onOpenCart e cartCount, pois usa o hook useCart internamente */}
      <Navbar theme={activeTheme} /> 
      
      <main>
        <Suspense fallback={<div className="h-screen bg-black" />}>
          {/* Hero não precisa mais de onAddToCart, pois usa o hook useCart internamente */}
          <Hero 
            products={products} 
            activeIndex={activeProductIndex} 
            // FIX: Pass the renamed setter setHeroActiveIndex to the Hero component.
            setActiveIndex={setHeroActiveIndex} 
          />
        </Suspense>
        
        {/* ProductSection não precisa mais de onAddToCart, pois usa o hook useCart internamente */}
        <ProductSection products={products} activeTheme={activeTheme} />
        <AboutSection activeTheme={activeTheme} />
        <ReviewSection reviews={REVIEWS} activeTheme={activeTheme} />
        <MapSection activeTheme={activeTheme} />
      </main>

      <Footer activeTheme={activeTheme} />
      
      {/* CartModal agora recebe apenas activeTheme e onCheckout, o resto via useCart */}
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

// Componente App com roteamento
const App: React.FC = () => (
  <BrowserRouter>
    <CartProvider> {/* CartProvider deve envolver as rotas para que useCart seja acessível */}
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Adicione outras rotas protegidas aqui, se necessário, ou um dashboard */}
        {/* <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} /> */}
        <Route path="*" element={<Navigate to="/" replace />} /> {/* Redireciona rotas inválidas para a home */}
      </Routes>
    </CartProvider>
  </BrowserRouter>
);

export default App;
    