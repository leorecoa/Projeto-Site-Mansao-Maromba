import { useCallback } from 'react';

export function useDocumentMask() {
  const handleDocumentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    let formattedValue = rawValue;

    // Limita a 14 dígitos (CNPJ)
    if (formattedValue.length > 14) {
      formattedValue = formattedValue.slice(0, 14);
    }

    // Aplica máscara baseada no tamanho
    if (formattedValue.length <= 11) {
      // CPF: 000.000.000-00
      formattedValue = formattedValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // CNPJ: 00.000.000/0000-00
      formattedValue = formattedValue
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }

    e.target.value = formattedValue;
  }, []);

  return { handleDocumentChange };
}
