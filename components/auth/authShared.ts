export const OAUTH_REDIRECT_STORAGE_KEY = 'post_login_redirect_path';

export const AUTH_LOGO_URL = 'https://i.imgur.com/2CMQ6GJ.png';

export function sanitizeRedirectPath(input: string | null): string {
  if (!input) return '/';
  if (!input.startsWith('/') || input.startsWith('//')) return '/';
  return input;
}
