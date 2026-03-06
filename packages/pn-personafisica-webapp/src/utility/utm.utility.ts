export const AAR_UTM_SOURCE = 'cartaceo';
export const AAR_UTM_MEDIUM = 'display';
export const AAR_UTM_CAMPAIGN = 'qrcode_aar';

const REQUIRED_UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'] as const;

export function addAarUtmToUrl(): boolean {
  const { pathname, search, hash } = globalThis.window.location;
  const params = new URLSearchParams(search);

  if (!params.has('aar')) {
    return false;
  }

  // If any UTM already present, do nothing (avoid overrides)
  const hasAnyUtm = REQUIRED_UTM_KEYS.some((k) => params.has(k));
  if (hasAnyUtm) {
    return false;
  }

  params.set('utm_source', AAR_UTM_SOURCE);
  params.set('utm_medium', AAR_UTM_MEDIUM);
  params.set('utm_campaign', AAR_UTM_CAMPAIGN);

  const newSearch = params.toString();
  const newUrl = `${pathname}?${newSearch}${hash}`;

  // Replace current URL without reloading to let Mixpanel capture UTMs
  globalThis.window.history.replaceState(globalThis.window.history.state, '', newUrl);

  return true;
}
