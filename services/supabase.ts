
// Implementação futura: export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export const productsService = {
  getProducts: async () => {
    console.log('Fetching from Supabase products table...');
    return [];
  }
};

export const ordersService = {
  createOrder: async (orderData: any) => {
    console.log('Sending order to Supabase orders table...', orderData);
    return { success: true };
  }
};
