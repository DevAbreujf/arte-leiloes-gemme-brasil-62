-- Script para corrigir recursão infinita nas políticas da tabela admins
-- Execute este script no console SQL do Supabase

-- 1. Primeiro, desabilitar RLS temporariamente para limpeza
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- 2. Remover todas as políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Allow authenticated users to read their own admin record" ON admins;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON admins;
DROP POLICY IF EXISTS "Allow update for own record" ON admins;
DROP POLICY IF EXISTS "Allow admins to read all admin records" ON admins;
DROP POLICY IF EXISTS "Allow admins to insert new admin records" ON admins;
DROP POLICY IF EXISTS "Allow admins to update admin records" ON admins;
DROP POLICY IF EXISTS "Allow admins to delete admin records" ON admins;

-- 3. Criar função auxiliar para verificar se o usuário é admin
-- Esta função evita recursão ao não usar políticas RLS diretamente
CREATE OR REPLACE FUNCTION is_user_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verifica diretamente na tabela sem usar RLS
  RETURN EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.user_id = is_user_admin.user_id 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Criar políticas não recursivas usando a função auxiliar
-- Política para SELECT - permite que admins vejam todos os registros
CREATE POLICY "Enable read access for admins" ON admins
FOR SELECT USING (
  is_user_admin(auth.uid())
);

-- Política para INSERT - permite que admins criem novos registros
CREATE POLICY "Enable insert access for admins" ON admins
FOR INSERT WITH CHECK (
  is_user_admin(auth.uid())
);

-- Política para UPDATE - permite que admins atualizem registros
CREATE POLICY "Enable update access for admins" ON admins
FOR UPDATE USING (
  is_user_admin(auth.uid())
) WITH CHECK (
  is_user_admin(auth.uid())
);

-- Política para DELETE - permite que admins desativem registros
CREATE POLICY "Enable delete access for admins" ON admins
FOR DELETE USING (
  is_user_admin(auth.uid())
);

-- 5. Reabilitar RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 6. Verificar se existe pelo menos um admin ativo
-- Se não existir, criar um usando o primeiro usuário da tabela auth.users
DO $$
DECLARE
  admin_count INTEGER;
  first_user_id UUID;
  first_user_email TEXT;
BEGIN
  -- Contar admins ativos
  SELECT COUNT(*) INTO admin_count 
  FROM admins 
  WHERE is_active = true;
  
  -- Se não há admins, criar um usando o primeiro usuário
  IF admin_count = 0 THEN
    SELECT id, email INTO first_user_id, first_user_email
    FROM auth.users
    ORDER BY created_at ASC
    LIMIT 1;
    
    IF first_user_id IS NOT NULL THEN
      INSERT INTO admins (
        user_id, 
        email, 
        name, 
        role, 
        is_active, 
        created_at
      ) VALUES (
        first_user_id,
        first_user_email,
        COALESCE(
          (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE id = first_user_id),
          split_part(first_user_email, '@', 1)
        ),
        'super_admin',
        true,
        NOW()
      );
      
      RAISE NOTICE 'Admin inicial criado para: %', first_user_email;
    END IF;
  END IF;
END
$$;

-- 7. Mostrar status final
SELECT 
  'Políticas corrigidas com sucesso!' as status,
  COUNT(*) as total_admins_ativos
FROM admins 
WHERE is_active = true;
