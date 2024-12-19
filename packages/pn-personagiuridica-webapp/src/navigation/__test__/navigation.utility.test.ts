import { vi } from 'vitest';

import { getConfiguration } from '../../services/configuration.service';
import { goToLoginPortal, SELFCARE_ROUTE_LOGOUT } from '../navigation.utility';

const mockOpenFn = vi.fn();

describe('Tests navigation utility methods', () => {
  const original = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'open', {
      configurable: true,
      value: mockOpenFn,
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll((): void => {
    Object.defineProperty(window, 'open', { configurable: true, value: original });
  });

  it('goToLoginPortal', () => {
    goToLoginPortal();
    expect(mockOpenFn).toBeCalledTimes(1);
    expect(mockOpenFn).toBeCalledWith(`${getConfiguration().SELFCARE_BASE_URL}${SELFCARE_ROUTE_LOGOUT}`, '_self');
  });

  // it('goToLoginPortal - aar', () => {
  //   goToLoginPortal('fake-aar-token');
  //   expect(replaceFn).toBeCalledTimes(1);
  //   expect(replaceFn).toBeCalledWith(
  //     `${getConfiguration().SELFCARE_BASE_URL}${SELFCARE_ROUTE_LOGOUT}?type=PG&aar=fake-aar-token`
  //   );
  // });

  // it('goToLoginPortal - aar', () => {
  //   goToLoginPortal('<script>malicious code</script>malicious-aar-token');
  //   expect(replaceFn).toBeCalledTimes(1);
  //   expect(replaceFn).toBeCalledWith(
  //     `${getConfiguration().SELFCARE_BASE_URL}${SELFCARE_ROUTE_LOGOUT}?type=PG&aar=malicious-aar-token`
  //   );
  // });
});
