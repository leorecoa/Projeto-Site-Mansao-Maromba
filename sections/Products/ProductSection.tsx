// c:/Users/Leorecoa/MM/Projeto-Site-Mansao-Maromba/sections/Products/ProductSection.tsx
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product, Theme } from '../../types';
import { useCart } from '@/app/context/CartContext';
import { formatCurrency } from '@/utils/format';

interface ProductSectionProps {
  products: Product[];
  activeTheme: Theme;
}

const ProductSection: React.FC<ProductSectionProps> = ({ products, activeTheme }) => {
  const { addToCart } = useCart();

  return (
    <section id="products" className="py-24 px-6 relative z-10">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-syncopate font-bold mb-4">
            NOSSOS <span style={{ color: activeTheme.primary }}>COMBOS</span>
          </h2>
          <p className="text-gray-400 max-w-2xl">
            A seleção oficial da Mansão Maromba. Energia, sabor e a vibe que você procura.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Imagem */}
              <div className="relative h-64 mb-6 flex items-center justify-center overflow-hidden rounded-2xl bg-black/20">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                <img
                  src={product.image_url || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="h-full object-contain group-hover:scale-110 transition-transform duration-500 relative z-10"
                />
              </div>

              {/* Info */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold font-syncopate leading-tight">{product.name}</h3>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">{product.type} • {product.volume}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: activeTheme.primary }}>
                      {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>

                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-4 rounded-xl font-bold text-black flex items-center justify-center gap-2 transition-transform active:scale-95 hover:brightness-110"
                  style={{ backgroundColor: activeTheme.primary }}
                >
                  <ShoppingCart size={18} />
                  ADICIONAR AO CARRINHO
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
