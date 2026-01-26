
import React from 'react';
import { Product, Theme } from '../../types';
import { Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/format';

interface ProductSectionProps {
  products: Product[];
  activeTheme: Theme;
}

const ProductSection: React.FC<ProductSectionProps> = ({ products, activeTheme }) => {
  const { addToCart } = useCart();

  return (
    <section id="products" className="py-24 px-6 relative">
      <div className="container mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em]" style={{ color: activeTheme.primary }}>Catálogo Premium</span>
            <h2 className="text-4xl md:text-6xl font-syncopate font-bold mt-2">OS BRABOS.</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group glass-card p-6 rounded-3xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
              <div className="relative mb-6 flex justify-center h-64">
                <img src={product.image} alt={product.name} className="h-full object-contain transition-transform group-hover:scale-110" />
              </div>
              <div className="mt-auto">
                <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                <p className="text-xs text-gray-400 mb-4 uppercase tracking-widest">{product.volume} · {product.type}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{formatCurrency(product.price)}</span>
                  <button onClick={() => addToCart(product)} className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: product.theme.primary, color: '#000' }}><Plus size={24} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
