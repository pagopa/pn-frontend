import { vi } from 'vitest';

import { AppRouteParams, EventPageType } from '@pagopa-pn/pn-commons';

import { LoginProvider } from '../../models/User';
import { UTM_KEY } from '../../utility/utm.utility';
import { getCurrentEventTypePage, goToLoginPortal } from '../navigation.utility';
import {
  APP_STATUS,
  DELEGHE,
  DETTAGLIO_NOTIFICA,
  LOGOUT,
  LOGOUT_OI,
  NOTIFICHE,
  RECAPITI,
} from '../routes.const';

const mockOpenFn = vi.fn();

describe('Tests navigation utility methods', () => {
  beforeAll(() => {
    vi.stubGlobal('open', mockOpenFn);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll((): void => {
    vi.unstubAllGlobals();
  });

  it('goToLoginPortal', () => {
    goToLoginPortal({ loginProvider: LoginProvider.SPIDHUB });
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    expect(mockOpenFn).toHaveBeenCalledWith(`${LOGOUT}`, '_self');
  });

  it('goToLoginPortal - from FIMS', () => {
    goToLoginPortal({ loginProvider: LoginProvider.FIMS });

    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    expect(mockOpenFn).toHaveBeenCalledWith(LOGOUT, '_self');
  });

  it('goToLoginPortal - aar (preserves only utm_*)', () => {
    goToLoginPortal({
      rapidAccess: [AppRouteParams.AAR, 'fake-aar-token'],
      loginProvider: LoginProvider.SPIDHUB,
      search: `?${UTM_KEY.SOURCE}=s&${UTM_KEY.MEDIUM}=m&${UTM_KEY.CAMPAIGN}=c&invalid_param=value`,
    });

    expect(mockOpenFn).toHaveBeenCalledTimes(1);

    const [redirectUrl] = mockOpenFn.mock.calls[0];
    const parsed = new URL(redirectUrl as string, 'https://test.pagopa.it');

    expect(parsed.pathname).toBe(LOGOUT);
    expect(parsed.searchParams.get(AppRouteParams.AAR)).toBe('fake-aar-token');
    expect(parsed.searchParams.get(UTM_KEY.SOURCE)).toBe('s');
    expect(parsed.searchParams.get(UTM_KEY.MEDIUM)).toBe('m');
    expect(parsed.searchParams.get(UTM_KEY.CAMPAIGN)).toBe('c');
    expect(parsed.searchParams.has('invalid_param')).toBe(false);
  });

  it('goToLoginPortal - retrievalId (preserves only utm_*)', () => {
    goToLoginPortal({
      rapidAccess: [AppRouteParams.RETRIEVAL_ID, 'fake-id'],
      loginProvider: LoginProvider.SPIDHUB,
      search: `?${UTM_KEY.SOURCE}=s&${UTM_KEY.MEDIUM}=m&${UTM_KEY.CAMPAIGN}=c&invalid_param=value`,
    });

    expect(mockOpenFn).toHaveBeenCalledTimes(1);

    const [redirectUrl] = mockOpenFn.mock.calls[0];
    const parsed = new URL(redirectUrl as string, 'https://test.pagopa.it');

    expect(parsed.pathname).toBe(LOGOUT);
    expect(parsed.searchParams.get(AppRouteParams.RETRIEVAL_ID)).toBe('fake-id');
    expect(parsed.searchParams.get(UTM_KEY.SOURCE)).toBe('s');
    expect(parsed.searchParams.get(UTM_KEY.MEDIUM)).toBe('m');
    expect(parsed.searchParams.get(UTM_KEY.CAMPAIGN)).toBe('c');
    expect(parsed.searchParams.has('invalid_param')).toBe(false);
  });

  it('goToLoginPortal - aar with malicious code', () => {
    goToLoginPortal({
      rapidAccess: [AppRouteParams.AAR, '<script>malicious code</script>malicious-aar-token'],
      loginProvider: LoginProvider.SPIDHUB,
    });

    expect(mockOpenFn).toHaveBeenCalledTimes(1);

    const [redirectUrl] = mockOpenFn.mock.calls[0];
    const parsed = new URL(redirectUrl as string, 'https://test.pagopa.it');

    expect(parsed.pathname).toBe(LOGOUT);
    expect(parsed.searchParams.get(AppRouteParams.AAR)).toBe('malicious-aar-token');
  });

  it('goToLoginPortal - from One Identity', () => {
    goToLoginPortal({ loginProvider: LoginProvider.ONEIDENTITY });
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    expect(mockOpenFn).toHaveBeenCalledWith(`${LOGOUT_OI}`, '_self');
  });

  it('goToLoginPortal - from One Identity with aar', () => {
    goToLoginPortal({
      rapidAccess: [AppRouteParams.AAR, 'fake-aar-token'],
      loginProvider: LoginProvider.ONEIDENTITY,
    });

    expect(mockOpenFn).toHaveBeenCalledTimes(1);

    const [redirectUrl] = mockOpenFn.mock.calls[0];
    const parsed = new URL(redirectUrl as string, 'https://test.pagopa.it');

    expect(parsed.pathname).toBe(LOGOUT_OI);
    expect(parsed.searchParams.get(AppRouteParams.AAR)).toBe('fake-aar-token');
  });

  it('goToLoginPortal - from One Identity with retrievalId', () => {
    goToLoginPortal({
      rapidAccess: [AppRouteParams.RETRIEVAL_ID, 'fake-id'],
      loginProvider: LoginProvider.ONEIDENTITY,
    });

    expect(mockOpenFn).toHaveBeenCalledTimes(1);

    const [redirectUrl] = mockOpenFn.mock.calls[0];
    const parsed = new URL(redirectUrl as string, 'https://test.pagopa.it');

    expect(parsed.pathname).toBe(LOGOUT_OI);
    expect(parsed.searchParams.get(AppRouteParams.RETRIEVAL_ID)).toBe('fake-id');
  });

  it('getCurrentPage - test for notifications list page', () => {
    const currentPage = getCurrentEventTypePage(`${NOTIFICHE}`);
    expect(currentPage).toBe(EventPageType.LISTA_NOTIFICHE);
  });

  it('getCurrentPage - test for notification detail page', () => {
    const currentPage = getCurrentEventTypePage(
      `${DETTAGLIO_NOTIFICA.replace(':id', 'mocked-iun')}`
    );
    expect(currentPage).toBe(EventPageType.DETTAGLIO_NOTIFICA);
  });

  it('getCurrentPage - test for delegates page', () => {
    const currentPage = getCurrentEventTypePage(`${DELEGHE}`);
    expect(currentPage).toBe(EventPageType.LISTA_DELEGHE);
  });

  it('getCurrentPage - test for contacts page', () => {
    const currentPage = getCurrentEventTypePage(`${RECAPITI}`);
    expect(currentPage).toBe(EventPageType.RECAPITI);
  });

  it('getCurrentPage - test for app status page', () => {
    const currentPage = getCurrentEventTypePage(`${APP_STATUS}`);
    expect(currentPage).toBe(EventPageType.STATUS_PAGE);
  });
});
