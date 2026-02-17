import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { CheckoutFormData } from '@/types/checkout';

interface Props {
    disabled?: boolean;
}

export const validateCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return 'CPF inválido';

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return 'CPF inválido';

    soma = 0;
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return 'CPF inválido';

    return true;
};

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

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">CPF</label>
                    <input
                        type="text"
                        disabled={disabled}
                        {...register('customer.cpf', {
                            required: 'CPF é obrigatório',
                            validate: validateCPF,
                            onChange: handleCpfChange
                        })}
                        className={`w-full bg-black/50 border rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition-colors disabled:opacity-50 ${errors.customer?.cpf ? 'border-red-500' : 'border-white/10'
                            }`}
                        placeholder="000.000.000-00"
                        maxLength={14}
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