"use client";

import { useState } from 'react';
import { useDynamicTheme } from '../hooks/useDynamicTheme';
import { Product } from '../types';
// ... outros imports

export default function ProductPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Hook que causa o problema em SSR
  useDynamicTheme(selectedProduct);

  // ... resto do seu componente
  return (
    <div>
      {/* ... */}
    </div>
  );
}
