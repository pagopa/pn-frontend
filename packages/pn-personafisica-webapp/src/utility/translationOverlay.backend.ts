import type { BackendModule, CallbackError, ReadCallback, ResourceKey, Services } from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { mergeWith } from 'lodash-es';

import type { PfConfiguration } from '../services/configuration.service';
import { getConfiguration } from '../services/configuration.service';

type FeatureFlagName = {
  [K in keyof PfConfiguration]: PfConfiguration[K] extends boolean ? K : never;
}[keyof PfConfiguration];

const OVERLAID_NAMESPACES: Partial<Record<string, FeatureFlagName>> = {
  notifiche: 'IS_NEW_TIMELINE_COPY_ENABLED',
};

/** Lo stesso percorso che i18next-http-backend usa di default: a flag spento nulla cambia. */
const BASE_LOAD_PATH = '/locales/{{lng}}/{{ns}}.json';
const OVERLAY_LOAD_PATH = '/locales/{{lng}}/{{ns}}-v2.json';

type ReadResult = {
  error: CallbackError;
  data: ResourceKey | boolean | null | undefined;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const mergeTranslations = (
  base: Record<string, unknown>,
  overlay: Record<string, unknown>
): Record<string, unknown> =>
  mergeWith({}, base, overlay, (_baseValue: unknown, overlayValue: unknown) =>
    Array.isArray(overlayValue) ? overlayValue : undefined
  );

/**
 * L'overlay è attivo solo per i namespace mappati e solo se il loro feature flag è acceso.
 */
const isOverlayEnabled = (namespace: string): boolean => {
  const featureFlag = OVERLAID_NAMESPACES[namespace];
  if (!featureFlag) {
    return false;
  }
  try {
    return getConfiguration()[featureFlag];
  } catch {
    console.warn(
      `Configurazione non ancora disponibile: overlay delle traduzioni disattivato per "${namespace}"`
    );
    return false;
  }
};

const readAsPromise = (
  backend: HttpBackend,
  language: string,
  namespace: string
): Promise<ReadResult> =>
  new Promise((resolve) => {
    backend.read(language, namespace, (error, data) => resolve({ error, data }));
  });

class TranslationOverlayBackend implements BackendModule {
  static type = 'backend' as const;

  type = 'backend' as const;

  private baseBackend = new HttpBackend();

  private overlayBackend = new HttpBackend();

  init(services: Services): void {
    this.baseBackend.init(services, { loadPath: BASE_LOAD_PATH });
    this.overlayBackend.init(services, { loadPath: OVERLAY_LOAD_PATH });
  }

  read(language: string, namespace: string, callback: ReadCallback): void {
    if (!isOverlayEnabled(namespace)) {
      this.baseBackend.read(language, namespace, callback);
      return;
    }

    void Promise.all([
      readAsPromise(this.baseBackend, language, namespace),
      readAsPromise(this.overlayBackend, language, namespace),
    ]).then(([base, overlay]) => {
      if (base.error) {
        callback(base.error, base.data);
        return;
      }
      if (overlay.error || !isRecord(overlay.data) || !isRecord(base.data)) {
        callback(null, base.data);
        return;
      }
      callback(null, mergeTranslations(base.data, overlay.data));
    });
  }
}

export default TranslationOverlayBackend;
