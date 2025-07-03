-- SQL para corrigir as políticas RLS da tabela admins
-- Execute este script no console SQL do Supabase

-- 1. Remover políticas existentes que são muito restritivas
DROP POLICY IF EXISTS "Allow authenticated users to read their own admin record" ON admins;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON admins;
DROP POLICY IF EXISTS "Allow update for own record" ON admins;

-- 2. Criar políticas mais flexíveis para permitir gerenciamento de admins

-- Permitir que admins vejam todos os registros de admin
CREATE POLICY "Allow admins to read all admin records" ON admins
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM admins a 
    WHERE a.user_id = auth.uid() 
    AND a.is_active = true
  )
);

-- Permitir que admins criem novos registros de admin
CREATE POLICY "Allow admins to insert new admin records" ON admins
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins a 
    WHERE a.user_id = auth.uid() 
    AND a.is_active = true
  )
);

-- Permitir que admins atualizem registros de admin
CREATE POLICY "Allow admins to update admin records" ON admins
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM admins a 
    WHERE a.user_id = auth.uid() 
    AND a.is_active = true
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins a 
    WHERE a.user_id = auth.uid() 
    AND a.is_active = true
  )
);

-- 3. Verificar se RLS está habilitado na tabela
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 4. Garantir que existe pelo menos um admin inicial
-- (Substitua 'seu_email@exemplo.com' pelo email do primeiro admin)
-- INSERT INTO admins (email, user_id, is_active, role, created_at)
-- VALUES (
--   'seu_email@exemplo.com',
--   (SELECT id FROM auth.users WHERE email = 'seu_email@exemplo.com'),
--   true,
--   'admin',
--   NOW()
-- )
-- ON CONFLICT (user_id) DO NOTHING;
