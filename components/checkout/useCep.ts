import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { fetchAddressByCep } from '@/utils/viacep';
import type { CheckoutFormData } from '@/types/checkout';
import { logError } from '@/utils/logger';

export function useCep() {
    const { setValue, setError, clearErrors } = useFormContext<CheckoutFormData>();
    const [isLoadingCep, setIsLoadingCep] = useState(false);

    const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        let formattedValue = rawValue.replace(/\D/g, '');
        if (formattedValue.length > 5) {
            formattedValue = formattedValue.replace(/^(\d{5})(\d)/, '$1-$2');
        }
        e.target.value = formattedValue;
    };

    const handleZipBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');

        if (cep.length === 8) {
            setIsLoadingCep(true);
            clearErrors('shipping.zip');

            try {
                const data = await fetchAddressByCep(cep);

                if (data.erro) {
                    setError('shipping.zip', { type: 'manual', message: 'CEP nao encontrado' });
                    setValue('shipping.street', '');
                    setValue('shipping.neighborhood', '');
                    setValue('shipping.city', '');
                    setValue('shipping.state', '');
                } else {
                    setValue('shipping.street', data.logradouro, { shouldValidate: true });
                    setValue('shipping.neighborhood', data.bairro, { shouldValidate: true });
                    setValue('shipping.city', data.localidade, { shouldValidate: true });
                    setValue('shipping.state', data.uf, { shouldValidate: true });
                    document.getElementById('shipping-number')?.focus();
                }
            } catch (error) {
                logError('useCep.handleZipBlur', error);
                setError('shipping.zip', { type: 'manual', message: 'Erro ao buscar CEP' });
            } finally {
                setIsLoadingCep(false);
            }
        }
    };

    return {
        isLoadingCep,
        handleZipChange,
        handleZipBlur
    };
}
