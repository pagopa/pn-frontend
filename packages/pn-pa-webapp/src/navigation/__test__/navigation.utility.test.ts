import { vi } from 'vitest';

import { getConfiguration } from '../../services/configuration.service';
import { goToPartnerPortal, goToSelfcareLogin, goToSelfcareLogout } from '../navigation.utility';
import {
  SELFCARE_LOGIN_PATH,
  SELFCARE_LOGOUT_GOOGLE_PATH,
  SELFCARE_LOGOUT_PATH,
} from '../routes.const';

const mockOpenFn = vi.fn();
const mockReplaceFn = vi.fn();

describe('Tests notification.utility', () => {
  beforeAll(() => {
    vi.stubGlobal('open', mockOpenFn);
    vi.stubGlobal('location', { replace: mockReplaceFn });
  });

  beforeEach(() => {
    mockOpenFn.mockClear();
    mockReplaceFn.mockClear();
  });

  afterAll((): void => {
    vi.unstubAllGlobals();
  });

  it('goToSelfcareLogin', () => {
    goToSelfcareLogin();
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    const url = `${getConfiguration().SELFCARE_BASE_URL}${SELFCARE_LOGIN_PATH}`;
    expect(mockOpenFn).toHaveBeenCalledWith(url, '_self');
  });

  it('goToSelfcareLogout - basic user', () => {
    goToSelfcareLogout(false);
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    const url = `${getConfiguration().SELFCARE_BASE_URL}${SELFCARE_LOGOUT_PATH}`;
    expect(mockOpenFn).toHaveBeenCalledWith(url, '_self');
  });

  it('goToSelfcareLogout - support user', () => {
    goToSelfcareLogout(true);
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    const url = `${getConfiguration().SELFCARE_BASE_URL}${SELFCARE_LOGOUT_GOOGLE_PATH}`;
    expect(mockOpenFn).toHaveBeenCalledWith(url, '_self');
  });

  it('goToPartnerPortal', () => {
    goToPartnerPortal('mocked-token', 'en');
    expect(mockReplaceFn).toHaveBeenCalledTimes(1);
    expect(mockReplaceFn).toHaveBeenCalledWith(
      `${getConfiguration().PARTNER_PORTAL_URL}#selfCareToken=mocked-token&lang=en`
    );
  });
});
