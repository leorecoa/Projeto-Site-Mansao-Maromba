import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCheckout } from '@/components/checkout/useCheckout';
import { supabase } from '@/services/supabase';
import { useCartStore } from '@/store/useCart';

// Mocks
const navigateMock = vi.fn();

// Mock do React Router
vi.mock('react-router-dom', () => ({
    useNavigate: () => navigateMock,
}));

// Mock do Auth
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({ user: { id: '123' } }),
}));

// Mock do Zustand
vi.mock('@/store/useCart', () => ({
    useCartStore: vi.fn()
}));

// Mock do Supabase
vi.mock('@/services/supabase', () => ({
    supabase: {
        rpc: vi.fn(),
    },
}));

describe('useCheckout', () => {
    const clearCartMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useCartStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => selector({
            cart: [], // Carrinho Vazio por padrão
            clearCart: clearCartMock,
            isHydrated: true
        }));
    });

    it('deve definir erro e abortar se o carrinho estiver vazio', async () => {
        const { result } = renderHook(() => useCheckout());

        // Dados fictícios para o formulário
        const dummyFormData = {
            customer: { fullName: 'Test', email: 'test@test.com', phone: '123', cpf: '123' },
            shipping: { zip: '123', street: 'Test', number: '1', neighborhood: 'Test', city: 'Test', state: 'TS' }
        };

        // Executa a função
        await act(async () => {
            await result.current.processCheckout(dummyFormData);
        });

        // Verificações
        // 1. Deve definir o estado de erro
        expect(result.current.error).toBe('Seu carrinho está vazio.');

        // 2. Não deve chamar o Supabase (abortou antes)
        expect(supabase.rpc).not.toHaveBeenCalled();

        // 3. Não deve navegar
        expect(navigateMock).not.toHaveBeenCalled();
    });

    it('deve criar o pedido com sucesso quando o carrinho tem itens (Happy Path)', async () => {
        // Setup: Carrinho com itens
        (useCartStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => selector({
            cart: [{ id: '1', name: 'Produto Teste', price: 100, quantity: 1 }],
            clearCart: clearCartMock,
            isHydrated: true
        }));

        // Setup: Supabase retorna sucesso
        (supabase.rpc as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            data: { success: true, order_id: 'order-123' },
            error: null
        });

        const { result } = renderHook(() => useCheckout());

        const dummyFormData = {
            customer: { fullName: 'Test', email: 'test@test.com', phone: '123', cpf: '123' },
            shipping: { zip: '123', street: 'Test', number: '1', neighborhood: 'Test', city: 'Test', state: 'TS' }
        };

        await act(async () => {
            await result.current.processCheckout(dummyFormData);
        });

        expect(result.current.error).toBeNull();
        expect(supabase.rpc).toHaveBeenCalledWith('create_order', expect.any(Object));
        expect(clearCartMock).toHaveBeenCalled();
        expect(navigateMock).toHaveBeenCalledWith('/checkout/success', { state: { orderId: 'order-123' } });
    });

    it('deve lidar com erro ao criar pedido no Supabase', async () => {
        // Setup: Carrinho com itens
        (useCartStore as unknown as ReturnType<typeof vi.fn>).mockImplementation((selector) => selector({
            cart: [{ id: '1', name: 'Produto Teste', price: 100, quantity: 1 }],
            clearCart: clearCartMock,
            isHydrated: true
        }));

        // Setup: Supabase retorna erro
        (supabase.rpc as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            data: null,
            error: { message: 'Erro simulado do banco de dados' }
        });

        const { result } = renderHook(() => useCheckout());

        const dummyFormData = {
            customer: { fullName: 'Test', email: 'test@test.com', phone: '123', cpf: '123' },
            shipping: { zip: '123', street: 'Test', number: '1', neighborhood: 'Test', city: 'Test', state: 'TS' }
        };

        await act(async () => {
            await result.current.processCheckout(dummyFormData);
        });

        expect(result.current.error).toBe('Erro simulado do banco de dados');
        expect(clearCartMock).not.toHaveBeenCalled();
        expect(navigateMock).not.toHaveBeenCalled();
    });
});
