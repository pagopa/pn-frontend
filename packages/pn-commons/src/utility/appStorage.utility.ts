import { storageOpsBuilder } from './storage.utility';

const domicileBannerOps = storageOpsBuilder<string>('domicileBannerClosed', 'string', false);

/**
 * Centralizes application access to browser storage.
 *
 * This utility provides a single abstraction for reading, writing and removing
 * persisted values, so the app does not rely on direct `localStorage` or
 * `sessionStorage` usage scattered across the codebase.
 *
 * It is meant to keep storage access consistent, simplify future changes in the
 * persistence strategy, and make the intent of persisted UI/application state
 * explicit.
 */
export const appStorage = {
  domicileBanner: {
    isEnabled: (): boolean => domicileBannerOps.read() !== 'true',
    enable: (): void => {
      domicileBannerOps.delete();
    },
    disable: (): void => {
      domicileBannerOps.write('true');
    },
  },
} as const;
