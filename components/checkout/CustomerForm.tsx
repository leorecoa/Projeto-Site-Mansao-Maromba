import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { CheckoutFormData } from '@/types/checkout';
import { useDocumentMask } from '@/hooks/useDocumentMask';

interface Props {
    disabled?: boolean;
}

export const formatPhone = (value: string) => {
    const rawValue = value.replace(/\D/g, '');
    let formatted = rawValue;

    // Limita a 11 dígitos
    if (formatted.length > 11) formatted = formatted.slice(0, 11);

    // Lógica baseada no tamanho real dos números
    if (formatted.length > 10) {
        // Celular (11 dígitos): (11) 99999-9999
        formatted = formatted.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (formatted.length === 10) {
        // Fixo (10 dígitos): (11) 2222-3333
        formatted = formatted.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (formatted.length > 2) {
        // Apenas DDD: (11) 9...
        formatted = formatted.replace(/^(\d{2})/, '($1) ');
    }

    return formatted;
};

export function CustomerForm({ disabled }: Props) {
    const { register, formState: { errors } } = useFormContext<CheckoutFormData>();
    const { handleDocumentChange } = useDocumentMask();

    return (
        <div className="bg-zinc-900 p-6 rounded-xl border border-white/10 space-y-4">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Dados Pessoais</h2>

            <div>
                <label className="block text-sm text-gray-400 mb-1">Nome Completo</label>
                <input
                    type="text"
                    disabled={disabled}
                    {...register('customer.fullName')}
                    className={`w-full bg-black/50 border rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition-colors disabled:opacity-50 ${errors.customer?.fullName ? 'border-red-500' : 'border-white/10'
                        }`}
                    placeholder="Ex: João da Silva"
                />
                {errors.customer?.fullName && (
                    <span className="text-xs text-red-500 mt-1">{errors.customer.fullName.message}</span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">CPF / CNPJ</label>
                    <input
                        type="text"
                        disabled={disabled}
                        {...register('customer.cpf', {
                            onChange: handleDocumentChange
                        })}
                        className={`w-full bg-black/50 border rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition-colors disabled:opacity-50 ${errors.customer?.cpf ? 'border-red-500' : 'border-white/10'
                            }`}
                        placeholder="CPF ou CNPJ"
                        maxLength={18}
                    />
                    {errors.customer?.cpf && (
                        <span className="text-xs text-red-500 mt-1">{errors.customer.cpf.message}</span>
                    )}
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <input
                        type="email"
                        disabled={disabled}
                        {...register('customer.email')}
                        className={`w-full bg-black/50 border rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition-colors disabled:opacity-50 ${errors.customer?.email ? 'border-red-500' : 'border-white/10'
                            }`}
                        placeholder="seu@email.com"
                    />
                    {errors.customer?.email && (
                        <span className="text-xs text-red-500 mt-1">{errors.customer.email.message}</span>
                    )}
                </div>
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Telefone / WhatsApp</label>
                    <input
                        type="tel"
                        disabled={disabled}
                        {...register('customer.phone', {
                            onChange: (e) => {
                                e.target.value = formatPhone(e.target.value);
                            }
                        })}
                        className={`w-full bg-black/50 border rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition-colors disabled:opacity-50 ${errors.customer?.phone ? 'border-red-500' : 'border-white/10'
                            }`}
                        placeholder="(11) 99999-9999"
                    />
                    {errors.customer?.phone && (
                        <span className="text-xs text-red-500 mt-1">{errors.customer.phone.message}</span>
                    )}
                </div>
            </div>
        </div>
    );
}