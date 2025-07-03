# Correção do Erro de Recursão Infinita - Políticas Admins

## ❌ Problema Identificado
O erro `infinite recursion detected in policy for relation "admins" codigo 42p17` ocorre quando as políticas RLS (Row Level Security) da tabela `admins` fazem referência circular à própria tabela, criando um loop infinito.

## ✅ Solução Implementada

### 1. Execute o Script SQL
Execute o arquivo `fix_admin_policies.sql` no console SQL do Supabase para:
- Remover todas as políticas recursivas existentes
- Criar uma função auxiliar que evita recursão
- Implementar políticas RLS corretas
- Garantir que existe pelo menos um admin inicial

### 2. Atualizações no Código
O código foi atualizado para:
- Usar a função RPC `is_user_admin()` em vez de consultas diretas
- Melhorar o tratamento de erros específicos
- Adicionar verificação de permissões antes de carregar dados

## 🔧 Passos para Aplicar a Correção

### Passo 1: Execute o Script SQL
```sql
-- Cole todo o conteúdo do arquivo fix_admin_policies.sql no console SQL do Supabase
```

### Passo 2: Verificar se Funcionou
Após executar o script, teste:
1. Fazer login no painel admin
2. Acessar a aba "Configurações"
3. Verificar se a lista de administradores carrega sem erro

### Passo 3: Adicionar Primeiro Admin (se necessário)
Se não houver nenhum admin, o script automaticamente criará um usando o primeiro usuário registrado. Se quiser adicionar manualmente:

```sql
-- Substitua 'seu_email@exemplo.com' pelo seu email
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
WHERE email = 'seu_email@exemplo.com'
ON CONFLICT (user_id) DO UPDATE SET
  is_active = true,
  role = 'super_admin',
  updated_at = NOW();
```

## 🛡️ Como a Solução Funciona

### Função Auxiliar `is_user_admin()`
```sql
CREATE OR REPLACE FUNCTION is_user_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins 
    WHERE admins.user_id = is_user_admin.user_id 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Políticas Não-Recursivas
As novas políticas usam a função auxiliar em vez de fazer consultas diretas na tabela `admins`, evitando a recursão.

## 🔍 Verificação de Status

### Verificar Políticas Ativas
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'admins';
```

### Verificar Admins Existentes
```sql
SELECT id, email, name, role, is_active, created_at 
FROM admins 
WHERE is_active = true;
```

### Verificar Função RPC
```sql
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'is_user_admin';
```

## 🚨 Mensagens de Erro Tratadas

O código agora identifica e trata especificamente:
- **42P17**: Recursão infinita (mostra instruções para executar o script)
- **PGRST116**: Permissão negada (usuário não é admin)
- **42P01**: Tabela não encontrada (problema de estrutura)

## 📝 Próximos Passos

1. Execute o script `fix_admin_policies.sql`
2. Teste o painel admin
3. Se funcionou, delete os arquivos de correção antigos:
   - `sql_fixes_admin_policies.sql`
   - `add_current_user_as_admin.sql`
4. Mantenha apenas o `fix_admin_policies.sql` como referência

## ⚠️ Importante
- Sempre faça backup antes de executar scripts SQL
- Execute apenas em ambiente de desenvolvimento primeiro
- A função `is_user_admin()` é marcada como `SECURITY DEFINER` para funcionar corretamente
