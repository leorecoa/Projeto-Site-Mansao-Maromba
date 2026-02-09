# 🖼️ Configuração Supabase Storage

## 📋 Passos para Configurar

### 1. Acessar Supabase Dashboard
```
https://supabase.com/dashboard/project/ftgzoulanmsrmujtgrvj
```

### 2. Criar Bucket de Imagens

1. Vá em **Storage** no menu lateral
2. Clique em **New Bucket**
3. Configure:
   - **Name**: `product-images`
   - **Public bucket**: ✅ Ativado
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/*`
4. Clique em **Create bucket**

### 3. Configurar Políticas (RLS)

Vá em **Storage** → **Policies** e execute o SQL:

```sql
-- Permitir upload (apenas autenticados)
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Permitir leitura pública
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Permitir delete (apenas autenticados)
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
```

### 4. Testar Upload

1. Faça login no admin: `/admin`
2. Clique em **Novo Produto**
3. Arraste uma imagem ou clique em **Escolher arquivo**
4. Preencha os dados e clique em **Criar Produto**

## ✅ Verificação

Após criar um produto com imagem:

1. Vá em **Storage** → **product-images**
2. Você deve ver a imagem enviada
3. A URL pública será algo como:
   ```
   https://ftgzoulanmsrmujtgrvj.supabase.co/storage/v1/object/public/product-images/products/abc123.png
   ```

## 🚀 Benefícios

- ✅ **CDN Global**: Imagens servidas via CDN
- ✅ **Transformações**: Resize automático (futuro)
- ✅ **Segurança**: RLS policies
- ✅ **Performance**: Cache otimizado
- ✅ **Escalabilidade**: Sem limite de storage

## 🔧 Troubleshooting

### Erro: "new row violates row-level security policy"
- Verifique se o usuário está autenticado
- Confirme que as policies foram criadas

### Imagem não aparece
- Verifique se o bucket é público
- Confirme a URL no console do navegador

### Upload falha
- Verifique o tamanho do arquivo (< 5MB)
- Confirme o tipo MIME (image/*)
