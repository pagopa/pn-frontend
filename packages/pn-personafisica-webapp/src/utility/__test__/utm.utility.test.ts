import { vi } from 'vitest';

import { AAR_UTM, UTM_KEY, injectUtmQueryParams } from '../utm.utility';

describe('injectUtmQueryParams', () => {
  const replaceStateSpy = vi.spyOn(globalThis.history, 'replaceState');

  beforeEach(() => {
    replaceStateSpy.mockClear();
    globalThis.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    globalThis.history.replaceState({}, '', '/');
  });

  it('injects utm params when no required utm key exists', () => {
    globalThis.history.replaceState({}, '', '/?generic_param=value');
    replaceStateSpy.mockClear();

    const result = injectUtmQueryParams(AAR_UTM);

    expect(result).toBe(true);
    expect(replaceStateSpy).toHaveBeenCalledTimes(1);

    const url = replaceStateSpy.mock.calls[0][2] as string;
    const parsed = new URL(url, 'https://test.pagopa.it');

    expect(parsed.searchParams.get(UTM_KEY.CAMPAIGN)).toBe(AAR_UTM.utm_campaign);
    expect(parsed.searchParams.get(UTM_KEY.SOURCE)).toBe(AAR_UTM.utm_source);
    expect(parsed.searchParams.get(UTM_KEY.MEDIUM)).toBe(AAR_UTM.utm_medium);
    expect(parsed.searchParams.get('generic_param')).toBe('value');
  });

  it('overrides existing required utm params by default', () => {
    globalThis.history.replaceState(
      {},
      '',
      '/?utm_source=old-source&utm_campaign=old-campaign&generic_param=value'
    );
    replaceStateSpy.mockClear();

    const result = injectUtmQueryParams(AAR_UTM);

    expect(result).toBe(true);
    expect(replaceStateSpy).toHaveBeenCalledTimes(1);

    const url = replaceStateSpy.mock.calls[0][2] as string;
    const parsed = new URL(url, 'https://test.pagopa.it');

    expect(parsed.searchParams.get(UTM_KEY.CAMPAIGN)).toBe(AAR_UTM[UTM_KEY.CAMPAIGN]);
    expect(parsed.searchParams.get(UTM_KEY.SOURCE)).toBe(AAR_UTM[UTM_KEY.SOURCE]);
    expect(parsed.searchParams.get(UTM_KEY.MEDIUM)).toBe(AAR_UTM[UTM_KEY.MEDIUM]);
    expect(parsed.searchParams.get('generic_param')).toBe('value');
  });

  it('does nothing when any required utm key is already present and avoidOverride is true', () => {
    globalThis.history.replaceState({}, '', '/?utm_source=source&generic_param=value');
    replaceStateSpy.mockClear();

    const startingUrl = globalThis.location.href;

    const result = injectUtmQueryParams(AAR_UTM, { avoidOverride: true });

    expect(result).toBe(false);
    expect(replaceStateSpy).not.toHaveBeenCalled();
    expect(globalThis.location.href).toBe(startingUrl);
  });

  it('preserves hash when updating the url', () => {
    globalThis.history.replaceState({}, '', '/?generic_param=value#hash');
    replaceStateSpy.mockClear();

    const result = injectUtmQueryParams(AAR_UTM);

    expect(result).toBe(true);

    const url = replaceStateSpy.mock.calls[0][2] as string;
    const parsed = new URL(url, 'https://test.pagopa.it');

    expect(parsed.hash).toBe('#hash');
  });

  it('injects optional utm_* params together with required ones', () => {
    globalThis.history.replaceState({}, '', '/?generic_param=value');
    replaceStateSpy.mockClear();

    const result = injectUtmQueryParams({
      ...AAR_UTM,
      utm_content: 'hero-banner',
      utm_term: 'send',
    });

    expect(result).toBe(true);
    expect(replaceStateSpy).toHaveBeenCalledTimes(1);

    const url = replaceStateSpy.mock.calls[0][2] as string;
    const parsed = new URL(url, 'https://test.pagopa.it');

    expect(parsed.searchParams.get(UTM_KEY.CAMPAIGN)).toBe(AAR_UTM[UTM_KEY.CAMPAIGN]);
    expect(parsed.searchParams.get(UTM_KEY.SOURCE)).toBe(AAR_UTM[UTM_KEY.SOURCE]);
    expect(parsed.searchParams.get(UTM_KEY.MEDIUM)).toBe(AAR_UTM[UTM_KEY.MEDIUM]);
    expect(parsed.searchParams.get('utm_content')).toBe('hero-banner');
    expect(parsed.searchParams.get('utm_term')).toBe('send');
    expect(parsed.searchParams.get('generic_param')).toBe('value');
  });
});
