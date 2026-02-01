import React from 'react'
import { Plus } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore' // Usar Zustand para o carrinho
import { useThemeStore } from '@/stores/themeStore'
import { formatCurrency } from '../../utils/format'

const DEFAULT_THEME = {
  primary: '#facc15',
  secondary: '#1f2937',
  glow: 'rgba(250,204,21,0.4)',
  text: '#ffffff',
  bg: '#000000',
}

const ProductCard = ({ product }) => {
  const addToCart = useAppStore((state) => state.addToCart)
  const { setTheme } = useThemeStore()

  const productTheme = product.theme ?? DEFAULT_THEME

  const handleAddToCart = () => {
    addToCart(product)
    setTheme(product.theme, product.id)
  }

  return (
    <div
      className="group glass-card p-6 rounded-3xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
      // Opcional: Aplicar estilos diretamente ou via CSS modules para evitar inline repetitivo
      // style={{
      //   borderColor: productTheme.primary,
      //   boxShadow: `0 0 20px ${productTheme.glow}`
      // }}
    >
      {/* Imagem */}
      <div className="relative mb-6 flex justify-center h-64">
        <img
          src={product.image_url || '/placeholder.png'}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src = '/placeholder.png'
          }}
          className="h-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Conteúdo */}
      <div className="mt-auto">
        <h3 className="text-xl font-bold mb-1">
          {product.name}
        </h3>

        {(product.volume || product.type) && (
          <p className="text-xs text-gray-400 mb-4 uppercase tracking-widest">
            {product.volume}
            {product.volume && product.type ? ' · ' : ''}
            {product.type}
          </p>
        )}

        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">
            {formatCurrency(product.price)}
          </span>

          <button
            onClick={handleAddToCart}
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95"
            style={{
              backgroundColor: productTheme.primary,
              color: '#000',
            }}
          >
            <Plus size={24} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard