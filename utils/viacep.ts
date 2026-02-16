export interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  ddd: string
  erro?: boolean
}

export async function fetchAddressByCep(
  cep: string
): Promise<ViaCepResponse> {
  const cleanedCep = cep.replace(/\D/g, '')

  if (cleanedCep.length !== 8) {
    throw new Error('CEP inválido')
  }

  const response = await fetch(
    `https://viacep.com.br/ws/${cleanedCep}/json/`
  )

  if (!response.ok) {
    throw new Error('Erro ao buscar CEP')
  }

  const data: ViaCepResponse = await response.json()

  if (data.erro) {
    throw new Error('CEP não encontrado')
  }

  return data
}
