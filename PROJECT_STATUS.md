# 🏗️ Status do Projeto & Engenharia de Software

<div align="center">
  <img src="https://i.imgur.com/2CMQ6GJ.png" alt="Mansão Maromba Logo" width="160" />
  
  <br/>
  <br/>
  
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
  [![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
  [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
  [![Zustand](https://img.shields.io/badge/State-Zustand-orange?style=flat-square&logo=redux&logoColor=white)](https://github.com/pmndrs/zustand)
  [![Tailwind CSS](https://img.shields.io/badge/Style-Tailwind_3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
  [![Vitest](https://img.shields.io/badge/Test-Vitest-729B1B?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev)
  [![Playwright](https://img.shields.io/badge/E2E-Playwright-45BA4B?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev)

</div>

---

## 📐 Engenharia & Arquitetura

O projeto adota uma arquitetura **Feature-First** híbrida com **Type-Based**, focada em escalabilidade e manutenção a longo prazo.

### 1. Gerenciamento de Estado (Híbrido)
- **Global Client State (Zustand):** Utilizado para o Carrinho de Compras (`useCart.ts`).
  - *Feature:* Persistência automática no LocalStorage (`persist` middleware).
  - *Feature:* Controle de hidratação (`onRehydrateStorage`) para evitar erros de SSR/Hydration.
- **Server State (TanStack Query):** Gerenciamento de cache e sincronização com o Supabase.
  - *Feature:* Cache inteligente, refetch on focus e tratamento de estados de loading/error.

### 2. Backend-as-a-Service (Supabase)
A lógica de negócios crítica foi movida para o banco de dados, garantindo segurança independente do frontend.
- **RBAC (Role-Based Access Control):** Implementado via tabelas SQL (`user_profiles`) e Policies.
- **RLS (Row Level Security):** Regras estritas no PostgreSQL impedem que clientes alterem preços ou acessem dados administrativos.
- **Edge Functions:** Webhooks para processamento de pagamentos e envio de emails.
- **Database Optimization:** Índices estratégicos e Views Materializadas para relatórios de performance.

### 3. Segurança (Enterprise Level)
- **Input Validation (Zod):** Schemas rigorosos para prevenir injeção de dados inválidos.
- **Sanitização:** Proteção contra XSS e SQL Injection nativa do Supabase e validações extras no frontend.
- **Autenticação:** Fluxo OAuth (Google) e Magic Links integrados.

### 4. Estrutura de Pastas
Organização **Flat (Raiz)** moderna, eliminando aninhamento desnecessário (`src/`) para simplificar imports e manutenção:
```
src/
├── components/   # UI Components (Atomic Design simplificado)
├── hooks/        # Lógica abstraída (useCart, useAuth, useOrders)
├── lib/          # Configurações de libs (Zod, QueryClient)
├── store/        # Stores globais (Zustand)
├── types/        # Definições TypeScript compartilhadas
└── utils/        # Funções puras (Formatadores, Validadores)
```

---

## 🚀 Funcionalidades Implementadas

### 🛒 Experiência de Compra
| Feature | Status | Detalhes Técnicos |
|---------|--------|-------------------|
| **Carrinho Persistente** | ✅ Pronto | `zustand/persist`, lógica de merge de itens duplicados. |
| **Busca de CEP** | ✅ Pronto | Integração `viacep.ts` com limpeza de input e tratamento de erros. |
| **Checkout** | ✅ Pronto | Validação Zod em 3 etapas, cálculo de totais. |
| **Catálogo 3D** | ✅ Pronto | Carrossel interativo e animações Framer Motion. |

### 🔐 Autenticação & Usuários
| Feature | Status | Detalhes Técnicos |
|---------|--------|-------------------|
| **Login Social** | ✅ Pronto | Google OAuth via Supabase Auth. |
| **Proteção de Rotas** | ✅ Pronto | HOCs e Hooks para verificar sessão e roles. |
| **Perfil de Usuário** | ✅ Pronto | Sincronização automática via Triggers no PostgreSQL. |

### 👑 Painel Administrativo (Backoffice)
| Feature | Status | Detalhes Técnicos |
|---------|--------|-------------------|
| **Gestão de Produtos** | ✅ Pronto | CRUD completo com RLS policies (apenas admins). |
| **Upload de Imagens** | ✅ Pronto | Supabase Storage com bucket público e policies de upload. |
| **Dashboard** | ✅ Pronto | Views materializadas para estatísticas de vendas em tempo real. |
| **Gestão de Pedidos** | ✅ Pronto | Fluxo de status (Pendente -> Enviado -> Entregue). |

### ⚙️ Infraestrutura & DevOps
| Feature | Status | Detalhes Técnicos |
|---------|--------|-------------------|
| **Testes Unitários** | ✅ Configurado | Vitest configurado com JSDOM. |
| **Testes E2E** | ⚠️ Ajustar | Playwright configurado (Atenção: porta 3001 vs 5173). |
| **CI/CD** | ✅ Pronto | Configuração base para Vercel/GitHub Actions. |
| **Banco de Dados** | ✅ Otimizado | Índices criados para queries de alta frequência. |

---

## 📊 Métricas de Qualidade de Código

- **Tipagem:** 100% TypeScript (Strict Mode).
- **Performance:**
  - Bundle otimizado com Vite.
  - Lazy loading de rotas e componentes pesados.
  - Remoção de `React.StrictMode` em produção para evitar double-render desnecessário.
- **Documentação:**
  - Cobertura extensa de setup (`.md` files).
  - Guias de segurança e escalabilidade incluídos no repositório.

---

## 🛠️ Próximos Passos (Roadmap Técnico)

1. **Correção E2E:** Ajustar porta do Playwright (`3001` -> `5173`) para rodar na pipeline.
2. **Monitoramento:** Integrar Sentry para tracking de erros em produção.
3. **PWA:** Configurar Service Workers para funcionamento offline.
4. **Pagamentos:** Implementar Webhook do Stripe/Mercado Pago nas Edge Functions já preparadas.

---

<div align="center">
  <strong>Relatório gerado automaticamente com base na análise estática do código-fonte.</strong>
</div>