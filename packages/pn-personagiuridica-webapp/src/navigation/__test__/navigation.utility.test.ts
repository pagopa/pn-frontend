import { vi } from 'vitest';

import { getConfiguration } from '../../services/configuration.service';
import { goToLoginPortal } from '../navigation.utility';
import { SELFCARE_LOGOUT } from '../routes.const';

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
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    expect(mockOpenFn).toHaveBeenCalledWith(
      `${getConfiguration().SELFCARE_BASE_URL}${SELFCARE_LOGOUT}`,
      '_self'
    );
  });
});
