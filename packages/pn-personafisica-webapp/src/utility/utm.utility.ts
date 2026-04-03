export const UTM_KEY = {
  CAMPAIGN: 'utm_campaign',
  SOURCE: 'utm_source',
  MEDIUM: 'utm_medium',
} as const;

export const UTM_KEYS = Object.values(UTM_KEY) as ReadonlyArray<
  (typeof UTM_KEY)[keyof typeof UTM_KEY]
>;

export type RequiredUtmKey = (typeof UTM_KEYS)[number];
export type AnyUtmKey = `utm_${string}`;

export type UtmParams = Record<RequiredUtmKey, string> & Partial<Record<AnyUtmKey, string>>;

export const AAR_UTM: UtmParams = {
  [UTM_KEY.CAMPAIGN]: 'qrcode_aar',
  [UTM_KEY.SOURCE]: 'cartaceo',
  [UTM_KEY.MEDIUM]: 'display',
};

export const TPP_LANDING_UTM: UtmParams = {
  [UTM_KEY.CAMPAIGN]: 'tp_accesso_documenti',
  [UTM_KEY.SOURCE]: 'tpp_landing',
  [UTM_KEY.MEDIUM]: 'website',
};

export function injectUtmQueryParams(
  utm: UtmParams,
  options?: { avoidOverride?: boolean }
): boolean {
  const { pathname, search, hash } = globalThis.location;
  const params = new URLSearchParams(search);

  const avoidOverride = options?.avoidOverride ?? false;
  const hasAnyUtm = UTM_KEYS.some((k) => params.has(k));

  // If required UTM params are already present and avoidOverride is true, do nothing
  if (avoidOverride && hasAnyUtm) {
    return false;
  }

  // set required keys
  for (const key of UTM_KEYS) {
    params.set(key, utm[key]);
  }

  // set optional keys (if any)
  for (const [key, value] of Object.entries(utm)) {
    if (key.startsWith('utm_') && value != null && !UTM_KEYS.includes(key as RequiredUtmKey)) {
      params.set(key, String(value));
    }
  }

  const newSearch = params.toString();
  const newUrl = `${pathname}?${newSearch}${hash ?? ''}`;

  // Replace current URL without reloading to let Mixpanel capture UTMs
  globalThis.history.replaceState(globalThis.history.state, '', newUrl);

  return true;
}
