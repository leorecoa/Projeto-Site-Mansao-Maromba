export function mapAuthErrorMessage(error: unknown): string {
  const fallback = 'Nao foi possivel concluir a autenticacao. Tente novamente.'

  if (!(error instanceof Error)) {
    return fallback
  }

  const message = error.message.toLowerCase()

  if (message.includes('invalid login credentials')) {
    return 'Email ou senha invalidos.'
  }

  if (message.includes('email not confirmed')) {
    return 'Confirme seu email antes de entrar.'
  }

  if (message.includes('user already registered')) {
    return 'Este email ja esta cadastrado.'
  }

  if (message.includes('rate limit')) {
    return 'Muitas tentativas. Aguarde um pouco e tente novamente.'
  }

  if (message.includes('network') || message.includes('fetch')) {
    return 'Falha de conexao. Verifique sua internet e tente novamente.'
  }

  return fallback
}
