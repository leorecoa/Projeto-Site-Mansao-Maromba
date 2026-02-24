import { z } from 'zod';

export const checkoutSchema = z.object({
  customer: z.object({
    fullName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(10, 'Telefone inválido (mínimo 10 dígitos)'),
    cpf: z.string().min(11, 'CPF inválido'),
  }),
  shipping: z.object({
    zip: z.string().regex(/^\d{5}-?\d{3}$/, 'Formato de CEP inválido (00000-000)'),
    street: z.string().min(3, 'Rua obrigatória'),
    number: z.string().min(1, 'Número obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, 'Bairro obrigatório'),
    city: z.string().min(2, 'Cidade obrigatória'),
    state: z.string().length(2, 'Estado deve ter 2 letras (UF)'),
  }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type CheckoutCustomerData = CheckoutFormData['customer'];
export type CheckoutShippingData = CheckoutFormData['shipping'];
