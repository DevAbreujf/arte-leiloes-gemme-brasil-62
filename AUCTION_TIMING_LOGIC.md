# Lógica de Datas para Exibição de Leilões

## 📅 Como Funciona

### Conceito Principal
A partir de agora, os leilões só aparecem como "ativos" na página de catálogos **a partir da data e horário de início** definidos pelo administrador.

### Antes vs Depois

#### ❌ **Antes** (Lógica Antiga)
- Leilão criado pelo admin → Aparecia imediatamente como ativo
- Apenas campo `is_active = true` determinava a exibição

#### ✅ **Agora** (Nova Lógica)
- Leilão criado pelo admin → Fica "agendado" até a data de início
- Só aparece como ativo quando: `is_active = true` **E** `start_date <= data_atual`

## 🔄 Fluxo de Estados do Leilão

### 1. **Criado/Agendado**
- `is_active = true`
- `start_date > data_atual`
- **Status**: Não aparece na página pública
- **Visível no admin**: Sim, na aba "Leilões Ativos"

### 2. **Ativo**
- `is_active = true` 
- `start_date <= data_atual`
- **Status**: Aparece na página pública
- **Contador admin**: Incluído em "Leilões ativos agora"

### 3. **Encerrado**
- `is_active = false`
- **Status**: Move para aba "Finalizados" e histórico

## 🔧 Implementação Técnica

### Página de Catálogos (`Catalogos.tsx`)
```sql
-- Nova consulta SQL
SELECT * FROM auctions 
WHERE is_active = true 
AND start_date <= NOW()
ORDER BY start_date DESC;
```

### Painel Admin (`AdminPanel.tsx`)
```javascript
// Nova função de verificação
const isAuctionActiveNow = (auction) => {
  const now = new Date();
  const startDate = new Date(auction.start_date);
  return auction.is_active && startDate <= now;
};
```

## 📊 Contadores Atualizados

### Dashboard Admin
- **"Leilões ativos agora"**: Conta apenas leilões que já iniciaram
- **Lista "Leilões Ativos"**: Mostra todos com `is_active = true` (incluindo agendados)

### Página Pública
- **Catálogos**: Exibe apenas leilões que efetivamente iniciaram

## 💡 Casos de Uso

### Cenário 1: Leilão Agendado
- Admin cria leilão para "15/12/2024 10:00"
- **Hoje (10/12)**: Não aparece no site público
- **15/12 10:00**: Automaticamente aparece como ativo

### Cenário 2: Leilão Imediato
- Admin cria leilão para "hoje 09:00"
- **Se já passou das 09:00**: Aparece imediatamente
- **Se ainda não chegou às 09:00**: Fica agendado

### Cenário 3: Múltiplos Leilões
- Leilão A: Agendado para amanhã
- Leilão B: Ativo desde ontem
- **Página pública**: Mostra apenas Leilão B
- **Admin**: Mostra ambos na aba "Ativos"

## ⚠️ Pontos Importantes

### Para Administradores
1. **Datas passadas**: Leilões com `start_date` no passado aparecem imediatamente
2. **Fuso horário**: Sistema usa hora local do usuário
3. **Precisão**: Verificação ocorre em tempo real a cada carregamento da página

### Para Visitantes
1. **Atualizações**: Novos leilões podem aparecer sem aviso quando chegam na hora
2. **Consistência**: Não verão leilões "fantasma" antes da hora

## 🔄 Migração de Dados

### Leilões Existentes
- Leilões criados antes desta atualização não são afetados
- Se `start_date` está no passado, continuam ativos normalmente
- Se `start_date` está no futuro, ficam agendados

### Sem Necessidade de Alteração no Banco
- Estrutura existente suporta perfeitamente a nova lógica
- Apenas as consultas foram atualizadas
