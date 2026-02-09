-- Criar bucket para imagens de produtos
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Política para permitir upload (apenas autenticados)
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Política para permitir leitura pública
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Política para permitir delete (apenas autenticados)
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
