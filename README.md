# Mansao Maromba - E-commerce Full Stack

<div align="center">

[![CI](https://github.com/leorecoa/Projeto-Site-Mansao-Maromba/actions/workflows/ci.yml/badge.svg)](https://github.com/leorecoa/Projeto-Site-Mansao-Maromba/actions/workflows/ci.yml)
[![Deploy](https://github.com/leorecoa/Projeto-Site-Mansao-Maromba/actions/workflows/deploy.yml/badge.svg)](https://github.com/leorecoa/Projeto-Site-Mansao-Maromba/actions/workflows/deploy.yml)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Testes-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev/)

</div>

## Overview

Aplicacao de e-commerce com foco em robustez de fluxo (auth, checkout, admin), seguranca e qualidade de entrega.

## Demo

- Live: `https://projeto-site-mansao-maromba.vercel.app/`
- Repository: `https://github.com/leorecoa/Projeto-Site-Mansao-Maromba`

## Architectural Decisions

- Supabase como backend para reduzir boilerplate sem perder controle SQL.
- Checkout via RPC SQL (`create_order`) para atomicidade transacional.
- RLS + RBAC para isolamento de acesso e protecao da area admin.
- Edge Functions para operacoes sensiveis e integracoes externas.
- ErrorBoundary global para resiliencia da UI.

## Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- TanStack Query
- Tailwind CSS

### Backend e plataforma

- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Supabase Edge Functions (`process-order`, `payment-webhook`, `send-email`)

## Features

### Autenticacao

- Login por email/senha.
- Login com Google OAuth.
- Callback OAuth endurecido (tratamento de erro e redirect).
- Fluxo de login ajustado para reduzir latencia percebida.
- Cadastro com feedback robusto e tratamento de erros comuns.

### Loja e checkout

- Catalogo e detalhes de produto.
- Carrinho com persistencia local.
- Checkout com criacao de pedido via RPC SQL (`create_order`).
- Validacao de estoque no backend.
- Pagina de sucesso com `orderId`.

### Admin

- Rotas protegidas para admins.
- CRUD de produtos.
- Upload de imagem com validacao de tipo/tamanho e bucket configuravel.
- Gestao de pedidos.

### UX e resiliencia

- Paginas institucionais: Termos, Privacidade, FAQ.
- Pagina 404 e pagina de erro.
- ErrorBoundary global para falhas inesperadas na UI.

## Security

- RBAC para area admin (`user_profiles.role`).
- Service role restrita ao backend/edge (nao usar no frontend).
- Webhook com validacao de assinatura.
- Sanitizacao/validacao de entrada e tratamento de erro consistente.

## Quality

### Testes locais

- Unit/integration: `npm test`
- E2E: `npm run test:e2e`

### CI

Workflow em `.github/workflows/ci.yml`:

- lint + type-check + build
- suite de testes
- gate E2E de ErrorBoundary (com artifact do Playwright)

## Setup

### 1) Instalar dependencias

```bash
npm install
```

### 2) Variaveis de ambiente

Crie `.env` baseado em `.env.example`.

Minimo para rodar frontend:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Para admin upload:

```env
VITE_SUPABASE_PRODUCTS_BUCKET=product-images
VITE_PRODUCTS_ALLOWED_MIME_TYPES=image/jpeg,image/png,image/webp,image/gif
VITE_PRODUCTS_MAX_FILE_SIZE_MB=5
```

### 3) Rodar projeto

```bash
npm run dev
```

### Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run type-check
npm test
npm run test:e2e
```

## Documentation

- Indice geral: `docs/README.md`
- Arquitetura: `docs/architecture/TECHNICAL_DEEP_DIVE.md`
- Backend e Supabase: `docs/backend/`
- DevOps e ambientes: `docs/devops/`
- Testes: `docs/testing/`
- Analytics: `docs/analytics/`

## Limits

- Parte do pagamento ainda esta simplificada e deve evoluir para confirmacao full webhook-first.
- Observabilidade pode evoluir com stack dedicada (ex.: Sentry + painel de funil).

## AI Use

Uso de AI como ferramenta de aceleracao em analise, implementacao e revisao, mantendo responsabilidade integral sobre arquitetura e decisoes criticas.

## Author

- Leandro Jesse
- GitHub: `leorecoa`

## License

Projeto para portfolio e estudo. Defina uma licenca explicita se for abrir contribuicao publica.

---

Se quiser contexto de arquitetura para entrevista senior, leia `docs/architecture/TECHNICAL_DEEP_DIVE.md`.
