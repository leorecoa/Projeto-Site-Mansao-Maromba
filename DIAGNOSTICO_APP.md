# 🔍 Diagnóstico - App não abre

## ✅ Correções Aplicadas

1. **Removido importmap do index.html** - Conflitava com Vite bundler

## 🧪 Como Testar

### 1. Limpar cache e reinstalar
```bash
# Limpar node_modules e cache
rm -rf node_modules package-lock.json
npm install

# Limpar cache do Vite
rm -rf .vite
```

### 2. Iniciar servidor
```bash
npm run dev
```

### 3. Verificar erros no console do navegador
- Abra DevTools (F12)
- Vá para a aba Console
- Procure por erros em vermelho

## 🔍 Possíveis Problemas

### A. Erro de importação de módulos
**Sintoma:** `Failed to resolve module`
**Solução:** Verificar se todos os arquivos importados existem

### B. Erro do Supabase
**Sintoma:** `Supabase URL e Anon Key são obrigatórios`
**Solução:** Verificar arquivo .env

### C. Erro de TypeScript
**Sintoma:** Type errors no console
**Solução:** `npm run type-check`

### D. Porta em uso
**Sintoma:** `Port 5174 is already in use`
**Solução:** Matar processo ou mudar porta no vite.config.ts

## 📝 Checklist de Arquivos Críticos

- [x] index.html (corrigido - removido importmap)
- [x] index.tsx (entry point)
- [x] App.tsx (componente principal)
- [x] .env (variáveis de ambiente)
- [x] vite.config.ts (configuração)
- [x] tsconfig.json (TypeScript)
- [x] package.json (dependências)

## 🚀 Próximos Passos

1. Execute `npm run dev`
2. Abra http://localhost:5174
3. Se houver erro, copie a mensagem completa do console
4. Verifique se todas as dependências estão instaladas

## 🔧 Comandos Úteis

```bash
# Verificar erros de TypeScript
npm run type-check

# Verificar erros de lint
npm run lint

# Build de produção (testa se compila)
npm run build

# Preview do build
npm run preview
```

## 📊 Status Atual

- ✅ Estrutura de arquivos OK
- ✅ Configurações OK
- ✅ Variáveis de ambiente OK
- ⚠️ Precisa testar no navegador
