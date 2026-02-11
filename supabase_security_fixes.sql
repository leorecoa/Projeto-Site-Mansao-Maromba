-- ============================================
-- FIX SECURITY WARNINGS
-- Corrige warnings do Database Linter
-- ============================================

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

-- ============================================
-- VERIFICAR CORREÇÕES
-- ============================================

-- Verificar funções corrigidas:
-- SELECT routine_name, routine_type 
-- FROM information_schema.routines 
-- WHERE routine_schema = 'public' 
-- AND routine_name IN ('is_admin', 'create_user_profile', 'get_admin_stats', 'refresh_materialized_views', 'trigger_refresh_stats');

-- Verificar permissões das views:
-- SELECT tablename, tableowner 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('product_stats', 'daily_order_stats', 'top_customers');
