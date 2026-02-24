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
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { logError } from './utils/logger';
import ErrorPage from './pages/ErrorPage';

const LoginPage = React.lazy(() => import('./components/auth/LoginPage'));
const AuthCallback = React.lazy(() => import('./components/auth/AuthCallback'));
const AccountPage = React.lazy(() => import('./pages/account/AccountPage'));
const AdminTestPage = React.lazy(() => import('./pages/admin/AdminTest'));
const DashboardPage = React.lazy(() => import('./pages/admin/Dashboard'));
const OrdersList = React.lazy(() => import('./pages/admin/OrdersList'));
const OrderDetailsAdmin = React.lazy(() => import('./pages/admin/OrderDetailsAdmin'));
const ProductsList = React.lazy(() => import('./pages/admin/ProductsList'));
const ProductForm = React.lazy(() => import('./pages/admin/ProductForm'));
const CheckoutPage = React.lazy(() => import('./pages/checkout/CheckoutPage'));
const SuccessPage = React.lazy(() => import('./pages/checkout/SuccessPage'));
const ProductDetailsPage = React.lazy(() => import('./pages/products/ProductDetailsPage'));
const SearchPage = React.lazy(() => import('./pages/products/SearchPage'));
const TermsPage = React.lazy(() => import('./pages/legal/TermsPage'));
const PrivacyPage = React.lazy(() => import('./pages/legal/PrivacyPage'));
const FAQPage = React.lazy(() => import('./pages/support/FAQPage'));
const TestPage = React.lazy(() => import('./pages/TestPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

export default function App() {
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [isFadingOutSplash, setIsFadingOutSplash] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsCartOpen } = useCart();
  const { isAuthenticated } = useAuth();

  useAnalytics();

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let mounted = true;

    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*').order('name');

        if (error) throw error;
        if (!mounted) return;

        if (data && data.length > 0) {
          const mergedProducts: Product[] = data.map((dbProduct) => {
            const localMatch = (PRODUCTS.find(
              (p) => p.name.toLowerCase() === dbProduct.name.toLowerCase()
            ) || PRODUCTS[0]) as unknown as Product;
            return {
              ...dbProduct,
              theme: (localMatch?.theme || PRODUCTS[0].theme) as unknown as Theme,
              volume: localMatch?.volume,
              type: localMatch?.type,
              image: localMatch?.image || dbProduct.image_url,
              image_url: dbProduct.image_url || localMatch?.image || '',
              description: dbProduct.description || localMatch?.description || '',
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
  const activeTheme: Theme = activeProduct?.theme || (PRODUCTS[0].theme as Theme);

  useEffect(() => {
    if (activeTheme) {
      document.body.style.background = activeTheme.bg;
      document.body.style.transition = 'background 1.2s cubic-bezier(0.42, 0, 0.58, 1)';
    }
  }, [activeTheme]);

  useEffect(() => {
    if (loading || location.pathname !== '/') return;

    setShowSplashScreen(true);
    setIsFadingOutSplash(false);

    const timer = setTimeout(() => setIsFadingOutSplash(true), 1800);
    return () => clearTimeout(timer);
  }, [location.pathname, loading]);

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=/checkout');
    }
  };

  if (loading) {
    if (location.pathname === '/') {
      return <SplashScreen onAnimationEnd={() => {}} isFadingOut={false} />;
    }
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        Carregando...
      </div>
    );
  }

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
        <Suspense fallback={<div className="h-screen bg-black" />}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero
                    products={products}
                    activeIndex={activeProductIndex}
                    setActiveIndex={setActiveProductIndex}
                  />
                  <ProductSection products={products} activeTheme={activeTheme} />
                  <AboutSection activeTheme={activeTheme} />
                  <ReviewSection reviews={REVIEWS} activeTheme={activeTheme} />
                  <MapSection activeTheme={activeTheme} />
                </>
              }
            />

            <Route path="/test" element={<TestPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/faq" element={<FAQPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/minha-conta" element={<AccountPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkout/success" element={<SuccessPage />} />
            </Route>

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
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      <Footer activeTheme={activeTheme} />
      <CartModal activeTheme={activeTheme} onCheckout={handleCheckout} />
      <ToastContainer />
    </div>
  );
}
