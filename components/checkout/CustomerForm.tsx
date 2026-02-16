import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { CheckoutFormData } from '@/types/checkout';

interface Props {
    disabled?: boolean;
}

export default function CustomerForm({ disabled }: Props) {
    const { register, formState: { errors } } = useFormContext<CheckoutFormData>();

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');

        // Limita a 11 dígitos
        if (value.length > 11) value = value.slice(0, 11);

        // Aplica máscara: (11) 99999-9999
        if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d)/, '($1) $2');
        }
        if (value.length > 9) {
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        }

        e.target.value = value;
    };

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            onChange: (e) => handlePhoneChange(e)
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