# Configuração Supabase para Vercel

## ⚠️ IMPORTANTE: Configure no Supabase Dashboard

Para o login com Google funcionar no Vercel, você DEVE adicionar a URL de produção:

### 1. Acesse o Supabase Dashboard
https://supabase.com/dashboard/project/ftgzoulanmsrmujtgrvj/auth/url-configuration

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

### 3. Salve as configurações

Após salvar, o login com Google funcionará corretamente no Vercel!

## Debug

Após fazer login com Google, abra o Console do navegador (F12) e veja:
- "Sessão carregada: seu@email.com" ✅
- "Auth state changed: SIGNED_IN seu@email.com" ✅

Se não aparecer, a URL não está configurada corretamente no Supabase.
