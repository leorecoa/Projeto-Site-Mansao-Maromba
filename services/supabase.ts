
// Implementação futura do cliente Supabase
export const supabase = {
  products: {
    getAll: async () => {
      console.log('Integrar fetch do Supabase aqui');
      return [];
    }
  },
  orders: {
    create: async (order: any) => {
      console.log('Integrar criação de pedido no Supabase aqui', order);
      return { success: true };
    }
  }
};
