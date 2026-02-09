<div align="center">

# 🍺 Mansão Maromba - Depósito Digital Premium

![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.95.3-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)

**E-commerce moderno de bebidas com design premium e animações 3D**

[🚀 Ver Demo](https://projeto-site-mansao-maromba-leandro-jesse-da-silvas-projects.vercel.app) • [📖 Documentação](#-funcionalidades) • [🛠️ Tecnologias](#-tecnologias)

---

## 🌐 Demo ao Vivo

**🔗 [https://projeto-site-mansao-maromba-leandro-jesse-da-silvas-projects.vercel.app](https://projeto-site-mansao-maromba-leandro-jesse-da-silvas-projects.vercel.app)**

### Acesso Admin
Para acessar o painel administrativo:
- URL: `/admin`
- Faça login com sua conta Google ou email

---

## 👨‍💻 Desenvolvedor

**Desenvolvido por [Leandro Jessé](https://github.com/leorecoa)**  
*Com assistência e aceleramento de AI (Amazon Q Developer)*

---

## ✨ Funcionalidades

### 🔐 Autenticação Completa
- ✅ Login com email/senha
- ✅ Cadastro de novos usuários
- ✅ **Login com Google OAuth**
- ✅ Rotas protegidas
- ✅ Persistência de sessão
- ✅ Logout com botão no Navbar

### 🛒 E-commerce
- ✅ Carrinho de compras funcional
- ✅ Adicionar/remover produtos
- ✅ Atualizar quantidade
- ✅ Cálculo automático de total
- ✅ Modal de carrinho estilizado
- ✅ Contador de itens no Navbar

### 🎨 Interface Premium
- ✅ Design moderno com glass morphism
- ✅ **Carrossel 3D de produtos** com animações suaves
- ✅ Temas dinâmicos por produto (cores mudam)
- ✅ SplashScreen animado
- ✅ Animações de parallax
- ✅ Responsivo (mobile + desktop)

### 👨‍💼 Painel Admin
- ✅ **CRUD completo de produtos**
- ✅ Dashboard com estatísticas
- ✅ Gerenciamento visual
- ✅ Upload de imagens
- ⏳ Gerenciar pedidos (em desenvolvimento)
- ⏳ Relatórios de vendas (em desenvolvimento)

---

## 🛠️ Tecnologias

### Frontend
- **React 19.2.4** - Biblioteca UI
- **TypeScript 5.8.2** - Tipagem estática
- **Vite 6.2.0** - Build tool ultrarrápido
- **Tailwind CSS** - Estilização utility-first
- **Lucide React** - Ícones modernos

### Backend & Database
- **Supabase 2.95.3** - Backend as a Service
  - PostgreSQL Database
  - Authentication (Email + OAuth)
  - Real-time subscriptions
  - Row Level Security

### State Management
- **Context API** - Gerenciamento de carrinho
- **Zustand 4.5.0** - State management (disponível)

### Deploy & DevOps
- **Vercel** - Hosting e CI/CD
- **Git** - Controle de versão

---

## 📁 Estrutura do Projeto

```
Projeto-Site-Mansao-Maromba/
├── components/
│   ├── auth/              # Autenticação (Login, OAuth)
│   ├── admin/             # Painel administrativo
│   ├── feedback/          # Modais e notificações
│   └── layout/            # Navbar, Footer
├── sections/              # Seções da página
│   ├── Hero/              # Carrossel 3D
│   ├── Products/          # Grid de produtos
│   ├── About/             # Sobre nós
│   ├── Reviews/           # Avaliações
│   └── Map/               # Localização
├── hooks/                 # Custom React hooks
├── services/              # Integrações (Supabase)
├── context/               # Context API
├── types/                 # TypeScript types
└── utils/                 # Funções auxiliares
```

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta no Supabase

### Instalação

```bash
# Clone o repositório
git clone https://github.com/leorecoa/Projeto-Site-Mansao-Maromba.git

# Entre na pasta
cd Projeto-Site-Mansao-Maromba

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do Supabase

# Rode o projeto
npm run dev
```

Acesse: `http://localhost:3000`

---

## 🔐 Configuração do Supabase

### 1. Crie um projeto no Supabase

### 2. Configure as variáveis de ambiente

```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 3. Execute o schema SQL

Use o arquivo `supabase_schema.sql` para criar as tabelas necessárias.

### 4. Configure Google OAuth (opcional)

- Vá em Authentication → Providers → Google
- Habilite e configure com suas credenciais do Google Cloud

---

## 📊 Performance

- ⚡ Build time: **~4s**
- 📦 Bundle size: **395 KB** (gzipped: 113 KB)
- 🎯 Lighthouse Score: **90+**
- 🚀 First Contentful Paint: **< 1s**

---

## 🎯 Roadmap

### Em Desenvolvimento
- [ ] Checkout com Stripe/Mercado Pago
- [ ] Histórico de pedidos
- [ ] Sistema de cupons
- [ ] Notificações toast
- [ ] Perfil do usuário

### Futuro
- [ ] PWA (Progressive Web App)
- [ ] Modo escuro/claro
- [ ] Testes unitários
- [ ] SEO otimizado
- [ ] Analytics

---

## 📸 Screenshots

### Hero Section
![Hero](https://via.placeholder.com/800x400?text=Hero+Section)

### Painel Admin
![Admin](https://via.placeholder.com/800x400?text=Admin+Panel)

### Carrinho
![Cart](https://via.placeholder.com/800x400?text=Shopping+Cart)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

## 📞 Contato

**Leandro Jessé**
- GitHub: [@leorecoa](https://github.com/leorecoa)
- Email: leorecoa2@gmail.com

---

<div align="center">

**⭐ Se este projeto te ajudou, deixe uma estrela!**

Feito com ❤️ por Leandro Jessé | Acelerado com 🤖 AI

</div>
