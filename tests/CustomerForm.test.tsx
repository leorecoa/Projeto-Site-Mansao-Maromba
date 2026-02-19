import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { CustomerForm, formatPhone } from '@/components/checkout/CustomerForm'
import { validateCPF } from '@/utils/validations'
import { useForm, FormProvider } from 'react-hook-form'
import React from 'react'

// Wrapper para fornecer o contexto do formulário (necessário pois o componente usa useFormContext)
const TestWrapper = ({ children, defaultValues = {} }: { children: React.ReactNode, defaultValues?: Record<string, unknown> }) => {
    const methods = useForm({
        defaultValues: {
            customer: {
                fullName: '',
                email: '',
                phone: '',
                cpf: '',
                ...defaultValues
            }
        },
        mode: 'onChange'
    })
    return <FormProvider {...methods}>{children}</FormProvider>
}

describe('CustomerForm Component', () => {
    it('deve renderizar todos os campos corretamente', () => {
        render(
            <TestWrapper>
                <CustomerForm />
            </TestWrapper>
        )

        expect(screen.getByText('Dados Pessoais')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Ex: João da Silva')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('CPF ou CNPJ')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('(11) 99999-9999')).toBeInTheDocument()
    })

    it('deve aplicar a máscara de CPF ao digitar', async () => {
        const user = userEvent.setup()
        render(
            <TestWrapper>
                <CustomerForm />
            </TestWrapper>
        )

        const input = screen.getByPlaceholderText('CPF ou CNPJ') as HTMLInputElement

        await user.type(input, '12345678900')
        expect(input.value).toBe('123.456.789-00')
    })

    it('deve aplicar a máscara de Telefone ao digitar', async () => {
        const user = userEvent.setup()
        render(
            <TestWrapper>
                <CustomerForm />
            </TestWrapper>
        )

        const input = screen.getByPlaceholderText('(11) 99999-9999') as HTMLInputElement

        // Simula digitação de celular
        await user.type(input, '11999998888')
        expect(input.value).toBe('(11) 99999-8888')

        // Limpa e testa fixo (simulando comportamento do usuário)
        await user.clear(input)
        await user.type(input, '1122223333')
        expect(input.value).toBe('(11) 2222-3333')
    })

    it('deve respeitar a prop disabled', () => {
        render(
            <TestWrapper>
                <CustomerForm disabled={true} />
            </TestWrapper>
        )

        expect(screen.getByPlaceholderText('Ex: João da Silva')).toBeDisabled()
        expect(screen.getByPlaceholderText('CPF ou CNPJ')).toBeDisabled()
    })
})

describe('Unit Tests: Validações e Formatações', () => {
    // 1. validateCPF - Cobertura de Branches Matemáticos
    it('deve retornar true para CPFs válidos', () => {
        expect(validateCPF('52998224725')).toBe(true)
        expect(validateCPF('12345678909')).toBe(true)
        // Caso de borda: resto 10/11 virando 0 no primeiro dígito
        expect(validateCPF('00000000604')).toBe(true)
    })

    it('deve retornar mensagem de erro para CPFs inválidos', () => {
        expect(validateCPF('11111111111')).toBe(false) // Branch: Dígitos iguais
        expect(validateCPF('12345678900')).toBe(false) // Branch: 1º Dígito verificador errado
        expect(validateCPF('52998224720')).toBe(false) // Branch: 2º Dígito verificador errado
        expect(validateCPF('123')).toBe(false)         // Branch: Tamanho incorreto
    })

    // 2. formatPhone - Cobertura de Branches de Máscara
    it('deve formatar telefone cobrindo todos os casos de borda', () => {
        // Casos básicos e de limpeza
        expect(formatPhone('')).toBe('');
        expect(formatPhone('abc-()')).toBe('');
        expect(formatPhone('1')).toBe('1');
        expect(formatPhone('11')).toBe('11');

        // Formatação parcial (apenas DDD)
        expect(formatPhone('119')).toBe('(11) 9');
        expect(formatPhone('1198765')).toBe('(11) 98765');

        // Formatação completa para telefone fixo (10 dígitos)
        expect(formatPhone('1122223333')).toBe('(11) 2222-3333');

        // Formatação completa para celular (11 dígitos)
        expect(formatPhone('11988887777')).toBe('(11) 98888-7777');

        // Caso de borda: excesso de dígitos (deve cortar)
        expect(formatPhone('11988887777123')).toBe('(11) 98888-7777');

        // Caso de borda: com caracteres especiais no meio
        expect(formatPhone('(11) 9 8888-7777')).toBe('(11) 98888-7777');
        expect(formatPhone('11-2222-3333')).toBe('(11) 2222-3333');
    })
})
