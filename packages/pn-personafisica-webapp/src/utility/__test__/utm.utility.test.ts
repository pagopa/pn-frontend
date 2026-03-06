import { vi } from 'vitest';

import { addAarUtmToUrl } from '../utm.utility';

describe('addAarUtmToUrl', () => {
  const replaceStateSpy = vi.spyOn(globalThis.window.history, 'replaceState');

  beforeEach(() => {
    replaceStateSpy.mockClear();
    globalThis.window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    globalThis.window.history.replaceState({}, '', '/');
  });

  it('returns false when aar param is missing', () => {
    globalThis.window.history.replaceState({}, '', '/?invalid_param=value');
    replaceStateSpy.mockClear();

    const result = addAarUtmToUrl();

    expect(result).toBe(false);
    expect(replaceStateSpy).not.toHaveBeenCalled();
  });

  it('adds utm params when aar is present and no utm_source exists', () => {
    globalThis.window.history.replaceState({}, '', '/?aar=AAR_TOKEN');
    replaceStateSpy.mockClear();

    const result = addAarUtmToUrl();

    expect(result).toBe(true);
    expect(replaceStateSpy).toHaveBeenCalledTimes(1);

    const url = replaceStateSpy.mock.calls[0][2] as string;
    const parsed = new URL(url, 'https://test.pagopa.it');

    expect(parsed.searchParams.get('aar')).toBe('AAR_TOKEN');
    expect(parsed.searchParams.get('utm_source')).toBeTruthy();
    expect(parsed.searchParams.get('utm_medium')).toBeTruthy();
    expect(parsed.searchParams.get('utm_campaign')).toBeTruthy();
  });

  it('does nothing when utm_source is already present', () => {
    globalThis.window.history.replaceState({}, '', '/?aar=AAR_TOKEN&utm_source=s');
    replaceStateSpy.mockClear();

    const startingUrl = globalThis.window.location.href;

    const result = addAarUtmToUrl();

    expect(result).toBe(false);
    expect(replaceStateSpy).not.toHaveBeenCalled();
    expect(globalThis.window.location.href).toBe(startingUrl);
  });
});
