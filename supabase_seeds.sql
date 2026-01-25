-- Inserção de dados iniciais (Seeds) para a tabela products
-- Copie e cole isso no SQL Editor do Supabase

INSERT INTO products (name, description, price, volume, type, image_url, theme)
VALUES
  (
    'Combo Tigrinho',
    'MANGA + MARACUJÁ. ENERGIA INTENSA QUE INCENDEIA A NOITE.',
    89.90,
    '1L',
    'Cocktail Alcoólico Gaseificado',
    'https://i.imgur.com/iFgXsaT.png',
    '{"primary": "#ff0000", "secondary": "#4b0000", "glow": "rgba(255, 0, 0, 0.8)", "text": "#FFFFFF", "bg": "linear-gradient(180deg, #1a0000 0%, #000000 100%)"}'
  ),
  (
    'Double Darkness',
    'PRETO FOSCO. MISTÉRIO E ELEGÂNCIA PARA O ROLÊ URBANO.',
    99.90,
    '1L',
    'Cocktail Alcoólico Gaseificado',
    'https://i.imgur.com/QKXsWbm.png',
    '{"primary": "#444444", "secondary": "#0a0a0a", "glow": "rgba(100, 100, 100, 0.3)", "text": "#EEEEEE", "bg": "linear-gradient(180deg, #0d0d0d 0%, #000000 100%)"}'
  ),
  (
    'Combo Pink',
    'VIBE NEON. ATITUDE QUE BRILHA NO ESCURO DO CLUB.',
    94.90,
    '1L',
    'Cocktail Alcoólico Gaseificado',
    'https://i.imgur.com/FaTOEtC.png',
    '{"primary": "#ff00ff", "secondary": "#200020", "glow": "rgba(255, 0, 255, 0.6)", "text": "#FFFFFF", "bg": "linear-gradient(180deg, #150015 0%, #000000 100%)"}'
  ),
  (
    'Vodka Combo',
    'AZUL E ROSA. O EQUILÍBRIO PERFEITO ENTRE GELO E FOGO.',
    84.90,
    '1L',
    'Cocktail Alcoólico Gaseificado',
    'https://i.imgur.com/U2nL7Mv.png',
    '{"primary": "#00f0ff", "secondary": "#001a1c", "glow": "rgba(0, 240, 255, 0.5)", "text": "#FFFFFF", "bg": "linear-gradient(180deg, #001012 0%, #000000 100%)"}'
  );
