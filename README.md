<p align="center">
  <img src="https://i.imgur.com/2CMQ6GJ.png" alt="Mansão Maromba Logo" width="120" />
</p>

<h1 align="center">Mansão Maromba - Depósito Digital Pro</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</p>

<p align="center">
  <strong>A experiência definitiva em depósitos de bebidas digitais.</strong><br />
  Estética Urbana • Neon Nightlife • Performance Premium
</p>

<p align="center">
  <a href="https://projeto-site-mansao-maromba.vercel.app/">
    <img src="https://img.shields.io/badge/Demo-Acessar%20Site-blue?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
</p>

---

## 🚀 Sobre o Projeto

O **Mansão Maromba - Depósito Digital** é uma plataforma e-commerce de elite focada na venda de combos de bebidas premium. O projeto combina uma interface visualmente impactante, inspirada na cultura de nightlife de São Paulo, com uma infraestrutura robusta e escalável.

### Principais Diferenciais:
- 🎨 **Dynamic Theme System**: A interface muda completamente de cor e atmosfera (neon, glow e backgrounds) conforme o produto selecionado.
- ⚡ **Performance Ultra**: Renderização otimizada com React e Tailwind CSS para transições fluidas.
- 📦 **Gestão de Dados via Supabase**: Integração em tempo real com banco de dados para produtos, clientes e pedidos.
- 🛒 **Checkout Inteligente**: Fluxo de compra simplificado com validação e armazenamento seguro no backend.
- 📱 **Mobile First**: Experiência totalmente responsiva e adaptada para dispositivos móveis.

---

## 🔗 Demo Online

Confira o projeto em execução no link abaixo:  
👉 **[https://projeto-site-mansao-maromba.vercel.app/](https://projeto-site-mansao-maromba.vercel.app/)**

---

## 🛠️ Stack Tecnológica

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Frontend:** [React](https://reactjs.org/) (Hooks, Context API)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend/DB:** [Supabase](https://supabase.com/) (PostgreSQL + Real-time)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Tipografia:** Syncopate & Inter (Google Fonts)

---

## ⚙️ Configuração e Instalação

### 1. Requisitos Próximos
Certifique-se de ter as variáveis de ambiente configuradas para a conexão com o banco (arquivo `.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 2. Estrutura de Pastas
```text
Mansao-Maromba/
├── components/          # Componentes reutilizáveis (UI/Layout)
├── stores/              # Gerenciamento de estado Global (Zustand)
├── data/                # Dados estáticos e Mockups
├── hooks/               # Custom hooks (useAuth, etc)
├── sections/            # Seções principais da Landing Page
├── services/            # Integração com APIs externas (Supabase)
├── types/               # Definições de TypeScript
└── utils/               # Funções utilitárias (Formatação)
```

### 3. Banco de Dados
O esquema do banco de dados PostgreSQL está disponível no arquivo `supabase_schema.sql`. Ele inclui:
- Tabela de **Produtos** com suporte a JSONB para temas dinâmicos.
- Tabela de **Clientes** com upsert por e-mail.
- Tabela de **Pedidos** e **Itens do Pedido** com relacionamentos de integridade.

---

## 📸 Visual

O site utiliza técnicas de **Glassmorphism**, **Parallax** e **3D Perspective Stage** para apresentar os produtos de forma cinematográfica. Cada garrafa possui seu próprio rastro de luz e sombras projetadas.

---

<p align="center">
  Desenvolvido com ❤️ para a Mansão Maromba.<br />
  © 2024 Mansão Maromba Distribuidora. Todos os direitos reservados.
</p>