import { useCartStore } from '../store'

describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.setState({ cart: [], cartTotal: 0, cartCount: 0 })
  })

  it('adds item to cart', () => {
    const store = useCartStore.getState()
    
    store.addToCart({
      id: '1',
      name: 'Test Product',
      price: 99.90,
      volume: '1L',
      image: '/test.png',
      description: 'Test',
      type: 'combo'
    })

    const state = useCartStore.getState()
    expect(state.cart).toHaveLength(1)
    expect(state.cart[0].name).toBe('Test Product')
  })

  it('increases quantity if item exists', () => {
    const store = useCartStore.getState()
    
    const product = {
      id: '1',
      name: 'Test Product',
      price: 50.00,
      volume: '1L',
      image: '/test.png',
      description: 'Test',
      type: 'combo'
    }

    store.addToCart(product)
    store.addToCart(product)

    const state = useCartStore.getState()
    expect(state.cart).toHaveLength(1)
    expect(state.cart[0].quantity).toBe(2)
  })

  it('removes item from cart', () => {
    const store = useCartStore.getState()
    
    store.addToCart({
      id: '1',
      name: 'Test Product',
      price: 99.90,
      volume: '1L',
      image: '/test.png',
      description: 'Test',
      type: 'combo'
    })

    store.removeFromCart('1')
    
    const state = useCartStore.getState()
    expect(state.cart).toHaveLength(0)
  })

  it('calculates total correctly', () => {
    const store = useCartStore.getState()
    
    store.addToCart({
      id: '1',
      name: 'Product 1',
      price: 50.00,
      volume: '1L',
      image: '/test.png',
      description: 'Test',
      type: 'combo'
    })

    store.addToCart({
      id: '1',
      name: 'Product 1',
      price: 50.00,
      volume: '1L',
      image: '/test.png',
      description: 'Test',
      type: 'combo'
    })

    store.addToCart({
      id: '2',
      name: 'Product 2',
      price: 30.00,
      volume: '1L',
      image: '/test.png',
      description: 'Test',
      type: 'combo'
    })

    const state = useCartStore.getState()
    expect(state.cartTotal).toBe(130.00)
  })

  it('clears cart', () => {
    const store = useCartStore.getState()
    
    store.addToCart({
      id: '1',
      name: 'Test Product',
      price: 99.90,
      volume: '1L',
      image: '/test.png',
      description: 'Test',
      type: 'combo'
    })

    store.clearCart()
    
    const state = useCartStore.getState()
    expect(state.cart).toHaveLength(0)
    expect(state.cartTotal).toBe(0)
  })
})
