# 🔧 Instalação Supabase CLI - Windows

## Opção 1: NPM (Recomendado)

```bash
npm install -g supabase
```

Verificar:
```bash
supabase --version
```

Se não funcionar, reinicie o terminal.

---

## Opção 2: Scoop (Alternativa)

```bash
# Instalar Scoop (se não tiver)
iwr -useb get.scoop.sh | iex

# Instalar Supabase CLI
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

---

## Opção 3: Download Direto

1. Baixar: https://github.com/supabase/cli/releases/latest
2. Escolher: `supabase_windows_amd64.zip`
3. Extrair para `C:\Program Files\Supabase`
4. Adicionar ao PATH:
   - Pesquisar "Variáveis de Ambiente"
   - Editar PATH
   - Adicionar: `C:\Program Files\Supabase`
5. Reiniciar terminal

---

## ⚠️ Alternativa: Executar SQLs Manualmente

**Você NÃO precisa do CLI para usar o backend!**

### Passo a Passo:

1. **Acessar Supabase Dashboard**
   ```
   https://supabase.com/dashboard/project/ftgzoulanmsrmujtgrvj
   ```

2. **Ir em SQL Editor** (menu lateral)

3. **Executar os SQLs na ordem:**
   - `supabase_optimization.sql`
   - `supabase_orders_enhanced.sql`

4. **Edge Functions (Opcional)**
   - Ir em "Edge Functions" no dashboard
   - Criar manualmente via interface
   - Copiar código dos arquivos `.ts`

---

## 🎯 Solução Rápida (SEM CLI)

### 1. Database Optimization

```sql
-- Copiar TODO o conteúdo de supabase_optimization.sql
-- Colar no SQL Editor do Supabase
-- Clicar em RUN
```

### 2. Orders Enhanced

```sql
-- Copiar TODO o conteúdo de supabase_orders_enhanced.sql
-- Colar no SQL Editor do Supabase
-- Clicar em RUN
```

### 3. Testar

```sql
-- Testar função de stats
SELECT get_admin_stats();

-- Ver índices criados
SELECT indexname FROM pg_indexes WHERE schemaname = 'public';

-- Ver views materializadas
SELECT matviewname FROM pg_matviews;
```

---

## ✅ Pronto!

Seu backend está otimizado mesmo sem o CLI.

**Edge Functions são opcionais** - você pode implementar depois quando precisar de webhooks de pagamento.

---

## 📊 Próximos Passos (SEM CLI)

1. ✅ Executar SQLs no dashboard
2. ✅ Testar funções
3. ✅ Atualizar frontend para usar novas funções
4. ⏭️ Edge Functions (quando precisar)

**Não deixe o CLI te bloquear! Continue o desenvolvimento.**
