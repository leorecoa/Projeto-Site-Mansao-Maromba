import { describe, it, expect } from 'vitest';
import { validateCPF } from './CustomerForm';

describe('validateCPF', () => {
    it('deve aceitar um CPF válido sem formatação', () => {
        // CPF gerado válido para teste
        const result = validateCPF('52998224725');
        expect(result).toBe(true);
    });

    it('deve aceitar um CPF válido com formatação (pontos e traço)', () => {
        const result = validateCPF('529.982.247-25');
        expect(result).toBe(true);
    });

    it('deve rejeitar CPF com dígitos repetidos conhecidos', () => {
        const repeatedCpfs = [
            '00000000000',
            '11111111111',
            '99999999999'
        ];

        repeatedCpfs.forEach(cpf => {
            expect(validateCPF(cpf)).toBe('CPF inválido');
        });
    });

    it('deve rejeitar CPF com tamanho incorreto', () => {
        expect(validateCPF('123456789')).toBe('CPF inválido');
        expect(validateCPF('1234567890123')).toBe('CPF inválido');
    });

    it('deve rejeitar CPF com dígitos verificadores inválidos', () => {
        expect(validateCPF('12345678900')).toBe('CPF inválido');
        expect(validateCPF('52998224700')).toBe('CPF inválido');
    });
});