import { z } from 'zod';

// Validação de Checkout
export const checkoutSchema = z.object({
  customer_name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),

  customer_email: z.string().email('Email inválido').toLowerCase(),

  customer_phone: z.string().regex(/^\d{10,11}$/, 'Telefone deve ter 10 ou 11 dígitos'),

  customer_address: z.string().min(10, 'Endereço muito curto').max(200, 'Endereço muito longo'),

  city: z.string().min(2, 'Cidade inválida').max(100),

  state: z.string().length(2, 'Estado deve ter 2 letras (ex: SP)').toUpperCase(),

  zip: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido (ex: 12345-678)'),

  payment_method: z.enum(['pix', 'card']),

  notes: z.string().max(500, 'Observações muito longas').optional(),

  total_amount: z.number().positive('Valor deve ser positivo').max(100000, 'Valor muito alto'),

  items: z
    .array(
      z.object({
        product_id: z.string().uuid('ID de produto inválido'),
        product_name: z.string().min(1),
        product_image: z.string().url('URL de imagem inválida'),
        quantity: z.number().int().positive().max(100, 'Quantidade máxima: 100'),
        unit_price: z.number().positive(),
        subtotal: z.number().positive(),
      })
    )
    .min(1, 'Carrinho vazio')
    .max(50, 'Máximo 50 itens por pedido'),
});

// Validação de Produto (Admin)
export const productSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100, 'Nome muito longo'),

  price: z.number().positive('Preço deve ser positivo').max(10000, 'Preço muito alto'),

  volume: z.string().regex(/^\d+(\.\d+)?(ml|L|l)$/, 'Volume inválido (ex: 1L, 500ml)'),

  image_url: z.string().url('URL inválida').or(z.string().length(0)), // Permite vazio

  description: z.string().min(10, 'Descrição muito curta').max(500, 'Descrição muito longa'),

  type: z.string().min(3).max(100).default('combo'),
});

// Tipos TypeScript derivados dos schemas
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
