import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { CheckoutFormData } from '@/types/checkout';
import { fetchAddressByCep } from '@/utils/viacep';
import { Loader2 } from 'lucide-react';

interface Props {
    disabled?: boolean;
}

export default function ShippingForm({ disabled }: Props) {
    const { register, setValue, formState: { errors } } = useFormContext<CheckoutFormData>();
    const [isLoadingCep, setIsLoadingCep] = useState(false);

    // Mantém a máscara visual enquanto digita
    const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        let formattedValue = rawValue.replace(/\D/g, '');
        if (formattedValue.length > 5) {
            formattedValue = formattedValue.replace(/^(\d{5})(\d)/, '$1-$2');
        }
        e.target.value = formattedValue;
    };

    // Dispara a busca apenas no onBlur (ao sair do campo)
    const handleZipBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');

        if (cep.length === 8) {
            setIsLoadingCep(true);
            try {
                const data = await fetchAddressByCep(cep);

                // Preenche os campos
                setValue('shipping.street', data.logradouro, { shouldValidate: true });
                setValue('shipping.neighborhood', data.bairro, { shouldValidate: true });
                setValue('shipping.city', data.localidade, { shouldValidate: true });
                setValue('shipping.state', data.uf, { shouldValidate: true });

                // Foca no campo número automaticamente
                document.getElementById('shipping_number')?.focus();

            } catch (error) {
                console.error(error);
                // Aqui você poderia setar um erro no formulário se quisesse
                // setError('shipping.zip', { message: 'CEP não encontrado' });
            } finally {
                setIsLoadingCep(false);
            }
        }
    };

    return (
        <div className="bg-zinc-900 p-6 rounded-xl border border-white/10 space-y-4 mt-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Endereço de Entrega</h2>

            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                    <label className="block text-sm text-gray-400 mb-1">CEP</label>
                    <div className="relative">
                        <input
                            type="text"
                            disabled={disabled || isLoadingCep}
                            {...register('shipping.zip', {
                                onChange: handleZipChange,
                                onBlur: handleZipBlur
                            })}
                            className={`w-full bg-black/50 border rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition-colors disabled:opacity-50 ${errors.shipping?.zip ? 'border-red-500' : 'border-white/10'
                                }`}
                            placeholder="00000-000"
                            maxLength={9}
                        />
                        {isLoadingCep && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
                            </div>
                        )}
                    </div>
                    {errors.shipping?.zip && (
                        <span className="text-xs text-red-500 mt-1">{errors.shipping.zip.message}</span>
                    )}
                </div>
                <div className="col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Cidade</label>
                    <input
                        type="text"
                        readOnly
                        disabled={disabled}
                        {...register('shipping.city')}
                        className={`w-full bg-black/50 border rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition-colors disabled:opacity-50 ${errors.shipping?.city ? 'border-red-500' : 'border-white/10'
                            }`}
                    />
                    {errors.shipping?.city && (
                        <span className="text-xs text-red-500 mt-1">{errors.shipping.city.message}</span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                    <label className="block text-sm text-gray-400 mb-1">Rua</label>
                    <input
                        type="text"
                        readOnly
                        disabled={disabled}
                        {...register('shipping.street')}
                        className={`w-full bg-black/50 border rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition-colors disabled:opacity-50 ${errors.shipping?.street ? 'border-red-500' : 'border-white/10'
                            }`}
                    />
                    {errors.shipping?.street && (
                        <span className="text-xs text-red-500 mt-1">{errors.shipping.street.message}</span>
                    )}
                </div>
                <div className="col-span-1">
                    <label className="block text-sm text-gray-400 mb-1">Número</label>
                    <input
                        id="shipping_number"
                        type="text"
                        disabled={disabled}
                        {...register('shipping.number')}
                        className={`w-full bg-black/50 border rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition-colors disabled:opacity-50 ${errors.shipping?.number ? 'border-red-500' : 'border-white/10'
                            }`}
                    />
                    {errors.shipping?.number && (
                        <span className="text-xs text-red-500 mt-1">{errors.shipping.number.message}</span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Bairro</label>
                    <input
                        type="text"
                        readOnly
                        disabled={disabled}
                        {...register('shipping.neighborhood')}
                        className={`w-full bg-black/50 border rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition-colors disabled:opacity-50 ${errors.shipping?.neighborhood ? 'border-red-500' : 'border-white/10'
                            }`}
                    />
                    {errors.shipping?.neighborhood && (
                        <span className="text-xs text-red-500 mt-1">{errors.shipping.neighborhood.message}</span>
                    )}
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Estado (UF)</label>
                    <input
                        type="text"
                        readOnly
                        disabled={disabled}
                        {...register('shipping.state')}
                        className={`w-full bg-black/50 border rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition-colors disabled:opacity-50 ${errors.shipping?.state ? 'border-red-500' : 'border-white/10'
                            }`}
                        maxLength={2}
                    />
                    {errors.shipping?.state && (
                        <span className="text-xs text-red-500 mt-1">{errors.shipping.state.message}</span>
                    )}
                </div>
            </div>
        </div>
    );
}