# Configuracao Supabase para Vercel

## IMPORTANTE: Configure no Supabase Dashboard

Para o login com Google funcionar no Vercel, voce DEVE adicionar a URL de producao:

### 1. Acesse o Supabase Dashboard
https://supabase.com/painel/project/ftgzoulanmsrmujtgrvj/auth/url-configuration

### 2. Adicione as URLs permitidas

**Site URL:**
```
https://projeto-site-mansao-maromba-leandro-jesse-da-silvas-projects.vercel.app
```

**Redirect URLs (adicione TODAS):**
```
http://localhost:5173/**
https://projeto-site-mansao-maromba-leandro-jesse-da-silvas-projects.vercel.app/**
https://*.vercel.app/**
```

### 3. Salve as configuracoes

Apos salvar, o login com Google funcionara corretamente no Vercel!

## Debug

Apos fazer login com Google, abra o Console do navegador (F12) e veja:
- "Sessao carregada: seu@email.com"
- "Auth state changed: SIGNED_IN seu@email.com"

Se nao aparecer, a URL nao esta configurada corretamente no Supabase.

