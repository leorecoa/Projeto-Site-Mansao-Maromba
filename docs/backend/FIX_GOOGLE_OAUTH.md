# Configuracao Google OAuth - Fix

## Problema Identificado

1. **Tracking Prevention** - Navegador bloqueando cookies (use Chrome/Edge sem modo privado)
2. **OAuth Redirect** - Google redirecionando para URL antiga

## Solucao Aplicada

Atualizei o `LoginPage.tsx` para usar:
```typescript
redirectTo: `${window.location.origin}/auth/callback`
```

## Configurar Google Cloud Console

1. Acesse: https://console.cloud.google.com/apis/credentials
2. Selecione seu projeto
3. Clique no OAuth Client ID
4. Em **Authorized redirect URIs**, adicione:

```
http://localhost:5173/auth/callback
https://projeto-site-mansao-maromba.vercel.app/auth/callback
https://ftgzoulanmsrmujtgrvj.supabase.co/auth/v1/callback
```

5. Salve as alteracoes

## Configurar Supabase

1. Acesse: https://supabase.com/painel/project/ftgzoulanmsrmujtgrvj/auth/providers
2. Va em **Authentication** -> **Providers** -> **Google**
3. Verifique se esta habilitado
4. Em **Site URL**, coloque: `http://localhost:5173`
5. Em **Redirect URLs**, adicione:
```
http://localhost:5173/**
https://projeto-site-mansao-maromba.vercel.app/**
```

## Desabilitar Tracking Prevention

### Edge/Chrome
1. Configuracoes -> Privacidade
2. Desabilite "Prevencao de rastreamento" para localhost

### Firefox
1. about:config
2. Procure: `privacy.trackingprotection.enabled`
3. Mude para `false`

### Safari
1. Preferencias -> Privacidade
2. Desmarque "Impedir rastreamento entre sites"

## Testar

1. Limpe cache: **Ctrl + Shift + Delete**
2. Feche todas as abas
3. Abra: http://localhost:5173/login
4. Clique em "Continuar com Google"
5. Deve redirecionar para `/auth/callback` e depois para `/`

## Checklist

- [ ] Google Cloud Console configurado
- [ ] Supabase configurado
- [ ] Tracking Prevention desabilitado
- [ ] Cache limpo
- [ ] Testado login com Google

## Se ainda nao funcionar

Verifique no console do navegador (F12):
- Erros de CORS
- Erros de redirect_uri_mismatch
- Erros de storage blocked

Copie a mensagem de erro completa para eu ajudar.

