import React from 'react'
import ProductCard from './ProductCard'

const ProductGrid = ({ products }) => {
  if (!Array.isArray(products) || products.length === 0) {
    return <p>Nenhum produto encontrado.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid