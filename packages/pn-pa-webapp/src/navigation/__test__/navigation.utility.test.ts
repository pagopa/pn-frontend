import { vi } from 'vitest';

import { getConfiguration } from '../../services/configuration.service';
import { goToSelfcareLogin } from '../navigation.utility';

const mockOpenFn = vi.fn();

describe('Tests notification.utility', () => {
  const original = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'open', {
      configurable: true,
      value: mockOpenFn,
    });
  });

  afterAll((): void => {
    Object.defineProperty(window, 'open', { configurable: true, value: original });
  });

  it('goToSelfcareLogin', () => {
    goToSelfcareLogin();
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    expect(mockOpenFn).toHaveBeenCalledWith(getConfiguration().SELFCARE_URL_FE_LOGIN, '_self');
  });
});
