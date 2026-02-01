import React from 'react';
import { Product, Theme } from '../../types';
import ProductCard from '@/components/Products/ProductCard.tsx';

interface ProductSectionProps {
  products: Product[];
  activeTheme?: Theme | null;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  products,
  activeTheme,
}) => {
  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return (
    <section id="products" className="py-24 px-6 relative">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-16">
          <span
            className="text-xs font-bold uppercase tracking-[0.3em]"
            style={{ color: sectionTheme.primary }}
          >
            Catálogo Premium
          </span>

          <h2 className="text-4xl md:text-6xl font-syncopate font-bold mt-2">
            OS BRABOS.
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const productTheme: Theme = product.theme ?? DEFAULT_THEME;

            return (
              <ProductCard key={product.id} product={product} />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
