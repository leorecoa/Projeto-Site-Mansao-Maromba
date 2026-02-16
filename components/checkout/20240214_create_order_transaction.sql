-- Função segura para criar pedidos com validação de estoque e preço no servidor
create or replace function create_order(
  p_user_id uuid,
  p_customer_email text,
  p_customer_name text,
  p_shipping_address jsonb,
  p_payment_method text,
  p_items jsonb
) returns uuid as $$
declare
  v_customer_id uuid;
  v_order_id uuid;
  v_total numeric := 0;
  v_item jsonb;
  v_product_price numeric;
  v_product_stock int;
  v_product_name text;
  v_order_number text;
begin
  -- 1. Gerenciar Cliente (Upsert simplificado para garantir vínculo)
  select id into v_customer_id from customers where auth_user_id = p_user_id limit 1;
  
  if v_customer_id is null then
    insert into customers (auth_user_id, email, full_name)
    values (p_user_id, p_customer_email, p_customer_name)
    returning id into v_customer_id;
  else
    -- Atualiza dados básicos se necessário
    update customers 
    set full_name = p_customer_name 
    where id = v_customer_id;
  end if;

  -- 2. Validar Estoque e Calcular Total (Nunca confiar no frontend)
  for v_item in select * from jsonb_array_elements(p_items) loop
    -- Busca preço e estoque ATUAIS do banco
    select price, stock_quantity, name 
    into v_product_price, v_product_stock, v_product_name
    from products 
    where id = (v_item->>'product_id')::uuid;

    if not found then
      raise exception 'Produto não encontrado: %', (v_item->>'product_id');
    end if;

    if v_product_stock < (v_item->>'quantity')::int then
      raise exception 'Estoque insuficiente para o produto: % (Disponível: %)', v_product_name, v_product_stock;
    end if;

    -- Soma ao total usando o preço do BANCO
    v_total := v_total + (v_product_price * (v_item->>'quantity')::int);
  end loop;

  -- Gerar número do pedido amigável (Ex: ORD-20240214-XXXX)
  v_order_number := 'ORD-' || to_char(now(), 'YYYYMMDD') || '-' || substring(md5(random()::text) from 1 for 4);

  -- 3. Criar Pedido
  insert into orders (
    user_id,
    customer_id,
    total_amount,
    status,
    payment_method,
    shipping_address_snapshot,
    customer_email,
    customer_name,
    tracking_code -- Será preenchido posteriormente
  ) values (
    p_user_id,
    v_customer_id,
    v_total,
    'pending_payment',
    p_payment_method,
    p_shipping_address,
    p_customer_email,
    p_customer_name,
    v_order_number
  ) returning id into v_order_id;

  -- 4. Inserir Itens e Baixar Estoque
  for v_item in select * from jsonb_array_elements(p_items) loop
    select price into v_product_price
    from products 
    where id = (v_item->>'product_id')::uuid;

    insert into order_items (order_id, product_id, quantity, unit_price, subtotal)
    values (v_order_id, (v_item->>'product_id')::uuid, (v_item->>'quantity')::int, v_product_price, v_product_price * (v_item->>'quantity')::int);

    -- Baixa de estoque atômica
    update products
    set stock_quantity = stock_quantity - (v_item->>'quantity')::int
    where id = (v_item->>'product_id')::uuid;
  end loop;

  return v_order_id;
end;
$$ language plpgsql security definer;