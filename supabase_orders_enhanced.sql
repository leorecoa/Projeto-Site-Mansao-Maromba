-- ============================================
-- ENHANCED ORDERS SYSTEM
-- Status Tracking + Order Management
-- ============================================

-- 1. ATUALIZAR TABELA ORDERS COM NOVOS CAMPOS
-- ============================================

-- Adicionar campos de tracking
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tracking_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Adicionar campos de endereço estruturado e snapshot
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_city TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_zipcode TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address_snapshot JSONB;

-- Adicionar constraint para status válidos
ALTER TABLE orders 
DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders 
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'paid'));

-- Garantir colunas em order_items para valores históricos
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS unit_price NUMERIC;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS subtotal NUMERIC;

-- 2. FUNÇÃO PARA ATUALIZAR STATUS DO PEDIDO
-- ============================================

CREATE OR REPLACE FUNCTION update_order_status(
  p_order_id UUID,
  p_new_status VARCHAR(20),
  p_tracking_code VARCHAR(50) DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_status VARCHAR(20);
  v_result json;
BEGIN
  -- Verificar se o pedido existe
  SELECT status INTO v_current_status
  FROM orders
  WHERE id = p_order_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Pedido não encontrado');
  END IF;

  -- Validar transição de status
  IF v_current_status = 'cancelled' THEN
    RETURN json_build_object('success', false, 'error', 'Pedido já foi cancelado');
  END IF;

  IF v_current_status = 'delivered' AND p_new_status != 'cancelled' THEN
    RETURN json_build_object('success', false, 'error', 'Pedido já foi entregue');
  END IF;

  -- Atualizar status
  UPDATE orders
  SET 
    status = p_new_status,
    tracking_code = COALESCE(p_tracking_code, tracking_code),
    notes = COALESCE(p_notes, notes),
    shipped_at = CASE WHEN p_new_status = 'shipped' THEN NOW() ELSE shipped_at END,
    delivered_at = CASE WHEN p_new_status = 'delivered' THEN NOW() ELSE delivered_at END,
    cancelled_at = CASE WHEN p_new_status = 'cancelled' THEN NOW() ELSE cancelled_at END,
    updated_at = NOW()
  WHERE id = p_order_id;

  -- Retornar resultado
  SELECT json_build_object(
    'success', true,
    'order_id', id,
    'status', status,
    'tracking_code', tracking_code,
    'updated_at', updated_at
  ) INTO v_result
  FROM orders
  WHERE id = p_order_id;

  RETURN v_result;
END;
$$;

-- 3. FUNÇÃO PARA CANCELAR PEDIDO
-- ============================================

CREATE OR REPLACE FUNCTION cancel_order(
  p_order_id UUID,
  p_reason TEXT
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_current_status VARCHAR(20);
BEGIN
  -- Verificar se o usuário é dono do pedido
  SELECT user_id, status INTO v_user_id, v_current_status
  FROM orders
  WHERE id = p_order_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Pedido não encontrado');
  END IF;

  -- Verificar se o usuário tem permissão
  IF v_user_id != auth.uid() AND NOT is_admin(auth.uid()) THEN
    RETURN json_build_object('success', false, 'error', 'Sem permissão');
  END IF;

  -- Verificar se pode cancelar
  IF v_current_status IN ('shipped', 'delivered', 'cancelled') THEN
    RETURN json_build_object('success', false, 'error', 'Pedido não pode ser cancelado');
  END IF;

  -- Cancelar pedido
  UPDATE orders
  SET 
    status = 'cancelled',
    cancelled_at = NOW(),
    cancellation_reason = p_reason,
    updated_at = NOW()
  WHERE id = p_order_id;

  RETURN json_build_object('success', true, 'message', 'Pedido cancelado com sucesso');
END;
$$;

-- 4. FUNÇÃO PARA OBTER HISTÓRICO DO PEDIDO
-- ============================================

CREATE OR REPLACE FUNCTION get_order_history(p_order_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result json;
BEGIN
  SELECT json_build_object(
    'order_id', o.id,
    'status', o.status,
    'created_at', o.created_at,
    'confirmed_at', CASE WHEN o.status != 'pending' THEN o.updated_at END,
    'shipped_at', o.shipped_at,
    'delivered_at', o.delivered_at,
    'cancelled_at', o.cancelled_at,
    'tracking_code', o.tracking_code,
    'timeline', json_build_array(
      json_build_object('status', 'pending', 'date', o.created_at, 'completed', true),
      json_build_object('status', 'confirmed', 'date', CASE WHEN o.status IN ('confirmed', 'processing', 'shipped', 'delivered') THEN o.updated_at END, 'completed', o.status IN ('confirmed', 'processing', 'shipped', 'delivered')),
      json_build_object('status', 'processing', 'date', CASE WHEN o.status IN ('processing', 'shipped', 'delivered') THEN o.updated_at END, 'completed', o.status IN ('processing', 'shipped', 'delivered')),
      json_build_object('status', 'shipped', 'date', o.shipped_at, 'completed', o.status IN ('shipped', 'delivered')),
      json_build_object('status', 'delivered', 'date', o.delivered_at, 'completed', o.status = 'delivered')
    )
  ) INTO v_result
  FROM orders o
  WHERE o.id = p_order_id;

  RETURN v_result;
END;
$$;

-- 5. TRIGGER PARA LOG DE MUDANÇAS DE STATUS
-- ============================================

-- Tabela de logs
CREATE TABLE IF NOT EXISTS order_status_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  old_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Índice para buscar logs por pedido
CREATE INDEX IF NOT EXISTS idx_order_status_logs_order_id 
ON order_status_logs(order_id, changed_at DESC);

-- Função de trigger
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_logs (order_id, old_status, new_status, changed_by, notes)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid(), NEW.notes);
  END IF;
  RETURN NEW;
END;
$$;

-- Criar trigger
DROP TRIGGER IF EXISTS order_status_change_log ON orders;
CREATE TRIGGER order_status_change_log
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION log_order_status_change();

-- 6. RLS POLICIES PARA LOGS
-- ============================================

ALTER TABLE order_status_logs ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver logs dos seus pedidos
CREATE POLICY "Users can view their order logs"
ON order_status_logs FOR SELECT
TO authenticated
USING (
  order_id IN (
    SELECT id FROM orders WHERE user_id = auth.uid()
  )
);

-- Admins podem ver todos os logs
CREATE POLICY "Admins can view all order logs"
ON order_status_logs FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- 7. FUNÇÃO PARA ESTATÍSTICAS DE PEDIDOS
-- ============================================

CREATE OR REPLACE FUNCTION get_order_stats(p_user_id UUID DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_result json;
BEGIN
  -- Se não for admin, usar o próprio user_id
  IF NOT is_admin(auth.uid()) THEN
    v_user_id := auth.uid();
  ELSE
    v_user_id := p_user_id;
  END IF;

  SELECT json_build_object(
    'total_orders', COUNT(*),
    'total_spent', COALESCE(SUM(total_amount), 0),
    'avg_order_value', COALESCE(AVG(total_amount), 0),
    'pending_orders', COUNT(*) FILTER (WHERE status = 'pending'),
    'confirmed_orders', COUNT(*) FILTER (WHERE status = 'confirmed'),
    'processing_orders', COUNT(*) FILTER (WHERE status = 'processing'),
    'shipped_orders', COUNT(*) FILTER (WHERE status = 'shipped'),
    'delivered_orders', COUNT(*) FILTER (WHERE status = 'delivered'),
    'cancelled_orders', COUNT(*) FILTER (WHERE status = 'cancelled'),
    'last_order_date', MAX(created_at)
  ) INTO v_result
  FROM orders
  WHERE (v_user_id IS NULL OR user_id = v_user_id);

  RETURN v_result;
END;
$$;

-- 8. FUNÇÃO DE CHECKOUT (CREATE_ORDER)
-- ============================================

CREATE OR REPLACE FUNCTION create_order(
  p_user_id UUID,
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_phone TEXT,
  p_customer_city TEXT,
  p_customer_zipcode TEXT,
  p_customer_address TEXT,
  p_shipping_address JSONB,
  p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_customer_id UUID;
  v_order_id UUID;
  v_total_amount NUMERIC := 0;
  v_item JSONB;
  v_product_price NUMERIC;
  v_product_stock INTEGER;
  v_product_active BOOLEAN;
  v_product_name TEXT;
  v_item_subtotal NUMERIC;
BEGIN
  -- 1. Gestão de Cliente (Upsert ou Criação)
  IF p_user_id IS NOT NULL THEN
    -- Tenta encontrar cliente vinculado ao usuário
    SELECT id INTO v_customer_id FROM customers WHERE auth_user_id = p_user_id LIMIT 1;
  ELSE
    -- Tenta encontrar cliente por email (para guests)
    SELECT id INTO v_customer_id FROM customers WHERE email = p_customer_email LIMIT 1;
  END IF;

  -- Se não existir, cria
  IF v_customer_id IS NULL THEN
    INSERT INTO customers (auth_user_id, full_name, email, phone)
    VALUES (p_user_id, p_customer_name, p_customer_email, p_customer_phone)
    RETURNING id INTO v_customer_id;
  ELSE
    -- Atualiza dados do cliente existente
    UPDATE customers 
    SET full_name = p_customer_name, phone = COALESCE(p_customer_phone, phone)
    WHERE id = v_customer_id;
  END IF;

  -- 2. Validar Estoque e Calcular Total (Loop de Validação)
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    -- Bloqueia a linha do produto para evitar Race Condition (FOR UPDATE)
    SELECT price, stock_quantity, is_active, name 
    INTO v_product_price, v_product_stock, v_product_active, v_product_name
    FROM products
    WHERE id = (v_item->>'product_id')::UUID
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Produto não encontrado: %', (v_item->>'product_id');
    END IF;

    -- Validação: Produto Ativo
    IF v_product_active IS FALSE THEN
      RAISE EXCEPTION 'O produto "%" não está mais disponível para venda.', v_product_name;
    END IF;

    -- Validação: Estoque
    IF v_product_stock < (v_item->>'quantity')::INTEGER THEN
      RAISE EXCEPTION 'Estoque insuficiente para o produto "%". Restam apenas % unidades.', v_product_name, v_product_stock;
    END IF;

    -- Soma ao total (Cálculo Backend)
    v_total_amount := v_total_amount + (v_product_price * (v_item->>'quantity')::INTEGER);
  END LOOP;

  -- 3. Criar Pedido
  INSERT INTO orders (
    user_id,
    customer_id, -- Vincula ao registro na tabela customers
    customer_name,
    customer_email,
    customer_address,
    customer_city,
    customer_zipcode,
    shipping_address_snapshot,
    total_amount,
    final_charge_amount, -- Igual ao total pois não há descontos/taxas extras ainda
    used_wallet_balance, -- Inicializa com 0
    status,
    payment_method -- Será definido no próximo passo, mas iniciamos como 'pending'
  ) VALUES (
    p_user_id,
    v_customer_id,
    p_customer_name,
    p_customer_email,
    p_customer_address,
    p_customer_city,
    p_customer_zipcode,
    p_shipping_address,
    v_total_amount,
    v_total_amount,
    0.00,
    'pending',
    'pending' 
  ) RETURNING id INTO v_order_id;

  -- 4. Inserir Itens e Baixar Estoque (Loop de Execução)
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT price INTO v_product_price
    FROM products
    WHERE id = (v_item->>'product_id')::UUID;

    v_item_subtotal := v_product_price * (v_item->>'quantity')::INTEGER;

    INSERT INTO order_items (
      order_id,
      product_id,
      quantity,
      unit_price,
      subtotal
    ) VALUES (
      v_order_id,
      (v_item->>'product_id')::UUID,
      (v_item->>'quantity')::INTEGER,
      v_product_price,
      v_item_subtotal
    );

    -- Atualiza estoque
    UPDATE products
    SET stock_quantity = stock_quantity - (v_item->>'quantity')::INTEGER
    WHERE id = (v_item->>'product_id')::UUID;
  END LOOP;

  RETURN jsonb_build_object('success', true, 'order_id', v_order_id);
END;
$$;

-- 9. GRANTS
-- ============================================

GRANT EXECUTE ON FUNCTION update_order_status TO authenticated;
GRANT EXECUTE ON FUNCTION cancel_order TO authenticated;
GRANT EXECUTE ON FUNCTION get_order_history TO authenticated;
GRANT EXECUTE ON FUNCTION get_order_stats TO authenticated;
GRANT EXECUTE ON FUNCTION create_order(uuid, text, text, text, text, text, text, jsonb, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION create_order(uuid, text, text, text, text, text, text, jsonb, jsonb) TO anon;

-- ============================================
-- INSTRUÇÕES DE USO
-- ============================================

-- Atualizar status do pedido:
-- SELECT update_order_status(
--   'order-uuid',
--   'shipped',
--   'BR123456789',
--   'Pedido enviado via Correios'
-- );

-- Cancelar pedido:
-- SELECT cancel_order('order-uuid', 'Cliente solicitou cancelamento');

-- Obter histórico do pedido:
-- SELECT get_order_history('order-uuid');

-- Obter estatísticas:
-- SELECT get_order_stats(); -- Próprio usuário
-- SELECT get_order_stats('user-uuid'); -- Admin pode ver de qualquer usuário

-- ============================================
-- 10. DOMAIN CONSISTENCY PATCH (STATE MACHINE + REFUND + STOCK ROLLBACK)
-- ============================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_wallet_refund_by_order
ON wallet_transactions (wallet_id, type, (metadata->>'order_id'))
WHERE type = 'REFUND';

CREATE OR REPLACE FUNCTION update_order_status(
  p_order_id UUID,
  p_new_status VARCHAR(20),
  p_tracking_code VARCHAR(50) DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_status VARCHAR(20);
  v_result json;
  v_transition_allowed BOOLEAN := FALSE;
BEGIN
  SELECT status INTO v_current_status
  FROM orders
  WHERE id = p_order_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Pedido nao encontrado');
  END IF;

  IF v_current_status = p_new_status THEN
    RETURN json_build_object('success', true, 'order_id', p_order_id, 'status', v_current_status, 'idempotent', true);
  END IF;

  IF v_current_status = 'pending' AND p_new_status IN ('confirmed', 'cancelled') THEN
    v_transition_allowed := TRUE;
  ELSIF v_current_status = 'paid' AND p_new_status IN ('confirmed', 'cancelled') THEN
    v_transition_allowed := TRUE;
  ELSIF v_current_status = 'confirmed' AND p_new_status IN ('processing', 'cancelled') THEN
    v_transition_allowed := TRUE;
  ELSIF v_current_status = 'processing' AND p_new_status IN ('shipped', 'cancelled') THEN
    v_transition_allowed := TRUE;
  ELSIF v_current_status = 'shipped' AND p_new_status = 'delivered' THEN
    v_transition_allowed := TRUE;
  END IF;

  IF NOT v_transition_allowed THEN
    RETURN json_build_object(
      'success', false,
      'error', format('Transicao invalida de status: %s -> %s', v_current_status, p_new_status)
    );
  END IF;

  UPDATE orders
  SET
    status = p_new_status,
    tracking_code = COALESCE(p_tracking_code, tracking_code),
    notes = COALESCE(p_notes, notes),
    shipped_at = CASE WHEN p_new_status = 'shipped' THEN NOW() ELSE shipped_at END,
    delivered_at = CASE WHEN p_new_status = 'delivered' THEN NOW() ELSE delivered_at END,
    cancelled_at = CASE WHEN p_new_status = 'cancelled' THEN NOW() ELSE cancelled_at END,
    updated_at = NOW()
  WHERE id = p_order_id;

  SELECT json_build_object(
    'success', true,
    'order_id', id,
    'status', status,
    'tracking_code', tracking_code,
    'updated_at', updated_at
  ) INTO v_result
  FROM orders
  WHERE id = p_order_id;

  RETURN v_result;
END;
$$;

CREATE OR REPLACE FUNCTION cancel_order(
  p_order_id UUID,
  p_reason TEXT
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_current_status VARCHAR(20);
  v_order_customer_id UUID;
  v_used_wallet_balance NUMERIC := 0;
  v_wallet_id UUID;
  v_existing_refund_id UUID;
  v_item RECORD;
BEGIN
  SELECT user_id, status, customer_id, COALESCE(used_wallet_balance, 0)
  INTO v_user_id, v_current_status, v_order_customer_id, v_used_wallet_balance
  FROM orders
  WHERE id = p_order_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Pedido nao encontrado');
  END IF;

  IF v_user_id != auth.uid() AND NOT is_admin(auth.uid()) THEN
    RETURN json_build_object('success', false, 'error', 'Sem permissao');
  END IF;

  IF v_current_status IN ('shipped', 'delivered', 'cancelled') THEN
    RETURN json_build_object('success', false, 'error', 'Pedido nao pode ser cancelado');
  END IF;

  FOR v_item IN
    SELECT product_id, quantity
    FROM order_items
    WHERE order_id = p_order_id
  LOOP
    UPDATE products
    SET stock_quantity = stock_quantity + v_item.quantity
    WHERE id = v_item.product_id;
  END LOOP;

  IF v_used_wallet_balance > 0 AND v_order_customer_id IS NOT NULL THEN
    SELECT id INTO v_wallet_id
    FROM user_wallet
    WHERE customer_id = v_order_customer_id
    LIMIT 1;

    IF v_wallet_id IS NOT NULL THEN
      SELECT id INTO v_existing_refund_id
      FROM wallet_transactions
      WHERE wallet_id = v_wallet_id
        AND type = 'REFUND'
        AND metadata->>'order_id' = p_order_id::TEXT
      LIMIT 1;

      IF v_existing_refund_id IS NULL THEN
        UPDATE user_wallet
        SET balance = balance + v_used_wallet_balance,
            updated_at = NOW()
        WHERE id = v_wallet_id;

        INSERT INTO wallet_transactions (
          wallet_id,
          type,
          amount,
          description,
          status,
          metadata
        ) VALUES (
          v_wallet_id,
          'REFUND',
          v_used_wallet_balance,
          format('Reembolso automatico por cancelamento do pedido %s', p_order_id),
          'COMPLETED',
          jsonb_build_object('order_id', p_order_id::TEXT, 'reason', p_reason)
        );
      END IF;
    END IF;
  END IF;

  UPDATE orders
  SET
    status = 'cancelled',
    cancelled_at = NOW(),
    cancellation_reason = p_reason,
    updated_at = NOW()
  WHERE id = p_order_id;

  RETURN json_build_object('success', true, 'message', 'Pedido cancelado com sucesso');
END;
$$;
