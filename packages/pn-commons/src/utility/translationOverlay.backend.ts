/**
 * i18next backend that overlays a revised set of translations on top of the current ones, behind a
 * feature flag, without the rest of the application knowing about it.
 *
 * Each overlaid namespace `<ns>` gets a companion file `<ns>-v2.json` next to it, holding only the
 * keys that change. When the flag is on, base and overlay are fetched in parallel and deep merged
 * while the namespace is loading, so from that point on the namespace simply *contains* the new
 * texts: components, pages, `<Trans>` and error factories need no conditional of their own, and
 * turning the flag off is an immediate rollback.
 *
 * Which namespaces are overlaid, and by which flag, is decided by the application through the
 * i18next init options:
 *
 * ```ts
 * const overlaidNamespaces: OverlaidNamespaces<PfConfiguration> = {
 *   notifiche: 'IS_NEW_TIMELINE_COPY_ENABLED',
 * };
 *
 * i18next.use(TranslationOverlayBackend).init({ backend: { overlaidNamespaces }, ... });
 * ```
 *
 * The `OverlaidNamespaces` annotation is required rather than decorative: i18next types the backend
 * options as a plain `object`, so it is the only thing checking the flag names against the
 * application configuration.
 *
 * Namespaces outside the map go straight to the base backend, with no extra request and without
 * reading the configuration at all — which is what keeps the startup safe, since i18next loads the
 * default namespace before the configuration has finished loading. Anything going wrong afterwards
 * (configuration not available, overlay missing or unreadable) degrades to the current
 * translations instead of breaking.
 */
import type { BackendModule, CallbackError, ReadCallback, ResourceKey, Services } from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { mergeWith } from 'lodash-es';

import { Configuration } from '../services/configuration.service';

type BooleanKeys<TConfiguration> = {
  [K in keyof TConfiguration]: TConfiguration[K] extends boolean ? K : never;
}[keyof TConfiguration];

export type OverlaidNamespaces<TConfiguration> = Partial<
  Record<string, BooleanKeys<TConfiguration>>
>;

export type TranslationOverlayBackendOptions = {
  overlaidNamespaces: Partial<Record<string, string>>;
};

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

const readAsPromise = (
  backend: HttpBackend,
  language: string,
  namespace: string
): Promise<ReadResult> =>
  new Promise((resolve) => {
    backend.read(language, namespace, (error, data) => resolve({ error, data }));
  });

class TranslationOverlayBackend implements BackendModule<TranslationOverlayBackendOptions> {
  static type = 'backend' as const;

  type = 'backend' as const;

  private baseBackend = new HttpBackend();

  private overlayBackend = new HttpBackend();

  private overlaidNamespaces: TranslationOverlayBackendOptions['overlaidNamespaces'] = {};

  init(services: Services, options: TranslationOverlayBackendOptions): void {
    // eslint-disable-next-line functional/immutable-data
    this.overlaidNamespaces = options?.overlaidNamespaces ?? {};
    this.baseBackend.init(services, { loadPath: BASE_LOAD_PATH });
    this.overlayBackend.init(services, { loadPath: OVERLAY_LOAD_PATH });
  }

  private isOverlayEnabled(namespace: string): boolean {
    const featureFlag = this.overlaidNamespaces[namespace];
    if (!featureFlag) {
      return false;
    }
    try {
      return Configuration.get<Record<string, unknown>>()[featureFlag] === true;
    } catch {
      console.warn(`Configuration not available yet: translation overlay off for "${namespace}"`);
      return false;
    }
  }

  read(language: string, namespace: string, callback: ReadCallback): void {
    if (!this.isOverlayEnabled(namespace)) {
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
