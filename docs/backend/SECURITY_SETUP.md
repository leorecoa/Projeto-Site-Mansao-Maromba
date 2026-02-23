# Configuracao de seguranca - RBAC + validacao de entrada

## Critico: Execute antes de usar em producao

---

## 1 Configurar RBAC no Supabase

### Passo 1: Executar SQL
Va em: **Supabase Dashboard -> SQL Editor -> New query**

Cole e execute TODO o conteudo do arquivo: `supabase_rbac.sql`

Isso vai criar:
- Tabela `user_profiles` com papeis
- gatilho automatico para novos usuarios
- Funcao `is_admin()` para verificar permissoes
- politicas RLS protegendo produtos

---

### Passo 2: Tornar seu usuario ADMIN
Apos criar sua conta no app, execute:

```sql
-- SUBSTITUA pelo seu email!
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'SEU_EMAIL@gmail.com';
```

**Verificar:**
```sql
SELECT * FROM user_profiles WHERE role = 'admin';
```

Deve mostrar seu usuario!

---

## 2 Testar RBAC

### Teste 1: Admin pode acessar /admin
1. Faca login com sua conta
2. Acesse `/admin`
3.  Deve funcionar normalmente

### Teste 2: Cliente NAO pode acessar /admin
1. Crie uma segunda conta (outro email)
2. Tente acessar `/admin`
3.  Deve mostrar "Acesso Negado"

### Teste 3: Cliente NAO pode criar produtos
1. Com conta de cliente, abra Console (F12)
2. Execute:
```javascript
await supabase.from('products').insert([{
  name: 'Teste Hack',
  price: 1,
  volume: '1L',
  description: 'Tentando hackear',
  type: 'combo'
}])
```
3.  Deve retornar erro de permissao!

---

## 3 Validacao de entrada ativa

### O que esta protegido
#### Checkout
- Nome: apenas letras, 3-100 caracteres
- Email: formato valido
- Telefone: 10-11 digitos
- CEP: formato 12345-678
- Preco: positivo, max R$ 100.000
- Quantidade: max 100 por item

#### Admin (Produtos)
- Nome: 3-100 caracteres
- Preco: positivo, max R$ 10.000
- Volume: formato 1L ou 500ml
- URL: formato valido
- Descricao: 10-500 caracteres

---

## 4 Ataques Bloqueados

### SQL injection - Bloqueado
```javascript
// Tentativa de ataque:
nome: "'; DROP TABLE orders; --"
// Resultado: Rejeitado pela validacao Zod!
```

### XSS - Bloqueado
```javascript
// Tentativa de ataque:
notes: "<script>alert('hack')</script>"
// Resultado: Sanitizado antes de salvar!
```

### Dados invalidos - Bloqueados
```javascript
// Tentativas:
price: -999  // Rejeitado: deve ser positivo
quantity: 999999  // Rejeitado: max 100
email: "naoeemail"  // Rejeitado: formato invalido
```

---

## 5 Proximos Passos (Opcional)

### Limitacao de taxa (Supabase Edge Functions)
```typescript
// Limitar 5 requisicoes por minuto
// Implementar em proxima fase
```

### Logs de Auditoria
```sql
-- Registrar quem fez o que
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID,
  action TEXT,
  table_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Checklist de seguranca

- [ ] SQL `supabase_rbac.sql` executado
- [ ] Seu usuario e admin (verificado com SELECT)
- [ ] Testou acesso negado para cliente
- [ ] Testou validacao de inputs no checkout
- [ ] Testou validacao de produtos no admin
- [ ] Verificou que cliente nao pode criar produtos

---

## Importante

**NUNCA faca isso:**
```typescript
//  ERRADO - Validacao so no frontend
if (user) { allowAccess() }

//  CERTO - Validacao no backend (RLS)
CREATE POLICY "Only admins" ... USING (is_admin(auth.uid()));
```

**Seguranca SEMPRE no backend!** frontend e apenas experiencia do usuario.

---

## Suporte

Se algo nao funcionar:
1. Verifique se executou TODO o SQL
2. Confirme que seu usuario tem role='admin'
3. Limpe cache do navegador (Ctrl+Shift+R)
4. Verifique Console (F12) por erros

**Sistema agora esta 10x mais seguro!**



