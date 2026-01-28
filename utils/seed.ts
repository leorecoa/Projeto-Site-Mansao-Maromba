import { supabase } from '../supabase'
import { PRODUCTS } from '../data/products'
import type { Database, Json } from '../types/database.types'

type ProductInsert =
  Database['public']['Tables']['products']['Insert'] & {
    theme: Json
  }

export const seedProducts = async () => {
  if (!confirm('Tem certeza que deseja inserir os produtos no banco de dados?')) {
    return
  }

  console.log('🚀 Iniciando inserção de produtos...')

  const productsToInsert: ProductInsert[] = PRODUCTS.map(
    ({ id, image, theme, ...rest }) => ({
      ...rest,
      image_url: image,
      theme: theme as unknown as Json, // 👈 aqui
    })
  )

  try {
    const { data, error } = await supabase
      .from('products')
      .insert(productsToInsert)
      .select()

    if (error) throw error

    console.log('✅ Produtos inseridos com sucesso:', data)
    alert(`${data?.length ?? 0} produtos inseridos com sucesso!`)
  } catch (error: any) {
    console.error('❌ Erro ao inserir produtos:', error)
    alert(
      `Erro ao inserir produtos: ${
        error.message || 'Verifique o console para mais detalhes.'
      }`
    )
  }
}
