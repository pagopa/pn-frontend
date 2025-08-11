import { vi } from 'vitest';

import { AppRouteParams, EventPageType } from '@pagopa-pn/pn-commons';

import { getCurrentEventTypePage, goToLoginPortal } from '../navigation.utility';
import {
  APP_STATUS,
  DELEGHE,
  DETTAGLIO_NOTIFICA,
  LOGOUT,
  NOTIFICHE,
  RECAPITI,
} from '../routes.const';

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
    expect(mockOpenFn).toBeCalledWith(`${LOGOUT}`, '_self');
  });

  it('goToLoginPortal - aar', () => {
    goToLoginPortal({ param: AppRouteParams.AAR, value: 'fake-aar-token' });
    expect(mockOpenFn).toBeCalledTimes(1);
    expect(mockOpenFn).toBeCalledWith(`${LOGOUT}?aar=fake-aar-token`, '_self');
  });

  it('goToLoginPortal - retrievalId', () => {
    goToLoginPortal({ param: AppRouteParams.RETRIEVAL_ID, value: 'fake-id' });
    expect(mockOpenFn).toBeCalledTimes(1);
    expect(mockOpenFn).toBeCalledWith(`${LOGOUT}?retrievalId=fake-id`, '_self');
  });

  it('goToLoginPortal - aar with malicious code', () => {
    goToLoginPortal({ param: AppRouteParams.AAR, value: '<script>malicious code</script>malicious-aar-token' });
    expect(mockOpenFn).toBeCalledTimes(1);
    expect(mockOpenFn).toBeCalledWith(`${LOGOUT}?aar=malicious-aar-token`, '_self');
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
