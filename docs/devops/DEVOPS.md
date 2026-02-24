# DevOps e CI/CD

## Visao geral

Este projeto usa GitHub Actions para validar codigo e automatizar publicacao.

Objetivos principais:

- Garantir qualidade minima antes de merge
- Publicar preview por pull request
- Publicar producao apos merge na branch principal

## Fluxos existentes

- CI: `.github/workflows/ci.yml`
- Preview: `.github/workflows/preview.yml`
- CD/publicacao: `.github/workflows/cd.yml` e `.github/workflows/deploy.yml`

## CI

Gatilhos:

- Push em `main` e `develop`
- Pull request para `main` e `develop`

Jobs atuais:

### 1) `lint-and-typecheck`

- Checkout
- Setup Node 20
- Instalacao limpa de dependencias
- `npm run lint`
- `npm run format:check`
- `npm run env:check`
- `npm run secrets:scan`
- `npx tsc --noEmit`
- `npm run build`

### 2) `test`

- Checkout
- Setup Node 20
- Instalacao limpa de dependencias
- `npm run test:coverage`

### 3) `e2e-critical-checkout`

- Roda apos `lint-and-typecheck` e `test`
- Instala Chromium do Playwright
- Gera `storageState` fallback
- Executa checkout critico:
  - `npx playwright test tests/e2e/checkout.spec.ts --project=chromium --no-deps`

### 4) `e2e-error-boundary-gate`

- Roda apos `lint-and-typecheck`, `test` e `e2e-critical-checkout`
- So executa se houver secrets obrigatorias
- Executa gate de ErrorBoundary (publico + admin)
- Publica artifact do Playwright quando executado

### 5) `e2e-smoke-pr`

- Executa apenas em evento de pull request
- Roda smoke do checkout nao autenticado
- Serve como validacao rapida para PRs

## Preview

Gatilho:

- Pull request aberto/atualizado

Resultado esperado:

- URL de preview disponivel para revisao
- Validacao funcional antes do merge

## Producao

Gatilho:

- Merge/push em `main`

Resultado esperado:

- Publicacao automatica em producao
- Rastreabilidade via logs no GitHub Actions e Vercel

## Segredos necessarios

GitHub:
`Configuracoes -> Secrets and variables -> Actions`

Exemplo:

```env
VERCEL_TOKEN=...
VERCEL_ORG_ID=...
VERCEL_PROJECT_ID=...
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
```

Observacao:

- Sem `ADMIN_EMAIL` e `ADMIN_PASSWORD`, o job `e2e-error-boundary-gate` e pulado.

## Comandos uteis locais

```bash
npm run lint
npm run format:check
npm run env:check
npm run secrets:scan
npm run type-check
npm test
npm run test:coverage
npm run build
npm run preview
```

## Monitoramento

- GitHub Actions: status dos jobs e logs
- Vercel: status de build/deploy e logs de execucao
- Supabase: logs de banco e edge functions

## Boas praticas

- Nao fazer merge com CI vermelha
- Validar preview antes de mergear
- Proteger branch `main` com regras de revisao
- Padronizar commits em Conventional Commits com Commitlint
- Manter segredos apenas no GitHub/Vercel/Supabase (nunca no repositorio)

## Solucao de problemas

### CI falhando

- Rode localmente `lint`, `format:check`, `type-check` e testes
- Compare versao do Node local com a do fluxo

### Deploy falhando

- Verifique segredos obrigatorios
- Verifique logs do fluxo e da Vercel
- Confirme que variaveis de ambiente da Vercel estao corretas
