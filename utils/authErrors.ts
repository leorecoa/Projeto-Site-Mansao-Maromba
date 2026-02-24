export function mapAuthErrorMessage(error: unknown): string {
  const fallback = 'Nao foi possivel concluir a autenticacao. Tente novamente.';

  const rawMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: unknown }).message)
        : '';

  if (!rawMessage) {
    return fallback;
  }

  const message = rawMessage.toLowerCase();

  if (message.includes('invalid login credentials')) {
    return 'Email ou senha invalidos.';
  }

  if (message.includes('email not confirmed')) {
    return 'Confirme seu email antes de entrar.';
  }

  if (message.includes('user already registered')) {
    return 'Este email ja esta cadastrado.';
  }

  if (message.includes('signup is disabled')) {
    return 'Cadastro por email esta desativado no momento.';
  }

  if (message.includes('database error saving new user')) {
    return 'Falha ao criar conta no banco. Verifique o trigger/perfil de usuario no Supabase.';
  }

  if (message.includes('email address is invalid') || message.includes('invalid email')) {
    return 'Email invalido. Revise e tente novamente.';
  }

  if (message.includes('rate limit')) {
    return 'Muitas tentativas. Aguarde um pouco e tente novamente.';
  }

  if (message.includes('provider is not enabled') || message.includes('unsupported provider')) {
    return 'Login com Google nao habilitado no Supabase (Auth > Providers > Google).';
  }

  if (message.includes('redirect_uri_mismatch')) {
    return 'Redirect URI invalido. Verifique URLs de callback no Google Cloud e Supabase.';
  }

  if (message.includes('invalid redirect')) {
    return 'URL de redirecionamento nao permitida. Ajuste Auth > URL Configuration no Supabase.';
  }

  if (message.includes('access_denied')) {
    return 'Acesso negado no provedor de login. Tente novamente e selecione a conta Google.';
  }

  if (message.includes('network') || message.includes('fetch')) {
    return 'Falha de conexao. Verifique sua internet e tente novamente.';
  }

  if (import.meta.env.DEV) {
    return `${fallback} (${rawMessage})`;
  }

  return fallback;
}
