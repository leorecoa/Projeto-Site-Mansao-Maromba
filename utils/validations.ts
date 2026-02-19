export const validateCPF = (value: string): boolean => {
    if (!value) return false;
    const clean = value.replace(/[^\d]/g, '');

    // Verifica tamanho (11) e dígitos repetidos (ex: 111.111.111-11)
    if (clean.length !== 11 || /^(\d)\1{10}$/.test(clean)) return false;

    // Validação dos dois dígitos verificadores em um loop compacto
    for (let t = 9; t < 11; t++) {
        let d = 0;
        for (let c = 0; c < t; c++) {
            d += parseInt(clean[c]) * ((t + 1) - c);
        }
        d = ((10 * d) % 11) % 10;
        if (parseInt(clean[t]) !== d) return false;
    }
    return true;
};

export const validateCNPJ = (value: string): boolean => {
    if (!value) return false;
    const clean = value.replace(/[^\d]/g, '');

    // Valida tamanho (14) e dígitos repetidos
    if (clean.length !== 14 || /^(\d)\1{13}$/.test(clean)) return false;

    // Validação dos dois dígitos verificadores
    let size = clean.length - 2;
    let numbers = clean.substring(0, size);
    const digits = clean.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(0))) return false;

    size = size + 1;
    numbers = clean.substring(0, size);
    sum = 0;
    pos = size - 7;
    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;

    return result === parseInt(digits.charAt(1));
};

export const validateDocument = (value: string): boolean => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length === 11) return validateCPF(cleanValue);
    if (cleanValue.length === 14) return validateCNPJ(cleanValue);
    return false;
};