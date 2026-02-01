-- Habilita a extensão para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Função para atualizar o timestamp de updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. TABELA DE CATEGORIAS
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA DE PRODUTOS
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  volume TEXT, -- ex: '1L', '500ml'
  type TEXT,   -- ex: 'Cocktail Alcoólico Gaseificado'
  image_url TEXT,
  theme JSONB, -- { "primary": "#ff0000", "secondary": "#4b0000", "glow": "rgba(255,0,0,0.8)", "bg": "..." }
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER update_products_updated_at 
BEFORE UPDATE ON products 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 3. TABELA DE CLIENTES (Profiles)
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address_street TEXT,
  address_number TEXT,
  address_complement TEXT,
  address_neighborhood TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- 4. ADICIONAR COLUNA DE ROLE PARA CONTROLE DE ACESSO
  user_role TEXT DEFAULT 'customer' CHECK (user_role IN ('customer', 'admin', 'staff'))
);

-- 4. TABELA DE PEDIDOS (Orders)
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'paid')),
  payment_method TEXT,
  tracking_code TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- 3. ADICIONAR SUPORTE A PAGAMENTO COM CARTEIRA NA TABELA ORDERS
  used_wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
  final_charge_amount DECIMAL(10, 2) -- Valor cobrado no cartão (se houver)
);

CREATE TRIGGER update_orders_updated_at 
BEFORE UPDATE ON orders 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 5. ITENS DO PEDIDO (Order Items)
CREATE TABLE IF NOT EXISTS order_items (\
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),\
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA DE REVIEWS (Avaliações)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 1. TABELA DA CARTEIRA/DEPÓSITO DIGITAL
CREATE TABLE IF NOT EXISTS user_wallet (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  balance DECIMAL(10, 2) DEFAULT 0.00 CHECK (balance >= 0),
  total_deposited DECIMAL(10, 2) DEFAULT 0.00,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customer_id)
);

-- Trigger para atualizar o `updated_at` da carteira
CREATE TRIGGER update_user_wallet_updated_at 
BEFORE UPDATE ON user_wallet 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 2. HISTÓRICO DE TRANSAÇÕES DA CARTEIRA
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID NOT NULL REFERENCES user_wallet(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('DEPOSIT', 'PURCHASE', 'REFUND', 'ADMIN_ADJUSTMENT')),
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED')),
  stripe_payment_intent_id TEXT, -- Para referência futura com o Stripe
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. (OPCIONAL) INGREDIENTES PARA OS PRODUTOS
CREATE TABLE IF NOT EXISTS product_ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas RLS para user_wallet
ALTER TABLE user_wallet ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet" ON user_wallet
  FOR SELECT USING (auth.uid() = (
    SELECT auth_user_id FROM customers WHERE id = user_wallet.customer_id
  ));

CREATE POLICY "Admins can view all wallets" ON user_wallet
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM customers 
    WHERE auth_user_id = auth.uid() AND user_role = 'admin'
  ));

-- 7. EXEMPLO DE INSERÇÃO DE CATEGORIA INICIAL
INSERT INTO categories (name, slug, description) 
VALUES ('Combos Premium', 'combos-premium', 'Nossa linha de elite para a melhor experiência.')
ON CONFLICT (name) DO NOTHING;
