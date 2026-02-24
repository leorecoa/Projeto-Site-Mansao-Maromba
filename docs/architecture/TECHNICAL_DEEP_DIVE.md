# Arquitetura tecnica - Mansao Maromba

## 1. Contexto e objetivos

Este projeto foi desenhado como um e-commerce full-stack com foco em:

- consistencia transacional no checkout;
- seguranca no fluxo de autenticacao, admin e webhook;
- operabilidade (logs, eventos e testes E2E);
- escalabilidade de codigo e de dominio.

## 2. Decisoes arquiteturais

### Frontend

- React + TypeScript + Vite para produtividade e build rapido.
- Estado local com Zustand (carrinho/toast) e dados remotos com React Query.
- Rotas protegidas com `ProtectedRoute` e `AdminRoute`.
- Auth desacoplado no hook `useAuth` para concentrar sessao/perfil/role.

### Backend

- Supabase como BaaS: Postgres, Auth, Armazenamento e Edge Functions.
- Regra critica do negocio no banco (RPC/functions SQL), nao no cliente.
- Edge Functions para integracoes externas e operacoes sensiveis:
  - `process-order`
  - `payment-webhook`

## 3. Fluxo de checkout e atomicidade

O checkout cria pedido via RPC `create_order(...)` no Postgres.

### Garantias implementadas

- transacao unica para criacao de pedido + itens + baixa de estoque;
- lock de linha de produto com `FOR UPDATE` para evitar overselling;
- validacao de disponibilidade/estoque no backend;
- rollback automatico em qualquer falha.

### Resultado

Se um passo falha (produto indisponivel, erro de insercao, etc.), nada parcial fica persistido.

## 4. Concorrencia e idempotencia

### Concorrencia

- No SQL, `FOR UPDATE` serializa disputa por mesmo estoque.
- No auth, ajustes para nao bloquear login por consulta lenta de perfil.

### Idempotencia

- Webhook de pagamento com assinatura HMAC + comparacao em tempo constante.
- Guardas em webhook para ignorar eventos repetidos em status final/avancado.
- Cancelamento com reembolso de wallet protegido por chave de idempotencia por `order_id` em metadata.

## 5. Consistencia de dominio

### Maquina de estados de pedido

Transicoes validas definidas no backend (`update_order_status`):

- `pending -> confirmed|cancelled`
- `paid -> confirmed|cancelled`
- `confirmed -> processing|cancelled`
- `processing -> shipped|cancelled`
- `shipped -> delivered`

Transicoes invalidas sao recusadas no servidor.

### Regras de cancelamento

- bloqueio de cancelamento apos envio/entrega;
- devolucao de estoque dos itens do pedido;
- reembolso automatico de wallet quando aplicavel, com idempotencia.

## 6. Seguranca aplicada

### Auth e acesso

- Supabase Auth (email/senha + Google OAuth).
- Callback OAuth endurecido contra estados intermediarios e erros de redirect.
- RBAC por perfil (`user_profiles.role`) para rotas admin.

### Dados e infraestrutura

- Service role apenas em backend/edge (nunca frontend).
- RLS no banco para isolamento por usuario.
- Validacao de entrada com schemas.
- Webhook validado por assinatura.

## 7. Observabilidade

### Logs estruturados

Edge Functions registram eventos em JSON com:

- `request_id`
- `event`
- `order_id` (quando aplicavel)
- status/erro

### Eventos de produto/funil

No frontend, tracking de eventos de checkout/pagamento:

- `checkout_started`
- `checkout_order_created`
- `checkout_failed`
- `payment_started`
- `payment_marked_paid`
- `payment_failed`

Isso permite medir conversao e diagnosticar abandono por etapa.

## 8. Qualidade e regressao

- Type-check como gate.
- E2E com Playwright para auth/admin/checkout.
- Teste de ErrorBoundary como gate de resiliencia no CI.

## 9. Trade-offs e proximos passos

### Trade-offs atuais

- Simulacao de pagamento ainda simplificada em parte do frontend.
- Observabilidade sem stack dedicada (ex.: Sentry) em todos os pontos.

### Evolucao recomendada

- consolidar pagamentos totalmente event-driven por webhook;
- adicionar painel de metricas de funil e latencia;
- testes de carga para cenarios de concorrencia de estoque;
- runbooks de incidentes e SLO por modulo critico.

## 10. Resumo para entrevista senior

Este projeto demonstra:

- desenho transacional orientado a consistencia;
- fronteira clara entre regra de negocio (backend) e apresentacao (frontend);
- mitigacao de concorrencia/idempotencia em pontos de risco;
- seguranca pragmatica para auth, webhook e administracao;
- trilha de observabilidade para operacao de produto.
