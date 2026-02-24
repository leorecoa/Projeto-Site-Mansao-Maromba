import { renderHook, act } from '@testing-library/react';
import { useToast } from '@/store/useToast';
import { vi } from 'vitest';

describe('useToast Store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast());
    // Limpa toasts anteriores
    act(() => {
      result.current.toasts.forEach((t) => result.current.removeToast(t.id));
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve adicionar um toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast('Teste', 'success');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Teste');
    expect(result.current.toasts[0].type).toBe('success');
  });

  it('deve remover um toast manualmente', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast('Teste');
    });

    const id = result.current.toasts[0].id;

    act(() => {
      result.current.removeToast(id);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('deve remover o toast automaticamente após 3 segundos', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast('Auto remove');
    });

    expect(result.current.toasts).toHaveLength(1);

    // Avança o tempo em 3 segundos
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });
});
