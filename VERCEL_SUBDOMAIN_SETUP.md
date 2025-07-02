# 🚀 Configuração de Subdomínio Admin no Vercel

## Resumo
Este guia mostra como configurar o subdomínio `admin.seudominio.com` no Vercel para acessar o painel administrativo.

## ✅ O que já foi implementado

### 1. **Código preparado para subdomínios**
- ✅ Detecção automática de subdomínio `admin.*`
- ✅ Rotas diferentes para admin: `/` (login) e `/painel` (dashboard)
- ✅ Compatibilidade com domínio principal: `/admin` e `/admin/painel`
- ✅ Arquivo `vercel.json` configurado

### 2. **SQL para tabela de administradores**
Execute no SQL Editor do Supabase:

```sql
-- Criar tabela de administradores
CREATE TABLE public.admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX idx_admins_user_id ON public.admins(user_id);
CREATE INDEX idx_admins_email ON public.admins(email);
CREATE INDEX idx_admins_is_active ON public.admins(is_active);

-- RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view other admins" ON public.admins
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins a 
      WHERE a.user_id = auth.uid() AND a.is_active = true
    )
  );
```

## 🔧 Passos para Configurar no Vercel

### Passo 1: Deploy do Código
```bash
git add .
git commit -m "Implementar subdomínio admin"
git push origin main
```

### Passo 2: Configurar Domínio no Vercel
1. Acesse seu projeto no **Vercel Dashboard**
2. Vá em **Settings** → **Domains**
3. Clique em **Add**
4. Digite: `admin.seudominio.com`
5. Clique em **Add**

### Passo 3: Configurar DNS
No painel do seu provedor de domínio:

**Tipo:** CNAME  
**Nome:** admin  
**Valor:** cname.vercel-dns.com  
**TTL:** 3600 (ou automático)

### Passo 4: Criar Usuário Admin no Supabase
1. **Supabase Dashboard** → **Authentication** → **Users**
2. Clique **Add user**
3. Digite email e senha do admin
4. Confirme o email (se necessário)

### Passo 5: Inserir na Tabela Admins
No **SQL Editor** do Supabase:

```sql
-- Substitua pelo ID real do usuário criado
INSERT INTO public.admins (user_id, email, name, role)
VALUES (
  'id-do-usuario-criado', -- Copie da tabela auth.users
  'admin@seudominio.com',
  'Nome do Administrador',
  'super_admin'
);
```

## 🌐 Como Funciona Após Deploy

### Domínio Principal (`seudominio.com`)
- Site normal com todas as páginas
- `/admin` → Página de login
- `/admin/painel` → Painel administrativo

### Subdomínio Admin (`admin.seudominio.com`)
- **Interface exclusiva para admin**
- `/` → Página de login
- `/painel` → Painel administrativo
- Redirecionamentos automáticos

## 🧪 Como Testar

### 1. Testar Localmente
```bash
npm run dev
```
- Acesse: `http://localhost:8080/admin`
- Teste login e redirecionamento

### 2. Testar em Produção
- **Domínio principal:** `https://seudominio.com/admin`
- **Subdomínio:** `https://admin.seudominio.com/`

## 🔐 Segurança Implementada

- ✅ **Proteção de rotas** com autenticação
- ✅ **Validação por tabela** `admins`
- ✅ **RLS (Row Level Security)** no Supabase
- ✅ **Sessões gerenciadas** automaticamente
- ✅ **Registro de último login**

## ⚡ Funcionalidades do Admin

### Já Implementado:
- ✅ Login seguro
- ✅ Dashboard com estatísticas
- ✅ Estrutura para 5 módulos
- ✅ Logout
- ✅ Interface responsiva

### Pronto para Expandir:
- 📋 Gerenciamento de usuários
- 🏷️ Gerenciamento de leilões  
- 📁 Upload de catálogos
- ⚙️ Configurações do sistema
- 📊 Relatórios

## 🚨 Troubleshooting

### DNS não resolve
- Aguarde até 48h para propagação
- Verifique configuração no provedor
- Teste com `nslookup admin.seudominio.com`

### Erro 404 no subdomínio
- Verifique se está no Vercel Dashboard
- Confirme se `vercel.json` foi deployado
- Redeploye se necessário

### Login não funciona
- Confirme variáveis `.env.local`
- Verifique se usuário existe no Supabase
- Confirme se está na tabela `admins`

### Redirecionamento incorreto
- Limpe cache do navegador
- Verifique se está no subdomínio correto
- Teste em aba anônima

## 📞 Próximos Passos

Após tudo funcionando:

1. **Testar funcionalidades básicas**
2. **Implementar módulos específicos** (usuários, leilões, etc.)
3. **Conectar com dados reais** via MCP
4. **Adicionar upload de arquivos**
5. **Implementar relatórios**

---

**🎉 Parabéns!** Seu painel administrativo está pronto para produção com subdomínio profissional!
