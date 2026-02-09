# Mansão Maromba 🏋️‍♂️

<div align="center">
  <img src="https://i.imgur.com/2CMQ6GJ.png" alt="Mansão Maromba Logo" width="160" />
  
  <br/>
  
  ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
  ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
  ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
  ![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0+-0055FF?style=for-the-badge&logo=framer&logoColor=white)

</div>

## 🚀 Visão do Projeto

**Mansão Maromba** é uma experiência de e-commerce premium onde design, tecnologia e performance convergem para criar impacto visual imediato. Mais do que um site, é uma demonstração de como interfaces modernas devem funcionar: rápidas, imersivas e orientadas ao produto.

Cada componente foi arquitetado para:
- **Destacar produtos** como protagonistas visuais
- **Utilizar animações** com intenção estratégica, não como ruído
- **Manter performance excepcional** mesmo com efeitos 3D avançados
- **Sustentar escalabilidade** através de arquitetura limpa e padrões sólidos

---

## ✨ Funcionalidades Principais

### 🔐 **Autenticação & Segurança**
- ✅ Login com email/senha
- ✅ Autenticação social via Google OAuth
- ✅ Persistência de sessão com refresh automático
- ✅ Rotas protegidas com middleware de autorização

### 🛒 **Núcleo E-commerce**
- 🛍️ **Carrinho inteligente** com Context API + LocalStorage
- 📦 **CRUD completo** de produtos
- 👑 **Painel administrativo** com gestão de estoque
- 💳 **Fluxo de checkout** simulado (UI/UX completa)

### 🎨 **Experiência Visual Avançada**
- 🌀 **Carrossel 3D interativo** com Framer Motion
- 🎭 **Temas dinâmicos** por categoria de produto
- ✨ **Efeitos Glassmorphism & Neumorphism**
- 📱 **Design responsivo** mobile-first (375px - 4K)

### 🤖 **Camada de Inteligência**
- 🧠 **IA como orquestrador** de experiência (não como ator principal)
- ⚡ **Aceleração de decisões** UX com análise preditiva
- 🎯 **Validação automática** de padrões de design
- 🔄 **Refinamento contínuo** baseado em interações

---

## 🏗️ Arquitetura Técnica

### **Frontend**
| Tecnologia | Versão | Finalidade |
|------------|---------|------------|
| React | 19.0+ | Core framework com React Server Components |
| TypeScript | 5.0+ | Tipagem estática e segurança |
| Vite | 5.0+ | Build tool e dev environment |
| Tailwind CSS | 3.4+ | Estilização utility-first |
| Framer Motion | 11.0+ | Animações e transições |
| React Router | 6.20+ | Navegação client-side |

### **Backend & Infra**
| Camada | Tecnologia | Descrição |
|---------|------------|------------|
| **Banco de Dados** | PostgreSQL (Supabase) | Schema relacional com RLS |
| **Autenticação** | Supabase Auth | JWT, OAuth, sessions |
| **API** | Supabase REST/GraphQL | Endpoints auto-gerados |
| **Storage** | Supabase Storage | CDN para imagens e mídia |
| **Deploy** | Vercel Edge Functions | Serverless global deployment |
| **CI/CD** | Vercel + GitHub Actions | Pipeline automatizado |

### **Performance**
- ⚡ **LCP**: < 1.2s (imagens otimizadas com lazy loading)
- 🎯 **CLS**: < 0.1 (layout estável)
- 📦 **Bundle size**: < 150kb (code splitting automático)
- 🌐 **Cache**: CDN global (Vercel Edge Network)

---

## 📁 Estrutura do Projeto

```
mansao-maromba/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   │   ├── ui/        # Componentes primitivos (Button, Card, etc.)
│   │   ├── layout/    # Componentes de layout (Header, Footer)
│   │   └── features/  # Componentes específicos (ProductCarousel, Cart)
│   ├── hooks/         # Custom React hooks
│   ├── context/       # Context API providers (Cart, Auth)
│   ├── lib/           # Utilitários e configurações (supabase, utils)
│   ├── pages/         # Páginas da aplicação
│   ├── styles/        # Estilos globais e Tailwind config
│   └── types/         # TypeScript definitions
├── public/            # Assets estáticos
├── supabase/          # Migrations e schemas SQL
└── tests/             # Testes unitários e e2e
```

---

## 🚀 Instalação Local

```bash
# 1. Clonar repositório
git clone https://github.com/leorecoa/Projeto-Site-Mansao-Maromba.git
cd Projeto-Site-Mansao-Maromba

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais do Supabase

# 4. Iniciar ambiente de desenvolvimento
npm run dev

# 5. Para build de produção
npm run build
npm run preview
```

## 🔧 Variáveis de Ambiente

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_OAUTH_CLIENT_ID=your-google-client-id
```

---

## 📊 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Cria build de produção |
| `npm run preview` | Previsualiza build localmente |
| `npm run lint` | Executa ESLint para análise de código |
| `npm run format` | Formata código com Prettier |

---

## 🤝 Contribuição

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <strong>Design First • Arquitetura Sólida • Execução Precisa</strong>
  <br/>
  <br/>
  Desenvolvido com ❤️ por <a href="https://github.com/leorecoa">Leonardo Recoaro</a>
</div>
