import { checkoutSchema, productSchema } from '../lib/validations';

describe('Checkout Validation', () => {
  it('validates correct checkout data', () => {
    const validData = {
      customer_name: 'João Silva',
      customer_email: 'joao@example.com',
      customer_phone: '11987654321',
      customer_address: 'Rua Teste, 123',
      city: 'São Paulo',
      state: 'SP',
      zip: '12345-678',
      payment_method: 'pix' as const,
      total_amount: 100.0,
      items: [
        {
          product_id: '123e4567-e89b-12d3-a456-426614174000',
          product_name: 'Test Product',
          product_image: 'https://example.com/image.png',
          quantity: 1,
          unit_price: 100.0,
          subtotal: 100.0,
        },
      ],
    };

    const result = checkoutSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const invalidData = {
      customer_name: 'João Silva',
      customer_email: 'invalid-email',
      customer_phone: '11987654321',
      customer_address: 'Rua Teste, 123',
      city: 'São Paulo',
      state: 'SP',
      zip: '12345-678',
      payment_method: 'pix' as const,
      total_amount: 100.0,
      items: [
        {
          product_id: '123e4567-e89b-12d3-a456-426614174000',
          product_name: 'Test',
          product_image: 'https://example.com/image.png',
          quantity: 1,
          unit_price: 100.0,
          subtotal: 100.0,
        },
      ],
    };

    const result = checkoutSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('rejects empty cart', () => {
    const invalidData = {
      customer_name: 'João Silva',
      customer_email: 'joao@example.com',
      customer_phone: '11987654321',
      customer_address: 'Rua Teste, 123',
      city: 'São Paulo',
      state: 'SP',
      zip: '12345-678',
      payment_method: 'pix' as const,
      total_amount: 0,
      items: [],
    };

    const result = checkoutSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('Product Validation', () => {
  it('validates correct product data', () => {
    const validData = {
      name: 'Test Product',
      price: 99.9,
      volume: '1L',
      image_url: 'https://example.com/image.png',
      description: 'Test description for product',
      type: 'combo',
    };

    const result = productSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects invalid price', () => {
    const invalidData = {
      name: 'Test Product',
      price: -10,
      volume: '1L',
      image_url: 'https://example.com/image.png',
      description: 'Test description',
      type: 'combo',
    };

    const result = productSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('rejects short description', () => {
    const invalidData = {
      name: 'Test Product',
      price: 99.9,
      volume: '1L',
      image_url: 'https://example.com/image.png',
      description: 'Short',
      type: 'combo',
    };

    const result = productSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
