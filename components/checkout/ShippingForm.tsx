import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { CheckoutFormData } from '@/types/checkout';
import { Loader2 } from 'lucide-react';
import { useCep } from './useCep';

interface Props {
    disabled?: boolean;
}

export default function ShippingForm({ disabled }: Props) {
    const { register, formState: { errors } } = useFormContext<CheckoutFormData>();
    const { isLoadingCep, handleZipChange, handleZipBlur } = useCep();

    return (
        <div className="bg-zinc-900 p-6 rounded-xl border border-white/10 space-y-4 mt-6">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Endereço de Entrega</h2>

            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                    <label htmlFor="shipping-zip" className="block text-sm text-gray-400 mb-1">CEP</label>
                    <div className="relative">
                        <input
                            id="shipping-zip"
                            type="text"
                            disabled={disabled || isLoadingCep}
                            autoComplete="postal-code"
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
                    <label htmlFor="shipping-city" className="block text-sm text-gray-400 mb-1">Cidade</label>
                    <input
                        id="shipping-city"
                        type="text"
                        readOnly
                        disabled={disabled}
                        autoComplete="address-level2"
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
                    <label htmlFor="shipping-street" className="block text-sm text-gray-400 mb-1">Rua</label>
                    <input
                        id="shipping-street"
                        type="text"
                        readOnly
                        disabled={disabled}
                        autoComplete="address-line1"
                        {...register('shipping.street')}
                        className={`w-full bg-black/50 border rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition-colors disabled:opacity-50 ${errors.shipping?.street ? 'border-red-500' : 'border-white/10'
                            }`}
                    />
                    {errors.shipping?.street && (
                        <span className="text-xs text-red-500 mt-1">{errors.shipping.street.message}</span>
                    )}
                </div>
                <div className="col-span-1">
                    <label htmlFor="shipping-number" className="block text-sm text-gray-400 mb-1">Número</label>
                    <input
                        id="shipping-number"
                        type="text"
                        disabled={disabled}
                        autoComplete="address-line2"
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
                    <label htmlFor="shipping-neighborhood" className="block text-sm text-gray-400 mb-1">Bairro</label>
                    <input
                        id="shipping-neighborhood"
                        type="text"
                        readOnly
                        disabled={disabled}
                        autoComplete="address-level3"
                        {...register('shipping.neighborhood')}
                        className={`w-full bg-black/50 border rounded-lg p-3 text-white focus:border-yellow-400 outline-none transition-colors disabled:opacity-50 ${errors.shipping?.neighborhood ? 'border-red-500' : 'border-white/10'
                            }`}
                    />
                    {errors.shipping?.neighborhood && (
                        <span className="text-xs text-red-500 mt-1">{errors.shipping.neighborhood.message}</span>
                    )}
                </div>
                <div>
                    <label htmlFor="shipping-state" className="block text-sm text-gray-400 mb-1">Estado (UF)</label>
                    <input
                        id="shipping-state"
                        type="text"
                        readOnly
                        disabled={disabled}
                        autoComplete="address-level1"
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
