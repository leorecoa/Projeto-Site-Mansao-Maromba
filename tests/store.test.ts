import { describe, it, expect, beforeEach } from 'vitest'
import { useStore } from '../store'

describe('Store', () => {
  beforeEach(() => {
    useStore.setState({ cart: [], user: null })
  })

  it('adiciona produto ao carrinho', () => {
    const product = {
      id: '1',
      name: 'Combo Tigrinho',
      price: 89.90,
      image_url: 'test.png',
      volume: '1L',
      type: 'Combo',
      theme: { primary: '#ff0000', secondary: '#000', glow: 'red', text: '#fff', bg: '#000' }
    }

    useStore.getState().addToCart(product)
    expect(useStore.getState().cart).toHaveLength(1)
    expect(useStore.getState().cartCount).toBe(1)
  })

  it('remove produto do carrinho', () => {
    const product = {
      id: '1',
      name: 'Test',
      price: 10,
      image_url: 'test.png',
      volume: '1L',
      type: 'Combo',
      theme: { primary: '#ff0000', secondary: '#000', glow: 'red', text: '#fff', bg: '#000' }
    }

    useStore.getState().addToCart(product)
    useStore.getState().removeFromCart('1')
    expect(useStore.getState().cart).toHaveLength(0)
  })

  it('calcula total corretamente', () => {
    const product = {
      id: '1',
      name: 'Test',
      price: 50,
      image_url: 'test.png',
      volume: '1L',
      type: 'Combo',
      theme: { primary: '#ff0000', secondary: '#000', glow: 'red', text: '#fff', bg: '#000' }
    }

    useStore.getState().addToCart(product)
    useStore.getState().addToCart(product)
    expect(useStore.getState().cartTotal).toBe(100)
  })
})