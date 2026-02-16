/// <reference types="vitest/globals" />
import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useCart } from '@/hooks/useCart'
import { useCheckout } from '@/components/checkout/useCheckout'
import { supabase } from '@/services/supabase'
import { useAuth } from '@/hooks/useAuth'
import type { CheckoutFormData } from '@/types/checkout'

// Mock apenas das dependências externas (Supabase, Auth, Router)
// NÃO mockamos o useCart, pois queremos testar a integração real com ele
vi.mock('@/services/supabase', () => ({
    supabase: {
        rpc: vi.fn(),
        auth: {
            getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        }
    },
}))

vi.mock('@/hooks/useAuth', () => ({
    useAuth: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
}))

describe('Fluxo de Integração: Carrinho e Checkout', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        localStorage.clear()

        // Garante que o carrinho comece vazio (resetando o estado persistido)
        const { result } = renderHook(() => useCart())
        act(() => {
            result.current.clearCart()
        })
    })

    it('deve adicionar item ao carrinho e finalizar compra com sucesso', async () => {
        // 1. Setup: Simular usuário logado
        vi.mocked(useAuth).mockReturnValue({
            user: { id: 'user-integration-123', email: 'test@integration.com' },
            isAuthenticated: true,
        } as unknown as ReturnType<typeof useAuth>)

        // 2. Setup: Simular resposta de sucesso do Supabase
        vi.mocked(supabase.rpc).mockResolvedValue({
            data: { success: true, order_id: 'order-123' },
            error: null,
            count: null,
            status: 200,
            statusText: 'OK',
        })

        // 3. Ação: Adicionar produto ao carrinho (usando lógica real)
        const { result: cartResult } = renderHook(() => useCart())

        const product = {
            id: 'prod-1',
            name: 'Whey Protein',
            price: 100.00,
            image_url: 'img.jpg',
            description: 'Teste',
            volume: '1kg',
            type: 'suplemento'
        }

        act(() => {
            cartResult.current.addToCart(product)
        })

        // Validação intermediária: Carrinho tem o item
        expect(cartResult.current.cart).toHaveLength(1)
        expect(cartResult.current.total).toBe(100.00)

        // 4. Ação: Processar Checkout (usando lógica real que lê do carrinho)
        const { result: checkoutResult } = renderHook(() => useCheckout())

        const checkoutData: CheckoutFormData = {
            customer: {
                fullName: 'Integration User',
                email: 'test@integration.com',
                phone: '11999999999',
                cpf: '12345678900',
            },
            shipping: {
                street: 'Rua Teste',
                number: '123',
                neighborhood: 'Centro',
                city: 'São Paulo',
                state: 'SP',
                zip: '01000-000',
                complement: '',
            }
        }

        await act(async () => {
            await checkoutResult.current.processCheckout(checkoutData)
        })

        // 5. Asserções Finais de Integração
        expect(checkoutResult.current.error).toBeNull()

        // Verifica se o Supabase foi chamado (prova que o checkout pegou os dados)
        expect(supabase.rpc).toHaveBeenCalledWith(
            'create_order',
            expect.objectContaining({
                payload: expect.objectContaining({
                    customer_email: 'test@integration.com',
                    total_amount: 100,
                    items: expect.arrayContaining([
                        expect.objectContaining({
                            product_id: 'prod-1',
                            quantity: 1,
                            unit_price: 100
                        })
                    ])
                })
            })
        )

        // Verifica se o carrinho foi limpo automaticamente após o sucesso
        // Isso confirma que useCheckout interagiu corretamente com useCart
        expect(cartResult.current.cart).toHaveLength(0)
        expect(cartResult.current.total).toBe(0)
    })
})
