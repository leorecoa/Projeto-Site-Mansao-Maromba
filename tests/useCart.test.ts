import { renderHook, act } from '@testing-library/react'

import { useCart } from '@/store/useCart'
import type { Product } from '@/types'

// Factory tipado para garantir conformidade com Product
const createProduct = (overrides?: Partial<Product>): Product => ({
    id: '1',
    name: 'Produto Teste',
    price: 100,
    image_url: 'image.jpg',
    ...overrides,
})

// Mock do localStorage isolado
const localStorageMock = (() => {
    let store: Record<string, string> = {}

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString()
        },
        removeItem: (key: string) => {
            delete store[key]
        },
        clear: () => {
            store = {}
        },
    }
})()

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
})

describe('useCart Hook', () => {
    beforeEach(() => {
        window.localStorage.clear()
        vi.clearAllMocks()

        const { result } = renderHook(() => useCart())
        act(() => {
            result.current.clearCart()
        })
    })

    it('deve iniciar com o carrinho vazio', () => {
        const { result } = renderHook(() => useCart())

        expect(result.current.cart).toEqual([])
        expect(result.current.total).toBe(0)
    })

    it('deve adicionar um item ao carrinho', () => {
        const { result } = renderHook(() => useCart())

        const product = createProduct({
            id: '1',
            name: 'Whey Protein',
            price: 100,
        })

        act(() => {
            result.current.addToCart(product)
        })

        expect(result.current.cart).toHaveLength(1)
        expect(result.current.cart[0]).toMatchObject({
            id: '1',
            quantity: 1,
        })
        expect(result.current.total).toBe(100)
    })

    it('deve incrementar a quantidade se o item já existir', () => {
        const { result } = renderHook(() => useCart())

        const product = createProduct({
            id: '1',
            name: 'Creatina',
            price: 50,
        })

        act(() => {
            result.current.addToCart(product)
            result.current.addToCart(product)
        })

        expect(result.current.cart).toHaveLength(1)
        expect(result.current.cart[0].quantity).toBe(2)
        expect(result.current.total).toBe(100)
    })

    it('deve remover um item do carrinho', () => {
        const { result } = renderHook(() => useCart())

        const product = createProduct({
            id: '1',
            name: 'Pré-treino',
            price: 120,
        })

        act(() => {
            result.current.addToCart(product)
        })

        expect(result.current.cart).toHaveLength(1)

        act(() => {
            result.current.removeFromCart('1')
        })

        expect(result.current.cart).toHaveLength(0)
        expect(result.current.total).toBe(0)
    })

    it('deve limpar todo o carrinho', () => {
        const { result } = renderHook(() => useCart())

        act(() => {
            result.current.addToCart(
                createProduct({ id: '1', price: 50 })
            )
            result.current.addToCart(
                createProduct({ id: '2', price: 50 })
            )
        })

        expect(result.current.cart).toHaveLength(2)

        act(() => {
            result.current.clearCart()
        })

        expect(result.current.cart).toHaveLength(0)
        expect(result.current.total).toBe(0)
    })

    it('deve calcular o total corretamente com múltiplos itens', () => {
        const { result } = renderHook(() => useCart())

        act(() => {
            result.current.addToCart(
                createProduct({ id: '1', price: 100 })
            )
            result.current.addToCart(
                createProduct({ id: '1', price: 100 })
            )
            result.current.addToCart(
                createProduct({ id: '2', price: 50 })
            )
        })

        expect(result.current.total).toBe(250)
    })

    it('deve lidar graciosamente ao tentar remover item inexistente', () => {
        const { result } = renderHook(() => useCart())

        act(() => {
            result.current.addToCart(
                createProduct({ id: '1', price: 100 })
            )
        })

        act(() => {
            result.current.removeFromCart('999')
        })

        expect(result.current.cart).toHaveLength(1)
        expect(result.current.total).toBe(100)
    })
})
