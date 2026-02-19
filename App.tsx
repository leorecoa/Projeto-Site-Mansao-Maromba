import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAnalytics } from './hooks/useAnalytics';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './sections/Hero/Hero';
import ProductSection from './sections/Products/ProductSection';
import AboutSection from './sections/About/AboutSection';
import ReviewSection from './sections/Reviews/ReviewSection';
import MapSection from './sections/Map/MapSection';
import CartModal from './components/feedback/CartModal';
import SplashScreen from './components/feedback/SplashScreen';
import { ToastContainer } from './components/feedback/ToastContainer';
import { PRODUCTS, REVIEWS } from './data/products';
import { useCartStore as useCart } from './store/useCart';
import type { Product, Theme } from '@/types';
import { useAuth } from './hooks/useAuth';
import { supabase } from './services/supabase';
import LoginPage from './components/auth/LoginPage';
import AuthCallback from './components/auth/AuthCallback';
import AccountPage from './pages/account/AccountPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import AdminTestPage from './pages/admin/AdminTest';
import DashboardPage from './pages/admin/Dashboard';
import OrdersList from './pages/admin/OrdersList';
import OrderDetailsAdmin from './pages/admin/OrderDetailsAdmin';
import ProductsList from './pages/admin/ProductsList';
import ProductForm from './pages/admin/ProductForm';
import CheckoutPage from './pages/checkout/CheckoutPage';
import SuccessPage from './pages/checkout/SuccessPage';
import ProductDetailsPage from './pages/products/ProductDetailsPage';
import SearchPage from './pages/products/SearchPage';
import TermsPage from './pages/legal/TermsPage';
import PrivacyPage from './pages/legal/PrivacyPage';
import FAQPage from './pages/support/FAQPage';
import TestPage from './pages/TestPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorPage from './pages/ErrorPage';
import { logError } from './utils/logger';

export default function App() {
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [showSplashScreen, setShowSplashScreen] = useState(false); // DESABILITADO PARA DEBUG
  const [isFadingOutSplash, setIsFadingOutSplash] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsCartOpen } = useCart();
  const { isAuthenticated } = useAuth();

  // Analytics
  useAnalytics();

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    let mounted = true;
    
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name');

        if (error) throw error;
        if (!mounted) return;

        if (data && data.length > 0) {
          const mergedProducts: Product[] = data.map(dbProduct => {
            const localMatch = (PRODUCTS.find(p => p.name.toLowerCase() === dbProduct.name.toLowerCase()) || PRODUCTS[0]) as unknown as Product;
            return {
              ...dbProduct,
              theme: (localMatch?.theme || PRODUCTS[0].theme) as unknown as Theme,
              volume: localMatch?.volume,
              type: localMatch?.type,
              image: localMatch?.image || dbProduct.image_url,
              image_url: dbProduct.image_url || localMatch?.image || '',
              description: dbProduct.description || localMatch?.description || ''
            };
          });
          setProducts(mergedProducts);
        } else {
          setProducts(PRODUCTS);
        }
      } catch (err) {
        logError('App.fetchProducts', err);
        if (mounted) setProducts(PRODUCTS);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    
    fetchProducts();
    
    return () => {
      mounted = false;
    };
  }, []);

  const activeProduct = products[activeProductIndex];
  // Garante que activeTheme nunca seja undefined para evitar erros nos componentes
  const activeTheme: Theme = activeProduct?.theme || (PRODUCTS[0].theme as Theme);

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

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      // Salva a intenção de ir para o checkout para redirecionar após o login
      navigate('/login?redirect=/checkout');
    }
  };

  if (loading) {
    return <div className="h-screen bg-black flex items-center justify-center text-white">Carregando...</div>;
  }

  // Verifica se estamos na home para mostrar o Splash e Hero
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen transition-colors duration-1000 overflow-x-hidden">
      {isHome && showSplashScreen && (
        <SplashScreen
          onAnimationEnd={() => setShowSplashScreen(false)}
          isFadingOut={isFadingOutSplash}
        />
      )}

      <Navbar theme={activeTheme} />

      <main>
        <Routes>
          <Route path="/" element={
            <>
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
            </>
          } />

          <Route path="/test" element={<TestPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/faq" element={<FAQPage />} />

          {/* Rotas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/minha-conta" element={<AccountPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/success" element={<SuccessPage />} />
          </Route>

          {/* Rotas Admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/test" element={<AdminTestPage />} />
            <Route path="/admin" element={<DashboardPage />} />
            <Route path="/admin/orders" element={<OrdersList />} />
            <Route path="/admin/orders/:id" element={<OrderDetailsAdmin />} />
            <Route path="/admin/products" element={<ProductsList />} />
            <Route path="/admin/products/new" element={<ProductForm />} />
            <Route path="/admin/products/:id" element={<ProductForm />} />
          </Route>

          <Route path="/error" element={<ErrorPage />} />
          {/* Rota 404 - Deve ser a última */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer activeTheme={activeTheme} />
      <CartModal activeTheme={activeTheme} onCheckout={handleCheckout} />
      <ToastContainer />
    </div>
  );
}
