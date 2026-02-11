-- ============================================
-- DATABASE OPTIMIZATION
-- Índices, Views Materializadas e Performance
-- ============================================

-- 1. ÍNDICES PARA QUERIES FREQUENTES
-- ============================================

-- Índice para buscar produtos por nome (busca)
CREATE INDEX IF NOT EXISTS idx_products_name 
ON products(name);

-- Índice para buscar pedidos por usuário (query mais frequente)
CREATE INDEX IF NOT EXISTS idx_orders_user_id 
ON orders(user_id, created_at DESC);

-- Índice para buscar pedidos por status
CREATE INDEX IF NOT EXISTS idx_orders_status 
ON orders(status, created_at DESC);

-- Índice composto para order_items (JOIN frequente)
CREATE INDEX IF NOT EXISTS idx_order_items_order_product 
ON order_items(order_id, product_id);

-- Índice para buscar perfis por email
CREATE INDEX IF NOT EXISTS idx_user_profiles_email 
ON user_profiles(email);

-- Índice para buscar perfis por role (admin queries)
CREATE INDEX IF NOT EXISTS idx_user_profiles_role 
ON user_profiles(role);

-- 2. VIEWS MATERIALIZADAS PARA STATS
-- ============================================

-- View: Estatísticas de produtos (mais vendidos)
CREATE MATERIALIZED VIEW IF NOT EXISTS product_stats AS
SELECT 
  p.id,
  p.name,
  p.image_url,
  COUNT(oi.id) as total_orders,
  SUM(oi.quantity) as total_quantity_sold,
  SUM(oi.quantity * oi.unit_price) as total_revenue,
  AVG(oi.unit_price) as avg_price
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, p.image_url;

-- Índice na view materializada
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_stats_id 
ON product_stats(id);

-- View: Estatísticas de pedidos por dia
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_order_stats AS
SELECT 
  DATE(created_at) as order_date,
  COUNT(*) as total_orders,
  SUM(total_amount) as total_revenue,
  AVG(total_amount) as avg_order_value,
  COUNT(DISTINCT user_id) as unique_customers
FROM orders
GROUP BY DATE(created_at)
ORDER BY order_date DESC;

-- Índice na view de stats diárias
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_order_stats_date 
ON daily_order_stats(order_date);

-- View: Top clientes
CREATE MATERIALIZED VIEW IF NOT EXISTS top_customers AS
SELECT 
  o.user_id,
  up.email,
  COUNT(o.id) as total_orders,
  SUM(o.total_amount) as total_spent,
  MAX(o.created_at) as last_order_date
FROM orders o
JOIN user_profiles up ON o.user_id = up.id
GROUP BY o.user_id, up.email
ORDER BY total_spent DESC
LIMIT 100;

-- Índice na view de top clientes
CREATE UNIQUE INDEX IF NOT EXISTS idx_top_customers_user_id 
ON top_customers(user_id);

-- 3. FUNÇÃO PARA REFRESH DAS VIEWS
-- ============================================

CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY product_stats;
  REFRESH MATERIALIZED VIEW CONCURRENTLY daily_order_stats;
  REFRESH MATERIALIZED VIEW CONCURRENTLY top_customers;
END;
$$;

-- 4. TRIGGER PARA AUTO-REFRESH (após inserção de pedido)
-- ============================================

CREATE OR REPLACE FUNCTION trigger_refresh_stats()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  PERFORM refresh_materialized_views();
  RETURN NEW;
END;
$$;

-- Trigger após inserção de pedido
DROP TRIGGER IF EXISTS after_order_insert_refresh_stats ON orders;
CREATE TRIGGER after_order_insert_refresh_stats
AFTER INSERT ON orders
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_refresh_stats();

-- 5. FUNÇÃO PARA ESTATÍSTICAS DO ADMIN DASHBOARD
-- ============================================

CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total_products', (SELECT COUNT(*) FROM products),
    'total_orders', (SELECT COUNT(*) FROM orders),
    'total_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status != 'cancelled'),
    'total_customers', (SELECT COUNT(DISTINCT user_id) FROM orders),
    'pending_orders', (SELECT COUNT(*) FROM orders WHERE status = 'pending'),
    'recent_orders', (
      SELECT json_agg(row_to_json(t))
      FROM (
        SELECT 
          o.id,
          c.full_name as customer_name,
          o.total_amount,
          o.status,
          o.created_at
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        ORDER BY o.created_at DESC
        LIMIT 5
      ) t
    ),
    'top_products', (
      SELECT json_agg(row_to_json(t))
      FROM (
        SELECT * FROM product_stats
        ORDER BY total_quantity_sold DESC NULLS LAST
        LIMIT 5
      ) t
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

-- 6. BACKUP AUTOMÁTICO (via pg_cron - requer extensão)
-- ============================================

-- Habilitar extensão pg_cron (executar como superuser)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Agendar backup diário às 3h da manhã
-- SELECT cron.schedule(
--   'daily-backup',
--   '0 3 * * *',
--   $$
--   SELECT refresh_materialized_views();
--   $$
-- );

-- 7. RLS PARA VIEWS (apenas admins)
-- ============================================

ALTER MATERIALIZED VIEW product_stats OWNER TO postgres;
ALTER MATERIALIZED VIEW daily_order_stats OWNER TO postgres;
ALTER MATERIALIZED VIEW top_customers OWNER TO postgres;

-- Revogar acesso público
REVOKE ALL ON product_stats FROM PUBLIC;
REVOKE ALL ON daily_order_stats FROM PUBLIC;
REVOKE ALL ON top_customers FROM PUBLIC;

-- 8. GRANTS PARA FUNÇÕES
-- ============================================

GRANT EXECUTE ON FUNCTION get_admin_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_materialized_views() TO postgres;

-- ============================================
-- INSTRUÇÕES DE USO
-- ============================================

-- Para atualizar as views manualmente:
-- SELECT refresh_materialized_views();

-- Para obter stats do admin:
-- SELECT get_admin_stats();

-- Para verificar performance dos índices:
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes
-- ORDER BY idx_scan DESC;

-- Para verificar tamanho das tabelas:
-- SELECT 
--   schemaname,
--   tablename,
--   pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
