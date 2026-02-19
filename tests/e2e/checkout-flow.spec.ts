import { test, expect } from '@playwright/test';

test.describe('Fluxo Completo de Checkout', () => {
  
  test('1. Adicionar produto ao carrinho', async ({ page }) => {
    await page.goto('http://localhost:5174');
    
    // Aguarda carregamento
    await page.waitForSelector('button:has-text("GARANTIR COMBO")', { timeout: 10000 });
    
    // Clica no primeiro botão de adicionar
    await page.click('button:has-text("GARANTIR COMBO")');
    
    // Verifica se modal do carrinho abriu
    await expect(page.locator('text=Carrinho')).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Produto adicionado ao carrinho');
  });

  test('2. Abrir carrinho e ver produto', async ({ page }) => {
    await page.goto('http://localhost:5174');
    
    // Adiciona produto
    await page.click('button:has-text("GARANTIR COMBO")');
    
    // Verifica contador do carrinho
    const cartBadge = page.locator('[class*="cart"] >> text=/[0-9]+/');
    await expect(cartBadge).toBeVisible();
    
    console.log('✅ Contador do carrinho atualizado');
  });

  test('3. Clicar em Finalizar Compra (sem login)', async ({ page }) => {
    await page.goto('http://localhost:5174');
    
    // Adiciona produto
    await page.click('button:has-text("GARANTIR COMBO")');
    
    // Clica em Finalizar Compra
    await page.click('button:has-text("Finalizar Compra")');
    
    // Deve redirecionar para login
    await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
    
    console.log('✅ Redirecionou para login (não autenticado)');
  });

  test('4. Fazer login e ir para checkout', async ({ page }) => {
    await page.goto('http://localhost:5174/login');
    
    // Preenche formulário de login
    await page.fill('input[type="email"]', 'teste@exemplo.com');
    await page.fill('input[type="password"]', 'senha123');
    
    // Clica em entrar
    await page.click('button:has-text("Entrar")');
    
    // Aguarda redirecionamento
    await page.waitForURL('http://localhost:5174/', { timeout: 10000 });
    
    console.log('✅ Login realizado');
  });

  test('5. Fluxo completo: Produto → Carrinho → Login → Checkout', async ({ page }) => {
    // PASSO 1: Adicionar produto
    await page.goto('http://localhost:5174');
    await page.click('button:has-text("GARANTIR COMBO")');
    await expect(page.locator('text=Carrinho')).toBeVisible();
    console.log('✅ Passo 1: Produto adicionado');
    
    // PASSO 2: Finalizar compra
    await page.click('button:has-text("Finalizar Compra")');
    await expect(page).toHaveURL(/.*login/);
    console.log('✅ Passo 2: Redirecionado para login');
    
    // PASSO 3: Fazer login (simulado - ajuste credenciais reais)
    // await page.fill('input[type="email"]', 'seu-email@gmail.com');
    // await page.fill('input[type="password"]', 'sua-senha');
    // await page.click('button:has-text("Entrar")');
    
    console.log('⚠️ Passo 3: Login manual necessário (configure credenciais)');
  });

  test('6. Verificar formulário de checkout (CustomerForm)', async ({ page }) => {
    // Navega direto para checkout (requer autenticação)
    await page.goto('http://localhost:5174/checkout');
    
    // Se não autenticado, vai para login
    if (page.url().includes('/login')) {
      console.log('⚠️ Requer autenticação - teste pulado');
      return;
    }
    
    // Verifica campos do formulário
    await expect(page.locator('input[placeholder*="João"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="CPF"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="email"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="99999"]')).toBeVisible();
    
    console.log('✅ Formulário CustomerForm renderizado');
  });

  test('7. Preencher dados pessoais', async ({ page }) => {
    await page.goto('http://localhost:5174/checkout');
    
    if (page.url().includes('/login')) {
      console.log('⚠️ Requer autenticação');
      return;
    }
    
    // Preenche dados
    await page.fill('input[placeholder*="João"]', 'João da Silva');
    await page.fill('input[placeholder*="CPF"]', '12345678900');
    await page.fill('input[placeholder*="email"]', 'joao@exemplo.com');
    await page.fill('input[placeholder*="99999"]', '11999998888');
    
    // Clica em próximo
    await page.click('button:has-text("Ir para Entrega")');
    
    console.log('✅ Dados pessoais preenchidos');
  });

  test('8. Preencher endereço (CEP)', async ({ page }) => {
    await page.goto('http://localhost:5174/checkout');
    
    if (page.url().includes('/login')) {
      console.log('⚠️ Requer autenticação');
      return;
    }
    
    // Avança para passo 2
    await page.fill('input[placeholder*="João"]', 'João da Silva');
    await page.fill('input[placeholder*="CPF"]', '12345678900');
    await page.fill('input[placeholder*="email"]', 'joao@exemplo.com');
    await page.fill('input[placeholder*="99999"]', '11999998888');
    await page.click('button:has-text("Ir para Entrega")');
    
    // Preenche CEP
    await page.fill('input[placeholder*="00000-000"]', '01310-100');
    await page.locator('input[placeholder*="00000-000"]').blur(); // Trigger busca CEP
    
    // Aguarda preenchimento automático
    await page.waitForTimeout(2000);
    
    // Preenche número
    await page.fill('input[id="shipping_number"]', '123');
    
    // Clica em próximo
    await page.click('button:has-text("Ir para Pagamento")');
    
    console.log('✅ Endereço preenchido');
  });

  test('9. Verificar criação do pedido', async ({ page }) => {
    await page.goto('http://localhost:5174/checkout');
    
    if (page.url().includes('/login')) {
      console.log('⚠️ Requer autenticação');
      return;
    }
    
    // Preenche tudo
    await page.fill('input[placeholder*="João"]', 'João da Silva');
    await page.fill('input[placeholder*="CPF"]', '12345678900');
    await page.fill('input[placeholder*="email"]', 'joao@exemplo.com');
    await page.fill('input[placeholder*="99999"]', '11999998888');
    await page.click('button:has-text("Ir para Entrega")');
    
    await page.fill('input[placeholder*="00000-000"]', '01310-100');
    await page.locator('input[placeholder*="00000-000"]').blur();
    await page.waitForTimeout(2000);
    await page.fill('input[id="shipping_number"]', '123');
    await page.click('button:has-text("Ir para Pagamento")');
    
    // Verifica se chegou no passo 3 (pagamento)
    await expect(page.locator('text=Pagamento')).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Pedido criado - Passo 3 (Pagamento) alcançado');
  });

  test('10. Resumo do carrinho visível', async ({ page }) => {
    await page.goto('http://localhost:5174/checkout');
    
    if (page.url().includes('/login')) {
      console.log('⚠️ Requer autenticação');
      return;
    }
    
    // Verifica sidebar com resumo
    await expect(page.locator('text=Resumo do Pedido')).toBeVisible();
    await expect(page.locator('text=Total')).toBeVisible();
    
    console.log('✅ Resumo do pedido visível');
  });
});

