# Configuracao de Ambientes

## Ambientes

### Producao

- URL: `https://projeto-site-mansao-maromba.vercel.app`
- Branch principal: `main`
- Objetivo: trafego real de usuarios

### Homologacao (preview)

- URL: gerada automaticamente por PR
- Branches: pull requests
- Objetivo: validar mudancas antes de merge

### Desenvolvimento

- URL local: `http://localhost:5173`
- Branch sugerida: `develop` (ou branches de funcionalidade)
- Objetivo: implementacao e testes locais

## Segredos obrigatorios

Configure no GitHub:
`Configuracoes -> Secrets and variables -> Actions`

### Vercel

```env
VERCEL_TOKEN=seu-token
VERCEL_ORG_ID=seu-org-id
VERCEL_PROJECT_ID=seu-project-id
```

### Supabase

```env
VITE_SUPABASE_URL=https://ftgzoulanmsrmujtgrvj.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

## Fluxo de publicacao

### Producao

`push em main -> CI -> build -> deploy em producao`

### Preview

`abrir PR -> CI -> build -> deploy de preview -> URL no PR`

### Desenvolvimento

`npm run dev -> validacao local -> push para branch`

## Workflows de CI/CD

### CI

- Arquivo: `.github/workflows/ci.yml`
- Execucao: push/PR
- Etapas: lint, type-check, build, testes

### Preview

- Arquivo: `.github/workflows/preview.yml`
- Execucao: pull requests
- Etapas: build e publicacao de preview

### CD/publicacao

- Arquivos: `.github/workflows/cd.yml` e/ou `.github/workflows/deploy.yml`
- Execucao: push em `main`
- Etapas: publicacao em producao

## Variaveis por ambiente

### Local (`.env.local`)

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_ENVIRONMENT=development
```

### Producao (`.env.production`)

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_ENVIRONMENT=production
```

## Checklist rapido

- [ ] Segredos configurados no GitHub
- [ ] Projeto Vercel conectado ao repositorio
- [ ] CI verde no PR
- [ ] preview validado antes do merge
- [ ] publicacao de producao confirmado apos merge

## Problemas comuns

### Falha no preview

- Verifique segredos da Vercel
- Verifique permissao do token
- Verifique logs do fluxo no GitHub Actions

### Falha no publicacao de producao

- Confirme que a CI passou
- Verifique variaveis de ambiente de producao
- Verifique logs da Vercel e do fluxo de CD
