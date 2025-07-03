-- Script para adicionar o usuário atual como administrador
-- Execute este script no console SQL do Supabase

-- 1. Verificar usuários atuais na tabela auth.users
SELECT id, email, created_at FROM auth.users;

-- 2. Verificar admins existentes
SELECT * FROM admins WHERE is_active = true;

-- 3. Adicionar o usuário atual como admin (substitua 'seu_email@exemplo.com' pelo seu email)
-- IMPORTANTE: Substitua 'seu_email@exemplo.com' pelo email que você usa para fazer login
INSERT INTO admins (
  email, 
  user_id, 
  name,
  role, 
  is_active, 
  created_at
)
SELECT 
  email,
  id,
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)) as name,
  'super_admin',
  true,
  NOW()
FROM auth.users 
WHERE email = 'seu_email@exemplo.com'  -- SUBSTITUA PELO SEU EMAIL
ON CONFLICT (user_id) DO UPDATE SET
  is_active = true,
  role = 'super_admin',
  updated_at = NOW();

-- 4. Verificar se foi adicionado corretamente
SELECT 
  a.id,
  a.email,
  a.name,
  a.role,
  a.is_active,
  a.created_at,
  u.email as auth_email
FROM admins a
JOIN auth.users u ON a.user_id = u.id
WHERE a.is_active = true;