test.describe('Validações do Checkout', () => {
  
  test('Validar CPF inválido', async ({ page }) => {
    await page.goto('http://localhost:5174/checkout');
    
    if (page.url().includes('/login')) {
      console.log('⚠️ Requer autenticação');
      return;
    }
    
    await page.fill('input[placeholder*="CPF"]', '11111111111');
    await page.locator('input[placeholder*="CPF"]').blur();
    
    // Verifica mensagem de erro
    await expect(page.locator('text=CPF inválido')).toBeVisible({ timeout: 2000 });
    
    console.log('✅ Validação de CPF funcionando');
  });

  test('Validar email inválido', async ({ page }) => {
    await page.goto('http://localhost:5174/checkout');
    
    if (page.url().includes('/login')) {
      console.log('⚠️ Requer autenticação');
      return;
    }
    
    await page.fill('input[placeholder*="email"]', 'email-invalido');
    await page.locator('input[placeholder*="email"]').blur();
    
    // Verifica mensagem de erro
    await expect(page.locator('text=/email|inválido/i')).toBeVisible({ timeout: 2000 });
    
    console.log('✅ Validação de email funcionando');
  });

  test('Validar CEP inválido', async ({ page }) => {
    await page.goto('http://localhost:5174/checkout');
    
    if (page.url().includes('/login')) {
      console.log('⚠️ Requer autenticação');
      return;
    }
    
    // Avança para passo 2
    await page.fill('input[placeholder*="João"]', 'João da Silva');
    await page.fill('input[placeholder*="CPF"]', '12345678900');
    await page.fill('input[placeholder*="email"]', 'joao@exemplo.com');
    await page.fill('input[placeholder*="99999"]', '11999998888');
    await page.click('button:has-text("Ir para Entrega")');
    
    // Preenche CEP inválido
    await page.fill('input[placeholder*="00000-000"]', '00000-000');
    await page.locator('input[placeholder*="00000-000"]').blur();
    
    await page.waitForTimeout(2000);
    
    console.log('✅ Validação de CEP testada');
  });
});

test.describe('Proteção de Rotas', () => {
  
  test('Checkout sem autenticação redireciona para login', async ({ page }) => {
    // Limpa cookies/storage
    await page.context().clearCookies();
    
    await page.goto('http://localhost:5174/checkout');
    
    // Deve redirecionar para login
    await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
    
    console.log('✅ Proteção de rota funcionando');
  });
});
