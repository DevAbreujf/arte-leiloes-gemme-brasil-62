# Configuração do Painel Administrativo

## Visão Geral

O painel administrativo foi configurado com as seguintes rotas:
- `/admin` - Página de login
- `/admin/painel` - Painel administrativo (protegido por autenticação)

## Configuração Necessária

### 1. Variáveis de Ambiente

Certifique-se de que seu arquivo `.env.local` possui as seguintes variáveis:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 2. Configuração de Administradores

Para adicionar emails de administradores, edite o arquivo `src/lib/supabase.ts` na função `isAdmin`:

```typescript
const adminEmails = [
  'admin@exemplo.com',
  'joao@exemplo.com',
  'seu-email@exemplo.com'  // Adicione seus emails aqui
]
```

### 3. Configuração do Supabase

#### Criação de Usuários Admin

1. Acesse o dashboard do Supabase
2. Vá em "Authentication" > "Users"
3. Clique em "Add user"
4. Adicione o email e senha do administrador
5. Confirme o email se necessário

#### Políticas de Segurança (RLS)

Recomenda-se configurar Row Level Security no Supabase para maior segurança:

1. Vá em "Table Editor"
2. Para cada tabela que será gerenciada pelo admin, configure políticas RLS
3. Exemplo de política para admins:

```sql
-- Permitir acesso total para administradores
CREATE POLICY "Admin full access" ON public.sua_tabela
FOR ALL
TO authenticated
USING (auth.email() IN ('admin@exemplo.com', 'joao@exemplo.com'));
```

## Como Usar

### Acesso ao Painel

1. Navegue para `http://localhost:5173/admin` (ou seu domínio + `/admin`)
2. Faça login com as credenciais de administrador
3. Após o login bem-sucedido, você será redirecionado para `/admin/painel`

### Funcionalidades Disponíveis

O painel atual inclui:

- **Dashboard**: Visão geral do sistema
- **Usuários**: Gerenciamento de usuários (em desenvolvimento)
- **Leilões**: Gerenciamento de leilões (em desenvolvimento)
- **Catálogos**: Gerenciamento de catálogos (em desenvolvimento)
- **Configurações**: Configurações do sistema (em desenvolvimento)

### Logout

Para sair do painel administrativo, clique no botão "Sair" no cabeçalho.

## Segurança

### Proteção de Rotas

- A rota `/admin/painel` é protegida pelo componente `ProtectedRoute`
- Usuários não autenticados são automaticamente redirecionados para `/admin`
- A verificação de autenticação é feita a cada carregamento da página

### Validação de Admin

- A função `isAdmin()` verifica se o usuário autenticado está na lista de emails autorizados
- Você pode expandir esta lógica para usar roles do Supabase ou outras formas de autorização

## Próximos Passos

Para expandir o painel administrativo:

1. **Implementar funcionalidades específicas** em cada aba (Usuários, Leilões, etc.)
2. **Conectar com o banco de dados** para mostrar dados reais
3. **Adicionar formulários** para CRUD operations
4. **Implementar upload de arquivos** para catálogos
5. **Adicionar relatórios e estatísticas**

## Exemplo de Uso com MCP

Para usar queries do banco via MCP no painel:

```typescript
import { call_mcp_tool } from '@/lib/mcp'

const fetchUsers = async () => {
  const result = await call_mcp_tool({
    name: 'query',
    input: JSON.stringify({
      sql: 'SELECT * FROM auth.users LIMIT 10'
    })
  })
  return result
}
```

## Troubleshooting

### Erro de Autenticação
- Verifique se as variáveis do Supabase estão corretas
- Confirme se o usuário foi criado no painel do Supabase
- Verifique se o email está na lista de admins

### Redirecionamento Inesperado
- Verifique se o token de autenticação não expirou
- Confirme se as políticas RLS não estão bloqueando o acesso

### Página em Branco
- Verifique o console do navegador para erros
- Confirme se todos os componentes foram importados corretamente
