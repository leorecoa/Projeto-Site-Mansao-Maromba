export function logError(context: string, error: unknown): void {
  if (!import.meta.env.DEV) return;
  console.error(`[${context}]`, error);
}

export function logInfo(context: string, payload?: unknown): void {
  if (!import.meta.env.DEV) return;
  console.info(`[${context}]`, payload ?? '');
}
