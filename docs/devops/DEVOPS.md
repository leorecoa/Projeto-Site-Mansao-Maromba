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

- Push
- Pull request

Etapas recomendadas:

- Instalar dependencias
- Executar lint
- Executar type-check
- Executar testes
- Gerar build

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
```

## Comandos uteis locais

```bash
npm run lint
npm run type-check
npm test
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
- Manter segredos apenas no GitHub/Vercel/Supabase (nunca no repositorio)

## Solucao de problemas

### CI falhando

- Rode localmente `lint`, `type-check` e testes
- Compare versao do Node local com a do fluxo

### Deploy falhando

- Verifique segredos obrigatorios
- Verifique logs do fluxo e da Vercel
- Confirme que variaveis de ambiente da Vercel estao corretas
