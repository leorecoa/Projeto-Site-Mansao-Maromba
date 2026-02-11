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

-- Adicionar constraint para status válidos
ALTER TABLE orders 
DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders 
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'));

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

-- 8. GRANTS
-- ============================================

GRANT EXECUTE ON FUNCTION update_order_status TO authenticated;
GRANT EXECUTE ON FUNCTION cancel_order TO authenticated;
GRANT EXECUTE ON FUNCTION get_order_history TO authenticated;
GRANT EXECUTE ON FUNCTION get_order_stats TO authenticated;

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
