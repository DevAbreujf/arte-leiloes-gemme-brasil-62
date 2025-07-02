# 🎯 Sistema de Leilões - Guia Completo

## 📋 Resumo do Sistema

O sistema permite gerenciar leilões através do painel administrativo, que automaticamente atualiza a página de catálogos baseado na data/hora configurada.

### ✅ **Funcionalidades Implementadas:**

1. **Painel Admin simplificado** - Focado apenas em leilões e configurações
2. **Gerenciamento de Leilões** - Criar, listar e excluir leilões
3. **Página de Catálogos dinâmica** - Exibe leilão ativo ou mensagem de captação
4. **Controle por data/hora** - Leilões ativam e desativam automaticamente

---

## 🗄️ **Passo 1: Configurar Banco de Dados**

Execute este SQL no **SQL Editor** do Supabase:

```sql
-- Criar tabela de leilões
CREATE TABLE public.auctions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  link TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Índices para performance
CREATE INDEX idx_auctions_start_date ON public.auctions(start_date);
CREATE INDEX idx_auctions_end_date ON public.auctions(end_date);
CREATE INDEX idx_auctions_is_active ON public.auctions(is_active);
CREATE INDEX idx_auctions_created_at ON public.auctions(created_at);

-- Habilitar RLS
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;

-- Política para admins
CREATE POLICY "Admins can manage auctions" ON public.auctions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins a 
      WHERE a.user_id = auth.uid() AND a.is_active = true
    )
  );

-- Política para leitura pública
CREATE POLICY "Public can view active auctions" ON public.auctions
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para updated_at
CREATE TRIGGER update_auctions_updated_at 
  BEFORE UPDATE ON public.auctions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Função para buscar leilão ativo
CREATE OR REPLACE FUNCTION get_active_auction()
RETURNS TABLE (
  id UUID,
  name TEXT,
  link TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.name,
    a.link,
    a.start_date,
    a.end_date
  FROM public.auctions a
  WHERE 
    a.is_active = true
    AND a.start_date <= NOW()
    AND (a.end_date IS NULL OR a.end_date >= NOW())
  ORDER BY a.start_date DESC
  LIMIT 1;
END;
$$ language 'plpgsql' SECURITY DEFINER;
```

---

## 🚀 **Passo 2: Testar o Sistema**

### **1. Testar localmente:**
```bash
npm run dev
```

### **2. Acessar painel admin:**
- URL: `http://localhost:8080/admin`
- Faça login com suas credenciais de admin

### **3. Criar um leilão de teste:**
- **Nome:** "Leilão de Arte Contemporânea"
- **Link:** "https://exemplo.com/leilao"
- **Data de Início:** (escolha uma data/hora atual ou futura)
- **Data de Encerramento:** (opcional - deixe vazio para leilão aberto)

### **4. Verificar página de catálogos:**
- URL: `http://localhost:8080/catalogos`
- Deve exibir o leilão ativo ou mensagem de captação

---

## 📱 **Como Funciona na Prática**

### **Cenário 1: Nenhum leilão configurado**
- **Página Catálogos exibe:** "Estamos em captação para nosso próximo leilão"

### **Cenário 2: Leilão configurado (data futura)**
- **Página Catálogos exibe:** "Estamos em captação para nosso próximo leilão"
- **Quando chegar a data/hora:** Automaticamente muda para "Leilão Ativo"

### **Cenário 3: Leilão ativo (data já chegou)**
- **Página Catálogos exibe:**
  - ✅ "Leilão Ativo: [Nome do Leilão]"
  - ✅ Link clicável para o leilão
  - ✅ Data de início
  - ✅ Data de encerramento (se configurada)

### **Cenário 4: Leilão encerrado (data de fim passou)**
- **Página Catálogos volta para:** "Estamos em captação para nosso próximo leilão"

---

## ⚙️ **Configurações do Painel Admin**

### **Aba "Leilões":**
- ✅ **Formulário para criar leilão**
- ✅ **Lista de leilões configurados**
- ✅ **Botão para excluir leilões**
- ✅ **Validação de campos obrigatórios**

### **Aba "Configurações":**
- 📋 Preparado para futuras configurações

### **Cards de Estatísticas:**
- ✅ **Leilões Ativos:** Conta quantos leilões estão configurados
- ✅ **Status do Sistema:** Mostra se está online

---

## 🔧 **Campos do Formulário**

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| **Nome do Leilão** | ✅ Sim | Ex: "Leilão de Arte Contemporânea" |
| **Link do Leilão** | ✅ Sim | URL completa do leilão externo |
| **Data de Início** | ✅ Sim | Quando o leilão fica ativo |
| **Data de Encerramento** | ❌ Não | Se vazio, leilão fica aberto |

---

## 🧪 **Exemplos de Teste**

### **Teste 1: Leilão Imediato**
```
Nome: Leilão Teste
Link: https://google.com
Início: [Data/hora atual]
Fim: [Vazio]
```
**Resultado:** Página de catálogos deve mostrar o leilão imediatamente

### **Teste 2: Leilão Futuro**
```
Nome: Leilão Futuro
Link: https://google.com
Início: [Amanhã às 10:00]
Fim: [Amanhã às 18:00]
```
**Resultado:** Página mostra captação até amanhã às 10:00

### **Teste 3: Leilão com Fim**
```
Nome: Leilão com Prazo
Link: https://google.com
Início: [Agora]
Fim: [Daqui a 1 hora]
```
**Resultado:** Ativo agora, volta para captação em 1 hora

---

## 🚀 **Deploy para Produção**

### **1. Commit e push:**
```bash
git add .
git commit -m "Implementar sistema de leilões"
git push origin main
```

### **2. Verificar deploy no Vercel:**
- Aguardar deploy automático
- Testar todas as funcionalidades

### **3. Configurar domínio admin (opcional):**
- Seguir guia em `VERCEL_SUBDOMAIN_SETUP.md`

---

## 🔐 **Segurança Implementada**

- ✅ **RLS habilitado** na tabela `auctions`
- ✅ **Apenas admins** podem criar/editar leilões
- ✅ **Leitura pública** permitida para página de catálogos
- ✅ **Validação de campos** no frontend
- ✅ **Proteção de rotas** do painel admin

---

## 📞 **Próximos Passos Possíveis**

1. **Adicionar imagens** aos leilões
2. **Notificações por email** quando leilão inicia
3. **Relatórios** de leilões passados
4. **Múltiplos leilões** simultâneos
5. **Cache** para melhor performance
6. **Sistema de backup** automático

---

**🎉 Sistema de Leilões implementado com sucesso!**

O painel administrativo está pronto para gerenciar leilões e a página de catálogos responde automaticamente baseada nas datas configuradas.
