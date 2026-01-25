
import React from 'react';
import { Product, Theme } from '../../types';
import { Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/format';

interface ProductSectionProps {
  products: Product[];
  activeTheme: Theme;
}

const ProductCard: React.FC<{ product: Product; onAdd: (p: Product) => void }> = ({ product, onAdd }) => {
  return (
    <div className="group relative glass-card p-6 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden flex flex-col h-full">
      <div 
        className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity"
        style={{ backgroundColor: product.theme.primary }}
      />

      <div className="relative mb-6 flex justify-center h-64">
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold tracking-tight">{product.name}</h3>
          <span className="font-syncopate font-bold text-white/40 text-sm">{product.volume}</span>
        </div>
        
        <p className="text-xs text-gray-400 mb-4 line-clamp-2 uppercase tracking-wide">
          {product.type}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">{formatCurrency(product.price)}</span>
          <button 
            onClick={() => onAdd(product)}
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 active:scale-95 shadow-lg"
            style={{ backgroundColor: product.theme.primary, color: '#000' }}
          >
            <Plus size={24} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

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
          <p className="max-w-xs text-gray-500 font-medium">
            Combos selecionados para quem não aceita menos que o topo. Qualidade premium, entrega rápida.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
