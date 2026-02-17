import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { PRODUCTS, REVIEWS } from './data/products';
import { useCart } from './store/useCart';
import type { Product, Theme } from '@/types';
import { useAuth } from './hooks/useAuth';
import { supabase } from './services/supabase';

export default function App() {
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [isFadingOutSplash, setIsFadingOutSplash] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setIsCartOpen } = useCart();
  const { isAuthenticated } = useAuth();

  // Analytics
  useAnalytics();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name');

        if (error) throw error;

        if (data && data.length > 0) {
          // Combina dados do banco com temas locais para manter o design
          const mergedProducts: Product[] = data.map(dbProduct => {
            const localMatch = (PRODUCTS.find(p => p.name.toLowerCase() === dbProduct.name.toLowerCase()) || PRODUCTS[0]) as unknown as Product;
            return {
              ...dbProduct,
              // Garante propriedades visuais do localMatch
              theme: (localMatch?.theme || PRODUCTS[0].theme) as unknown as Theme,
              volume: localMatch?.volume,
              type: localMatch?.type,
              image: localMatch?.image || dbProduct.image_url,
              // Garante que image_url sempre exista (fallback para string vazia se tudo falhar)
              image_url: dbProduct.image_url || localMatch?.image || '',
              description: dbProduct.description || localMatch?.description || ''
            };
          });
          setProducts(mergedProducts);
        } else {
          setProducts(PRODUCTS); // Fallback se banco vazio
        }
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        setProducts(PRODUCTS); // Fallback em caso de erro
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
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
      <CartModal activeTheme={activeTheme} onCheckout={handleCheckout} />
    </div>
  );
}