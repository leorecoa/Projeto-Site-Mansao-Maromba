-- ============================================
-- SCRIPT COMPLETO: CONFIGURAÇÃO ADMIN PERMANENTE
-- Execute este script no Supabase SQL Editor
-- ============================================

-- 1. GARANTIR QUE A TABELA user_profiles EXISTE
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CRIAR ÍNDICE PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- 3. TRIGGER PARA CRIAR PERFIL AUTOMATICAMENTE
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'customer')
  ON CONFLICT (email) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- 4. FUNÇÃO PARA VERIFICAR SE É ADMIN
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RLS POLICIES PARA user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
CREATE POLICY "Admins can view all profiles"
ON user_profiles FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND role = (SELECT role FROM user_profiles WHERE id = auth.uid()));

-- 6. TORNAR leorecoa1@hotmail.com ADMIN PERMANENTE
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Busca o ID do usuário pelo email
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'leorecoa1@hotmail.com';

  -- Se o usuário existe, cria/atualiza o perfil como admin
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO user_profiles (id, email, role)
    VALUES (admin_user_id, 'leorecoa1@hotmail.com', 'admin')
    ON CONFLICT (email) 
    DO UPDATE SET role = 'admin';
    
    RAISE NOTICE 'Admin configurado com sucesso: leorecoa1@hotmail.com';
  ELSE
    RAISE NOTICE 'Usuário não encontrado. Faça login no app primeiro e execute novamente.';
  END IF;
END $$;

-- 7. VERIFICAR SE O ADMIN FOI CRIADO
SELECT 
  id,
  email,
  role,
  created_at
FROM user_profiles
WHERE email = 'leorecoa1@hotmail.com';

-- ============================================
-- RESULTADO ESPERADO:
-- Se aparecer uma linha com role = 'admin', está configurado!
-- ============================================
