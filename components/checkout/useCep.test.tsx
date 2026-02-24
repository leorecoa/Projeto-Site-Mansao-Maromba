import { renderHook, act } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCep } from './useCep';
import * as viaCepApi from '../../utils/viacep';
import React from 'react';

// Mocka o módulo da API para controlar seu retorno
vi.mock('@/utils/viacep');

// Dados simulados para os testes
const mockSuccessAddress = {
  logradouro: 'Rua Teste',
  bairro: 'Bairro Teste',
  localidade: 'Cidade Teste',
  uf: 'TS',
  erro: false,
};

const mockNotFoundAddress = {
  erro: true,
};

describe('useCep Hook', () => {
  // Funções "espiãs" para verificar se foram chamadas
  const mockSetValue = vi.fn();
  const mockSetError = vi.fn();
  const mockClearErrors = vi.fn();

  // Wrapper que fornece o contexto do react-hook-form, essencial para o hook funcionar
  // Renomeado para Wrapper (PascalCase) para satisfazer regras de hooks do React
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm();
    // Sobrescrevemos as funções do formulário com nossos espiões
    methods.setValue = mockSetValue;
    methods.setError = mockSetError;
    methods.clearErrors = mockClearErrors;
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  beforeEach(() => {
    // Limpa o histórico de chamadas dos espiões antes de cada teste
    vi.clearAllMocks();
  });

  it('deve chamar setError quando a API retorna "CEP nao encontrado"', async () => {
    // Configura o mock para simular um CEP nao encontrado
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(viaCepApi.fetchAddressByCep).mockResolvedValue(mockNotFoundAddress as any);

    const { result } = renderHook(() => useCep(), { wrapper: Wrapper });

    const event = { target: { value: '00000-000' } } as React.FocusEvent<HTMLInputElement>;

    // `act` garante que todas as atualizações de estado relacionadas à chamada async sejam processadas
    await act(async () => {
      await result.current.handleZipBlur(event);
    });

    // Verifica se o erro anterior foi limpo
    expect(mockClearErrors).toHaveBeenCalledWith('shipping.zip');
    // Verifica se a API foi chamada com o CEP limpo
    expect(viaCepApi.fetchAddressByCep).toHaveBeenCalledWith('00000000');
    // A asserção principal: verifica se setError foi chamado com a mensagem correta
    expect(mockSetError).toHaveBeenCalledWith('shipping.zip', {
      type: 'manual',
      message: 'CEP nao encontrado',
    });

    // Verifica se os campos de endereço foram limpos
    expect(mockSetValue).toHaveBeenCalledWith('shipping.street', '');
    expect(mockSetValue).toHaveBeenCalledWith('shipping.neighborhood', '');
  });

  it('deve chamar setError em caso de falha na requisição da API', async () => {
    // Configura o mock para simular um erro de rede
    const apiError = new Error('Network Error');
    vi.mocked(viaCepApi.fetchAddressByCep).mockRejectedValue(apiError);

    const { result } = renderHook(() => useCep(), { wrapper: Wrapper });

    const event = { target: { value: '12345-678' } } as React.FocusEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleZipBlur(event);
    });

    expect(mockClearErrors).toHaveBeenCalledWith('shipping.zip');
    // A asserção principal: verifica se setError foi chamado com a mensagem de erro genérica
    expect(mockSetError).toHaveBeenCalledWith('shipping.zip', {
      type: 'manual',
      message: 'Erro ao buscar CEP',
    });
  });

  it('deve preencher os campos de endereço em caso de sucesso', async () => {
    // Configura o mock para simular uma resposta de sucesso
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(viaCepApi.fetchAddressByCep).mockResolvedValue(mockSuccessAddress as any);
    // Simula o document.getElementById para o teste de foco
    const focusSpy = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(document, 'getElementById').mockReturnValue({ focus: focusSpy } as any);

    const { result } = renderHook(() => useCep(), { wrapper: Wrapper });

    const event = { target: { value: '12345-678' } } as React.FocusEvent<HTMLInputElement>;

    await act(async () => {
      await result.current.handleZipBlur(event);
    });

    expect(mockSetError).not.toHaveBeenCalled();
    expect(mockSetValue).toHaveBeenCalledWith('shipping.street', 'Rua Teste', {
      shouldValidate: true,
    });
    expect(focusSpy).toHaveBeenCalled(); // Verifica se o foco foi movido para o campo 'número'
  });
});
