import { chromium, FullConfig } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function globalSetup(config: FullConfig) {
    // Carrega variáveis de ambiente explicitamente para o processo de setup
    dotenv.config({ path: path.resolve(__dirname, '../../.env') })

    const url = process.env.VITE_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    const adminEmail = 'admin-e2e@test.com'
    const adminPassword = 'password123' // Senha fixa para testes

    if (!url || !key) {
        throw new Error('❌ VITE_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não definidos no .env. O Global Setup falhou.')
    }

    console.log('🔄 [Global Setup] Iniciando configuração de ambiente...')
    const supabase = createClient(url, key)

    // 1. Seed de Produtos (Mantendo o existente)
    await supabase.from('products').upsert({
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Produto Teste E2E',
        price: 50.00,
        image_url: 'https://placehold.co/400',
        description: 'Produto gerado automaticamente para testes automatizados',
        stock_quantity: 100
    })

    // 2. Criar/Garantir Usuário Admin
    console.log('👤 [Global Setup] Configurando usuário Admin...')

    // Verifica se usuário já existe
    const { data: { users } } = await supabase.auth.admin.listUsers()
    let user = users.find(u => u.email === adminEmail)

    if (!user) {
        // Cria se não existir
        const { data, error } = await supabase.auth.admin.createUser({
            email: adminEmail,
            password: adminPassword,
            email_confirm: true
        })
        if (error) throw error
        user = data.user
    } else {
        // Atualiza senha para garantir acesso
        await supabase.auth.admin.updateUserById(user.id, { password: adminPassword })
    }

    if (!user) throw new Error('Falha crítica ao criar/recuperar usuário admin.')

    // 3. Forçar Role Admin (Banco de Dados E Auth Claims)
    console.log(`🛡️ [Global Setup] Atualizando permissões de Admin para ID: ${user.id}...`)

    // Atualiza app_metadata (Claims) - Crítico se o app usar RLS baseada em JWT
    await supabase.auth.admin.updateUserById(user.id, {
        app_metadata: { role: 'admin' },
        user_metadata: { role: 'admin', full_name: 'Admin E2E' } // Reforço para frontends que checam metadados públicos
    })

    const { error: roleError } = await supabase.from('user_profiles').upsert({
        id: user.id,
        email: adminEmail,
        role: 'admin'
    })

    if (roleError) throw new Error(`Erro ao definir role admin: ${roleError.message}`)

    // 4. Login e Salvar Storage State (Sessão)
    console.log('🔑 [Global Setup] Realizando login para gerar storageState...')

    const authFile = path.join(__dirname, '../../playwright/.auth/admin.json')
    const authDir = path.dirname(authFile)
    if (!fs.existsSync(authDir)) fs.mkdirSync(authDir, { recursive: true })

    // Usa a baseURL configurada no playwright.config.ts ou fallback
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3001'
    const browser = await chromium.launch()
    const page = await browser.newPage({ baseURL })

    try {
        // Aumenta o timeout do goto e espera por 'domcontentloaded' que é mais rápido e confiável para SPAs
        await page.goto('/login', { timeout: 60000, waitUntil: 'domcontentloaded' })
        // Adiciona uma espera explícita pelo formulário de login para garantir que a página renderizou
        await page.waitForSelector('input[type="email"]', { state: 'visible', timeout: 30000 })

        await page.fill('input[type="email"]', adminEmail)
        await page.fill('input[type="password"]', adminPassword)
        await page.click('button:has-text("Entrar")')

        // Fail Fast: Verifica se apareceu erro de login antes de esperar o timeout longo
        // Isso evita esperar 30s se a senha estiver errada
        const errorMsg = page.locator('text=Invalid login credentials')
        if (await errorMsg.isVisible({ timeout: 3000 })) {
            throw new Error('❌ Login falhou: Credenciais inválidas detectadas.')
        }

        // Aguarda redirecionamento para Home e elemento de navegação (confirmação de login)
        await page.waitForURL('/', { timeout: 30000 })
        // Aumentado para 30s para suportar cold start do Vite/React
        await page.waitForSelector('nav', { state: 'visible', timeout: 30000 })

        // Salva o estado da sessão (cookies/localStorage)
        await page.context().storageState({ path: authFile })
        console.log(`✅ [Global Setup] Storage state salvo em: ${authFile}`)
    } catch (error) {
        console.error('❌ [Global Setup] Erro no login:', error)
        // Captura screenshot para debug visual imediato
        await page.screenshot({ path: 'global-setup-error.png', fullPage: true })
        throw error
    } finally {
        await browser.close()
    }
}

export default globalSetup