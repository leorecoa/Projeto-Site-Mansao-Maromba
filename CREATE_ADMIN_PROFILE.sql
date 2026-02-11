-- Execute este SQL no Supabase SQL Editor para criar seu perfil de admin

-- 1. Verificar se você já tem perfil
SELECT * FROM user_profiles WHERE email = 'leorecoa2@gmail.com';

-- 2. Se não tiver, criar perfil de admin
INSERT INTO user_profiles (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'leorecoa2@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 3. Verificar se funcionou
SELECT * FROM user_profiles WHERE email = 'leorecoa2@gmail.com';
