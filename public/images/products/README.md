# Imagens dos Produtos

## Como usar imagens locais:

### 1. Adicione as imagens nesta pasta:
- `tigrinho.png` - Combo Tigrinho
- `darkness.png` - Double Darkness
- `pink.png` - Combo Pink
- `vodka.png` - Vodka Combo

### 2. Atualize os produtos no Supabase:

```sql
UPDATE products SET image = '/images/products/tigrinho.png' WHERE id = 'tigrinho';
UPDATE products SET image = '/images/products/darkness.png' WHERE id = 'darkness';
UPDATE products SET image = '/images/products/pink.png' WHERE id = 'pink';
UPDATE products SET image = '/images/products/vodka.png' WHERE id = 'vodka';
```

### 3. Ou atualize no arquivo local:

Edite `data/products.ts` e troque as URLs do Imgur por:
- `image: '/images/products/tigrinho.png'`
- `image: '/images/products/darkness.png'`
- `image: '/images/products/pink.png'`
- `image: '/images/products/vodka.png'`

## Vantagens de usar imagens locais:

 Mais rapido (sem requisicao externa)
 Nao depende de servico externo (Imgur)
 Melhor para SEO
 Controle total sobre os assets
 Funciona offline (PWA)

## Formato recomendado:

- **Formato**: PNG com fundo transparente
- **Tamanho**: 800x800px (ou maior)
- **Peso**: < 200 KB (otimizado)
- **Nome**: lowercase, sem espacos
