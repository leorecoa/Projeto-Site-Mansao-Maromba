# Mansao Maromba - E-commerce Full Stack

Aplicacao de e-commerce com foco em robustez de fluxo (auth, checkout, admin), seguranca e qualidade de entrega.

## Visao Geral
- Frontend em React + TypeScript + Vite.
- Backend em Supabase (Postgres, Auth, Storage, Edge Functions).
- Area administrativa com RBAC.
- Checkout com criacao transacional de pedidos.
- CI com type-check, testes e gate E2E de resiliencia.

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

### Qualidade
- Vitest (unit/integration)
- Playwright (E2E)
- GitHub Actions (CI)

## Funcionalidades Implementadas
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

## Arquitetura e Regras de Dominio
Documentacao aprofundada:
- `TECHNICAL_DEEP_DIVE.md`

Pontos principais:
- Fluxo transacional de checkout no banco.
- Controle de concorrencia com lock de linha (`FOR UPDATE`) no SQL.
- Guardas de consistencia de status de pedido.
- Webhook com assinatura HMAC e tratamento idempotente.
- Observabilidade com logs estruturados e eventos de funil.

## Estrutura de Pastas
```txt
components/          UI por dominio (auth, checkout, admin, layout, feedback)
hooks/               Regras de cliente e integracao com backend
pages/               Rotas da aplicacao
services/            Clientes de infraestrutura (Supabase)
store/               Estado global (Zustand)
supabase/functions/  Edge Functions
tests/               Unit, integration e E2E
utils/               Logger, erros, observabilidade e helpers
```

## Configuracao Local
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

## Scripts
```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run type-check
npm test
npm run test:e2e
```

## Testes e CI
### Testes locais
- Unit/integration: `npm test`
- E2E: `npm run test:e2e`

### CI
Workflow em `.github/workflows/ci.yml`:
- lint + type-check + build
- suite de testes
- gate E2E de ErrorBoundary (com artifact do Playwright)

## Seguranca
- RBAC para area admin (`user_profiles.role`).
- Service role restrita ao backend/edge (nao usar no frontend).
- Webhook com validacao de assinatura.
- Sanitizacao/validacao de entrada e tratamento de erro consistente.

## Limites Conhecidos
- Parte do pagamento ainda esta simplificada e deve evoluir para confirmacao full webhook-first.
- Observabilidade pode evoluir com stack dedicada (ex.: Sentry + dashboard de funil).

## Responsabilidade Tecnica e Uso de AI
Projeto desenvolvido por humano com apoio de AI para acelerar analise, codificacao e revisao.

Responsabilidade final de arquitetura, seguranca, qualidade e decisao tecnica e integralmente humana.

## Autor
- Leandro Jesse
- GitHub: `leorecoa`

---
Se quiser contexto de arquitetura para entrevista senior, leia `TECHNICAL_DEEP_DIVE.md`.
