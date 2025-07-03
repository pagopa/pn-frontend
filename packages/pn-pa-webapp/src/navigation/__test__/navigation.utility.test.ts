import { vi } from 'vitest';

import { getConfiguration } from '../../services/configuration.service';
import { goToSelfcareLogin, goToSelfcareLogout, SELFCARE_LOGIN_PATH, SELFCARE_LOGOUT_PATH } from '../navigation.utility';

const mockOpenFn = vi.fn();

describe('Tests notification.utility', () => {
  const original = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'open', {
      configurable: true,
      value: mockOpenFn,
    });
  });

  beforeEach(() => {
    mockOpenFn.mockClear();
  });

  afterAll((): void => {
    Object.defineProperty(window, 'open', { configurable: true, value: original });
  });

  it('goToSelfcareLogin', () => {
    goToSelfcareLogin();
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    const url = `${getConfiguration().SELFCARE_BASE_URL}${SELFCARE_LOGIN_PATH}`
    expect(mockOpenFn).toHaveBeenCalledWith(url, '_self');
  });
  
  it('goToSelfcareLogout', () => {
    goToSelfcareLogout();
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    const url = `${getConfiguration().SELFCARE_BASE_URL}${SELFCARE_LOGOUT_PATH}`
    expect(mockOpenFn).toHaveBeenCalledWith(url, '_self');
  });
});
