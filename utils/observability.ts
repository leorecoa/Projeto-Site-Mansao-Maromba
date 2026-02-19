type EventPayload = Record<string, unknown>;

interface BrowserWindowWithGtag extends Window {
  gtag?: (...args: unknown[]) => void;
}

export function createRequestId(prefix = 'evt'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function trackEvent(eventName: string, payload: EventPayload = {}): void {
  if (typeof window === 'undefined') return;

  const w = window as BrowserWindowWithGtag;
  if (typeof w.gtag === 'function') {
    w.gtag('event', eventName, payload);
  }

  if (import.meta.env.DEV) {
    console.info('[trackEvent]', eventName, payload);
  }
}
