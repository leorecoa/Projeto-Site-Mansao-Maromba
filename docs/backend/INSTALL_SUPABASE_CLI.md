# Instalacao Supabase CLI - Windows

## Opcao 1: NPM (Recomendado)

```bash
npm install -g supabase
```

Verificar:

```bash
supabase --version
```

Se nao funcionar, reinicie o terminal.

---

## Opcao 2: Scoop (Alternativa)

```bash
# Instalar Scoop (se nao tiver)
iwr -useb get.scoop.sh | iex

# Instalar Supabase CLI
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

---

## Opcao 3: Download Direto

1. Baixar: https://github.com/supabase/cli/releases/latest
2. Escolher: `supabase_windows_amd64.zip`
3. Extrair para `C:\Program Files\Supabase`
4. Adicionar ao PATH:
   - Pesquisar "Variaveis de Ambiente"
   - Editar PATH
   - Adicionar: `C:\Program Files\Supabase`
5. Reiniciar terminal

---

## Alternativa: Executar SQLs Manualmente

**Voce NAO precisa do CLI para usar o backend!**

### Passo a Passo

1. **Acessar Supabase Dashboard**

   ```
   https://supabase.com/painel/project/ftgzoulanmsrmujtgrvj
   ```

2. **Ir em SQL Editor** (menu lateral)

3. **Executar os SQLs na ordem:**
   - `supabase_optimization.sql`
   - `supabase_orders_enhanced.sql`

4. **Edge Functions (Opcional)**
   - Ir em "Edge Functions" no painel
   - Criar manualmente via interface
   - Copiar codigo dos arquivos `.ts`

---

## Solucao Rapida (SEM CLI)

### 1. Database Optimization

```sql
-- Copiar TODO o conteudo de supabase_optimization.sql
-- Colar no SQL Editor do Supabase
-- Clicar em RUN
```

### 2. Orders Enhanced

```sql
-- Copiar TODO o conteudo de supabase_orders_enhanced.sql
-- Colar no SQL Editor do Supabase
-- Clicar em RUN
```

### 3. Testar

```sql
-- Testar funcao de stats
SELECT get_admin_stats();

-- Ver indices criados
SELECT indexname FROM pg_indexes WHERE schemaname = 'public';

-- Ver views materializadas
SELECT matviewname FROM pg_matviews;
```

---

## Pronto!

Seu backend esta otimizado mesmo sem o CLI.

**Edge Functions sao opcionais** - voce pode implementar depois quando precisar de webhooks de pagamento.

---

## Proximos Passos (SEM CLI)

1.  Executar SQLs no painel
2.  Testar funcoes
3.  Atualizar frontend para usar novas funcoes
4.  Edge Functions (quando precisar)

**Nao deixe o CLI te bloquear! Continue o desenvolvimento.**
