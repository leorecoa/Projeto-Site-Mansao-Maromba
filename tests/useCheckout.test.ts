/// <reference types="vitest/globals" />
import { renderHook, act } from '@testing-library/react'
import { vi, type Mock } from 'vitest'

import { useCheckout } from '@/components/checkout/useCheckout'
import { supabase } from '@/services/supabase'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import type { CheckoutFormData } from '@/types/checkout'
import { useNavigate } from 'react-router-dom'

vi.mock('@/services/supabase', () => ({
    supabase: {
        rpc: vi.fn(),
    },
}))

vi.mock('@/hooks/useCart')
vi.mock('@/hooks/useAuth')
vi.mock('react-router-dom')

describe('useCheckout Hook', () => {
    const mockNavigate = vi.fn()
    const mockClearCart = vi.fn()

    const mockFormData: CheckoutFormData = {
        customer: {
            fullName: 'Cliente Teste',
            email: 'teste@exemplo.com',
            phone: '11999999999',
            cpf: '12345678900',
        },
        shipping: {
            street: 'Rua Exemplo',
            number: '100',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zip: '01001-000',
            complement: '',
        },
    }

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(console, 'error').mockImplementation(() => { })

            ; (useNavigate as Mock).mockReturnValue(mockNavigate)

            ; (useCart as Mock).mockReturnValue({
                cart: [],
                clearCart: mockClearCart,
                total: 0,
                loading: false,
            })

            ; (useAuth as Mock).mockReturnValue({
                user: { id: 'user-123' },
            })

        Object.defineProperty(window, 'scrollTo', {
            value: vi.fn(),
            writable: true,
        })
    })

    it('deve retornar o estado inicial corretamente', () => {
        const { result } = renderHook(() => useCheckout())

        expect(result.current.loading).toBe(false)
        expect(result.current.error).toBeNull()
    })

    it('deve definir erro se o carrinho estiver vazio', async () => {
        const { result } = renderHook(() => useCheckout())

        await act(async () => {
            await result.current.processCheckout(mockFormData)
        })

        expect(result.current.error).toBe('Seu carrinho está vazio.')
        expect(supabase.rpc).not.toHaveBeenCalled()
    })

    it('deve processar o checkout com sucesso', async () => {
        (useCart as Mock).mockReturnValue({
            cart: [{ id: 'prod-1', quantity: 2 }],
            clearCart: mockClearCart,
            total: 100,
            loading: false,
        })

            ; (supabase.rpc as Mock).mockResolvedValue({
                data: { success: true, order_id: 'order-123' },
                error: null,
            })

        const { result } = renderHook(() => useCheckout())

        await act(async () => {
            await result.current.processCheckout(mockFormData)
        })

        expect(result.current.error).toBeNull()
        expect(mockClearCart).toHaveBeenCalled()
        expect(mockNavigate).toHaveBeenCalledWith(
            '/checkout/payment/order-123'
        )
    })

    it('deve tratar rpcError retornado pelo Supabase', async () => {
        (useCart as Mock).mockReturnValue({
            cart: [{ id: '1', quantity: 1 }],
            clearCart: mockClearCart,
            total: 50,
            loading: false,
        })

            ; (supabase.rpc as Mock).mockResolvedValue({
                data: null,
                error: new Error('Erro ao criar pedido no banco de dados'),
            })

        const { result } = renderHook(() => useCheckout())

        await act(async () => {
            await result.current.processCheckout(mockFormData)
        })

        expect(result.current.error).toBe(
            'Erro ao criar pedido no banco de dados'
        )

        expect(mockClearCart).not.toHaveBeenCalled()
        expect(mockNavigate).not.toHaveBeenCalled()

        expect(window.scrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: 'smooth',
        })
    })

    it('deve lançar erro quando response.success for falso', async () => {
        (useCart as Mock).mockReturnValue({
            cart: [{ id: '1', quantity: 1 }],
            clearCart: mockClearCart,
            total: 50,
            loading: false,
        })

            ; (supabase.rpc as Mock).mockResolvedValue({
                data: { success: false },
                error: null,
            })

        const { result } = renderHook(() => useCheckout())

        await act(async () => {
            await result.current.processCheckout(mockFormData)
        })

        expect(result.current.error).toBe(
            'Erro desconhecido ao criar pedido.'
        )
    })

    it('deve definir erro genérico quando throw não for instância de Error', async () => {
        (useCart as Mock).mockReturnValue({
            cart: [{ id: '1', quantity: 1 }],
            clearCart: mockClearCart,
            total: 50,
            loading: false,
        })


            ; (supabase.rpc as Mock).mockRejectedValue('erro estranho')

        const { result } = renderHook(() => useCheckout())

        await act(async () => {
            await result.current.processCheckout(mockFormData)
        })

        expect(result.current.error).toBe(
            'Ocorreu um erro desconhecido ao processar seu pedido.'
        )

        expect(window.scrollTo).toHaveBeenCalled()
    })

    it('envia p_user_id como null quando não houver usuário', async () => {
        vi.mocked(useCart).mockReturnValue({
            cart: [{ id: '1', quantity: 1, name: 'Produto Teste', price: 50, image_url: 'test.jpg' }],
            clearCart: mockClearCart,
            total: 50,
            loading: false,
            isCartOpen: false,
            isHydrated: true,
            cartCount: 1,
            addToCart: vi.fn(),
            removeFromCart: vi.fn(),
            updateQuantity: vi.fn(),
            setIsCartOpen: vi.fn(),
        })

        vi.mocked(useAuth).mockReturnValue({
            user: null,
        } as unknown as ReturnType<typeof useAuth>)

        vi.mocked(supabase.rpc).mockResolvedValue({
            data: { success: true, order_id: 'order-999' },
            error: null,
            count: null,
            status: 200,
            statusText: 'OK',
        })

        const { result } = renderHook(() => useCheckout())

        await act(async () => {
            await result.current.processCheckout(mockFormData)
        })

        expect(supabase.rpc).toHaveBeenCalledWith(
            'create_order',
            expect.objectContaining({
                p_user_id: null,
            })
        )
    })
})