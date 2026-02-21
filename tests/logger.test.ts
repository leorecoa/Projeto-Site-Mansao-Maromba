import { describe, it, expect, vi, afterEach } from 'vitest';
import { logError, logInfo } from '@/utils/logger';

describe('utils/logger', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('executa logError sem falhar', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    logError('test.context', new Error('boom'));

    if (import.meta.env.DEV) {
      expect(errorSpy).toHaveBeenCalled();
    } else {
      expect(errorSpy).not.toHaveBeenCalled();
    }
  });

  it('executa logInfo com payload e sem payload', () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    logInfo('test.context', { ok: true });
    logInfo('test.context');

    if (import.meta.env.DEV) {
      expect(infoSpy).toHaveBeenCalledTimes(2);
    } else {
      expect(infoSpy).not.toHaveBeenCalled();
    }
  });
});
