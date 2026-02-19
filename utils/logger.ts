export function logError(context: string, error: unknown): void {
  if (!import.meta.env.DEV) return
  console.error(`[${context}]`, error)
}
