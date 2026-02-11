# 🏋️‍♂️ Mansão Maromba - E-commerce Premium

<div align="center">
  <img src="https://i.imgur.com/2CMQ6GJ.png" alt="Mansão Maromba Logo" width="160" />
  
  <br/>
  <br/>
  
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
  [![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
  [![Supabase](https://img.shields.io/badge/Supabase-Latest-3FCF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
  [![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
  
  **E-commerce moderno de bebidas premium com arquitetura escalável e segurança robusta**
  
  [Demo ao Vivo](https://projeto-site-mansao-maromba.vercel.app) · [Reportar Bug](https://github.com/leorecoa/Projeto-Site-Mansao-Maromba/issues) · [Solicitar Feature](https://github.com/leorecoa/Projeto-Site-Mansao-Maromba/issues)

</div>

---

## 🎯 Sobre o Projeto

**Mansão Maromba** é um e-commerce premium desenvolvido com as mais modernas tecnologias web, focado em performance, segurança e experiência do usuário. O projeto demonstra arquitetura profissional com separação de responsabilidades, state management avançado e práticas de segurança enterprise-level.

### ✨ Destaques

- 🎨 **Design Imersivo** - Interface moderna com animações 3D e temas dinâmicos
- ⚡ **Performance Excepcional** - Bundle otimizado (150KB gzipped) e cache inteligente
- 🔒 **Segurança Robusta** - RBAC, input validation e proteção contra SQL Injection/XSS
- 📱 **Totalmente Responsivo** - Mobile-first design (375px - 4K)
- 🚀 **Escalável** - Arquitetura preparada para crescimento

---

## 🛠️ Stack Tecnológica

### **Frontend**
- **React 19** - Framework com Server Components
- **TypeScript 5.8** - Tipagem estática e segurança
- **Vite 6.4** - Build tool ultra-rápido
- **Tailwind CSS 3.4** - Estilização utility-first
- **Framer Motion 11** - Animações fluidas
- **Zustand 4.5** - State management leve e performático
- **TanStack Query** - Cache e sincronização de dados

### **Backend & Infraestrutura**
- **Supabase** - Backend-as-a-Service (PostgreSQL 16)
- **Supabase Auth** - Autenticação JWT + OAuth (Google)
- **Supabase Storage** - CDN global para imagens
- **Vercel** - Deploy serverless com Edge Functions
- **Zod** - Validação de schemas runtime

### **Segurança**
- **RBAC** - Role-Based Access Control
- **RLS Policies** - Row Level Security no Supabase
- **Input Validation** - Zod schemas em todas as entradas
- **XSS Protection** - Sanitização automática
- **SQL Injection Prevention** - Prepared statements

---

## 🚀 Funcionalidades

### 🔐 **Autenticação & Autorização**
- ✅ Login com email/senha
- ✅ Google OAuth integrado
- ✅ Sessões persistentes com refresh automático
- ✅ Sistema de roles (Admin/Customer)
- ✅ Rotas protegidas com middleware

### 🛒 **E-commerce Completo**
- ✅ Carrinho inteligente com persistência (LocalStorage)
- ✅ Checkout em 3 etapas (Resumo → Entrega → Pagamento)
- ✅ Histórico de pedidos com status tracking
- ✅ Integração completa com Supabase
- ✅ Validação de dados em tempo real

### 👑 **Painel Administrativo**
- ✅ CRUD completo de produtos
- ✅ Upload de imagens (arquivo ou URL)
- ✅ Preview em tempo real
- ✅ Dashboard com estatísticas
- ✅ Gestão de pedidos
- ✅ Proteção RBAC (apenas admins)

### 🎨 **Experiência Visual**
- ✅ Carrossel 3D interativo
- ✅ Temas dinâmicos por produto
- ✅ Glassmorphism & Neumorphism
- ✅ Animações com Framer Motion
- ✅ Splash screen customizada
- ✅ Transições suaves entre páginas

### ⚡ **Performance**
- ✅ Cache automático (React Query)
- ✅ Code splitting automático
- ✅ Lazy loading de imagens
- ✅ Bundle otimizado (150KB gzipped)
- ✅ CDN global (Vercel Edge)

---

## 📁 Estrutura do Projeto

```
mansao-maromba/
├── components/
│   ├── admin/          # Painel administrativo
│   ├── auth/           # Login, OAuth callback
│   ├── checkout/       # Checkout e histórico de pedidos
│   ├── feedback/       # Modais, loading, splash screen
│   └── layout/         # Navbar, Footer
├── hooks/
│   ├── useAuth.ts      # Autenticação + RBAC
│   ├── useCart.ts      # Gerenciamento do carrinho
│   ├── useOrders.ts    # Pedidos com React Query
│   ├── useProducts.ts  # Produtos com cache
│   ├── useNavigation.ts # Navegação SPA
│   └── useUploadImage.ts # Upload para Supabase Storage
├── lib/
│   ├── queryClient.ts  # Configuração React Query
│   └── validations.ts  # Schemas Zod
├── sections/           # Seções da landing page
├── services/
│   └── supabase.ts     # Cliente Supabase
├── store/
│   └── index.ts        # Zustand store (carrinho)
├── types/
│   └── index.ts        # TypeScript definitions
├── supabase_*.sql      # Migrations e schemas
└── SECURITY_SETUP.md   # Guia de configuração de segurança
```

---

## 🔧 Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase
- Conta no Vercel (para deploy)

### **1. Clonar o Repositório**
```bash
git clone https://github.com/leorecoa/Projeto-Site-Mansao-Maromba.git
cd Projeto-Site-Mansao-Maromba
```

### **2. Instalar Dependências**
```bash
npm install
```

### **3. Configurar Variáveis de Ambiente**
```bash
cp .env.example .env.local
```

Edite `.env.local`:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
VITE_GOOGLE_OAUTH_CLIENT_ID=seu-client-id-google
```

### **4. Configurar Supabase**

Execute os SQLs na ordem:
1. `supabase_schema.sql` - Estrutura base
2. `supabase_products.sql` - Tabela de produtos
3. `supabase_orders.sql` - Sistema de pedidos
4. `supabase_storage.sql` - Bucket de imagens
5. `supabase_rbac.sql` - Sistema de roles

**Tornar seu usuário admin:**
```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'seu-email@gmail.com';
```

### **5. Iniciar Desenvolvimento**
```bash
npm run dev
```

Acesse: `http://localhost:5173`

### **6. Build para Produção**
```bash
npm run build
npm run preview
```

---

## 🔒 Segurança

### **Proteções Implementadas**

#### **RBAC (Role-Based Access Control)**
```typescript
// Apenas admins podem acessar /admin
const { isAdmin } = useAuth()
if (!isAdmin) return <AccessDenied />
```

#### **Input Validation (Zod)**
```typescript
// Validação automática de todos os inputs
const checkoutSchema = z.object({
  customer_name: z.string().min(3).max(100).regex(/^[a-zA-Z\s]+$/),
  customer_email: z.string().email(),
  customer_phone: z.string().regex(/^\d{10,11}$/),
  // ... mais validações
})
```

#### **RLS Policies (Supabase)**
```sql
-- Apenas admins podem criar produtos
CREATE POLICY "Only admins can insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (is_admin(auth.uid()));
```

### **Ataques Bloqueados**
- ❌ SQL Injection
- ❌ XSS (Cross-Site Scripting)
- ❌ CSRF (Cross-Site Request Forgery)
- ❌ Acesso não autorizado a rotas admin
- ❌ Manipulação de dados no cliente

---

## 📊 Performance

| Métrica | Valor | Status |
|---------|-------|--------|
| **Bundle Size** | 527 KB (150 KB gzipped) | ✅ Ótimo |
| **Build Time** | ~4s | ✅ Rápido |
| **LCP** | < 1.2s | ✅ Excelente |
| **CLS** | < 0.1 | ✅ Estável |
| **Cache Hit Rate** | ~95% | ✅ Eficiente |

---

## 🎨 Screenshots

<div align="center">
  <img src="https://via.placeholder.com/800x400/000000/FFFF00?text=Landing+Page" alt="Landing Page" width="800"/>
  <p><em>Landing Page com carrossel 3D</em></p>
  
  <img src="https://via.placeholder.com/800x400/000000/FFFF00?text=Admin+Panel" alt="Admin Panel" width="800"/>
  <p><em>Painel Administrativo</em></p>
  
  <img src="https://via.placeholder.com/800x400/000000/FFFF00?text=Checkout" alt="Checkout" width="800"/>
  <p><em>Checkout em 3 etapas</em></p>
</div>

---

## 🗺️ Roadmap

### **Fase 1 - MVP** ✅ Concluído
- [x] Landing page com carrossel 3D
- [x] Autenticação (Email + Google OAuth)
- [x] Carrinho de compras
- [x] Admin panel básico

### **Fase 2 - E-commerce** ✅ Concluído
- [x] Sistema de pedidos completo
- [x] Checkout em 3 etapas
- [x] Histórico de pedidos
- [x] Upload de imagens

### **Fase 3 - Segurança** ✅ Concluído
- [x] RBAC implementado
- [x] Input validation (Zod)
- [x] RLS policies
- [x] Proteção contra ataques

### **Fase 4 - Otimização** 🚧 Em Progresso
- [ ] Testes automatizados (Vitest + Playwright)
- [ ] Monitoramento (Sentry)
- [ ] PWA (Service Worker)
- [ ] Rate limiting

### **Fase 5 - Features Avançadas** 📋 Planejado
- [ ] Sistema de reviews
- [ ] Busca e filtros avançados
- [ ] Wishlist
- [ ] Integração de pagamento real (Stripe/Mercado Pago)
- [ ] Cálculo de frete
- [ ] Notificações por email

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona NovaFeature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

### **Padrões de Commit**
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Leandro Jessé**
- GitHub: [@leorecoa](https://github.com/leorecoa)
- Email: leorecoa2@gmail.com

---

## 🙏 Agradecimentos

- [React](https://react.dev) - Framework incrível
- [Supabase](https://supabase.com) - Backend poderoso
- [Vercel](https://vercel.com) - Deploy simplificado
- [Tailwind CSS](https://tailwindcss.com) - Estilização rápida
- [Framer Motion](https://www.framer.com/motion/) - Animações fluidas

---

<div align="center">
  <strong>Desenvolvido com ❤️ e ☕ por Leandro Jessé</strong>
  <br/>
  <br/>
  ⭐ Se este projeto te ajudou, considere dar uma estrela!
</div>
