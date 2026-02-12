-- ============================================
-- SOLUÇÃO DEFINITIVA DE CHECKOUT & SEGURANÇA
-- Executar este script completo para corrigir DB
-- ============================================

-- 0. Garantir Schema da Tabela Orders e Products
-- ============================================

-- Adicionar colunas obrigatórias que faltavam
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_city TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_zipcode TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address_snapshot JSONB;

-- Adicionar trava de segurança no estoque (IMPEDE venda sem estoque no nível do banco)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_stock_quantity_check') THEN 
        ALTER TABLE products ADD CONSTRAINT products_stock_quantity_check CHECK (stock_quantity >= 0); 
    END IF; 
END $$;

-- 1. Corrigir função is_admin
-- ============================================

CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM user_profiles
  WHERE id = user_id;
  
  RETURN user_role = 'admin';
END;
$$;

-- 2. Corrigir função create_user_profile
-- ============================================

CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'customer')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 3. Remover acesso API às views materializadas
-- ============================================

-- Revogar SELECT de anon e authenticated
REVOKE SELECT ON product_stats FROM anon;
REVOKE SELECT ON product_stats FROM authenticated;

REVOKE SELECT ON daily_order_stats FROM anon;
REVOKE SELECT ON daily_order_stats FROM authenticated;

REVOKE SELECT ON top_customers FROM anon;
REVOKE SELECT ON top_customers FROM authenticated;

-- Views agora só acessíveis via função get_admin_stats()

-- 4. Função Transacional create_order (Corrigida e Segura)
-- ============================================

CREATE OR REPLACE FUNCTION create_order(payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_order_id UUID;
  item JSONB;
BEGIN
  -- 1. Inserir o Pedido (Com todos os campos novos)
  INSERT INTO orders (
    user_id,
    customer_name,
    customer_email,
    customer_phone,
    customer_address,
    customer_city,
    customer_zipcode,
    payment_method,
    notes,
    total_amount,
    status,
    shipping_address_snapshot
  ) VALUES (
    (payload->>'user_id')::UUID,
    payload->>'customer_name',
    payload->>'customer_email',
    payload->>'customer_phone',
    payload->>'customer_address',
    payload->>'customer_city',
    payload->>'customer_zipcode',
    payload->>'payment_method',
    payload->>'notes',
    (payload->>'total_amount')::NUMERIC,
    'pending',
    payload->'shipping_address_snapshot'
  ) RETURNING id INTO new_order_id;

  -- 2. Inserir Itens e Atualizar Estoque
  FOR item IN SELECT * FROM jsonb_array_elements(payload->'items')
  LOOP
    -- Inserir Item
    INSERT INTO order_items (
      order_id,
      product_id,
      quantity,
      unit_price,
      subtotal
    ) VALUES (
      new_order_id,
      (item->>'product_id')::UUID,
      (item->>'quantity')::INTEGER,
      (item->>'unit_price')::NUMERIC,
      (item->>'subtotal')::NUMERIC
    );

    -- Baixar Estoque (A constraint products_stock_quantity_check vai bloquear se for < 0)
    UPDATE products
    SET stock_quantity = stock_quantity - (item->>'quantity')::INTEGER
    WHERE id = (item->>'product_id')::UUID;
  END LOOP;

  RETURN jsonb_build_object('id', new_order_id);
END;
$$;

-- ============================================
-- VERIFICAR CORREÇÕES
-- ============================================

-- Verificar funções corrigidas:
-- SELECT routine_name, routine_type 
-- FROM information_schema.routines 
-- WHERE routine_schema = 'public' 
-- AND routine_name IN ('is_admin', 'create_user_profile', 'get_admin_stats', 'refresh_materialized_views', 'trigger_refresh_stats', 'create_order');

-- Verificar permissões das views:
-- SELECT tablename, tableowner 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('product_stats', 'daily_order_stats', 'top_customers');
