-- Habilitar RLS na tabela products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública de produtos
CREATE POLICY "Public can view products"
ON products FOR SELECT
TO public
USING (true);

-- Permitir insert para usuários autenticados
CREATE POLICY "Authenticated users can insert products"
ON products FOR INSERT
TO authenticated
WITH CHECK (true);

-- Permitir update para usuários autenticados
CREATE POLICY "Authenticated users can update products"
ON products FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Permitir delete para usuários autenticados
CREATE POLICY "Authenticated users can delete products"
ON products FOR DELETE
TO authenticated
USING (true);
