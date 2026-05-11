import { vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../../services/configuration.service';
import { UTM_KEY } from '../../utility/utm.utility';
import { goToLoginPortal } from '../navigation.utility';
import { SELFCARE_LOGOUT } from '../routes.const';

const mockOpenFn = vi.fn();

describe('Tests navigation utility methods', () => {
  const originalOpen = globalThis.open;

  beforeAll(() => {
    Object.defineProperty(globalThis, 'open', {
      configurable: true,
      value: mockOpenFn,
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll((): void => {
    Object.defineProperty(globalThis, 'open', { configurable: true, value: originalOpen });
  });

  it('goToLoginPortal', () => {
    goToLoginPortal();
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    expect(mockOpenFn).toHaveBeenCalledWith(
      `${getConfiguration().SELFCARE_BASE_URL}${SELFCARE_LOGOUT}`,
      '_self'
    );
  });

  it('goToLoginPortal preserves only utm_* params (and drops AAR)', () => {
    goToLoginPortal({
      search: `?${UTM_KEY.SOURCE}=s&${UTM_KEY.MEDIUM}=m&${UTM_KEY.CAMPAIGN}=c&invalid_param=value&${AppRouteParams.AAR}=fake-aar`,
    });

    expect(mockOpenFn).toHaveBeenCalledTimes(1);

    const [redirectUrl, target] = mockOpenFn.mock.calls[0];
    expect(target).toBe('_self');

    const parsed = new URL(redirectUrl);

    expect(parsed.origin).toBe(getConfiguration().SELFCARE_BASE_URL);
    expect(parsed.pathname).toBe(SELFCARE_LOGOUT);
    expect(parsed.searchParams.get(UTM_KEY.SOURCE)).toBe('s');
    expect(parsed.searchParams.get(UTM_KEY.MEDIUM)).toBe('m');
    expect(parsed.searchParams.get(UTM_KEY.CAMPAIGN)).toBe('c');
    expect(parsed.searchParams.has('invalid_param')).toBe(false);
    expect(parsed.searchParams.has(AppRouteParams.AAR)).toBe(false);
  });

  it('goToLoginPortal sanitizes preserved utm_* params', () => {
    goToLoginPortal({
      search: `?${UTM_KEY.SOURCE}=s<script>malicious_code!</script>&${UTM_KEY.MEDIUM}=m&${UTM_KEY.CAMPAIGN}=c`,
    });

    expect(mockOpenFn).toHaveBeenCalledTimes(1);

    const [redirectUrl] = mockOpenFn.mock.calls[0];
    const parsed = new URL(redirectUrl);

    expect(parsed.origin).toBe(getConfiguration().SELFCARE_BASE_URL);
    expect(parsed.pathname).toBe(SELFCARE_LOGOUT);
    expect(parsed.searchParams.get(UTM_KEY.SOURCE)).toBe('s');
    expect(parsed.searchParams.get(UTM_KEY.MEDIUM)).toBe('m');
    expect(parsed.searchParams.get(UTM_KEY.CAMPAIGN)).toBe('c');
  });
});
