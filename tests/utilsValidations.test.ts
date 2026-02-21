import { describe, it, expect } from 'vitest';
import { validateCPF, validateCNPJ, validateDocument } from '@/utils/validations';

describe('utils/validations - CPF', () => {
  it('valida CPF valido', () => {
    expect(validateCPF('529.982.247-25')).toBe(true);
    expect(validateCPF('12345678909')).toBe(true);
  });

  it('invalida CPF vazio, curto e repetido', () => {
    expect(validateCPF('')).toBe(false);
    expect(validateCPF('123')).toBe(false);
    expect(validateCPF('11111111111')).toBe(false);
  });

  it('invalida CPF com digito verificador incorreto', () => {
    expect(validateCPF('52998224724')).toBe(false);
  });
});

describe('utils/validations - CNPJ', () => {
  it('valida CNPJ valido', () => {
    expect(validateCNPJ('04.252.011/0001-10')).toBe(true);
    expect(validateCNPJ('04252011000110')).toBe(true);
  });

  it('invalida CNPJ vazio, curto e repetido', () => {
    expect(validateCNPJ('')).toBe(false);
    expect(validateCNPJ('123')).toBe(false);
    expect(validateCNPJ('11111111111111')).toBe(false);
  });

  it('invalida CNPJ com digito verificador incorreto', () => {
    expect(validateCNPJ('04252011000111')).toBe(false);
  });
});

describe('utils/validations - Documento generico', () => {
  it('valida CPF/CNPJ de acordo com tamanho limpo', () => {
    expect(validateDocument('529.982.247-25')).toBe(true);
    expect(validateDocument('04.252.011/0001-10')).toBe(true);
  });

  it('retorna false para documento com tamanho invalido', () => {
    expect(validateDocument('12345')).toBe(false);
  });
});
