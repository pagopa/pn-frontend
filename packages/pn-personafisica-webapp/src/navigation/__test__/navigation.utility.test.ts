import { EventPageType } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../../services/configuration.service';
import { getCurrentEventTypePage, goToLoginPortal } from '../navigation.utility';
import { APP_STATUS, DELEGHE, DETTAGLIO_NOTIFICA, NOTIFICHE, RECAPITI } from '../routes.const';

const replaceFn = jest.fn();

describe('Tests navigation utility methods', () => {
  const original = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '', replace: replaceFn },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll((): void => {
    Object.defineProperty(window, 'location', { writable: true, value: original });
  });

  it('goToLoginPortal', () => {
    goToLoginPortal();
    expect(replaceFn).toBeCalledTimes(1);
    expect(replaceFn).toBeCalledWith(`${getConfiguration().URL_FE_LOGOUT}`);
  });

  it('goToLoginPortal - aar', () => {
    goToLoginPortal('fake-aar-token');
    expect(replaceFn).toBeCalledTimes(1);
    expect(replaceFn).toBeCalledWith(`${getConfiguration().URL_FE_LOGOUT}?aar=fake-aar-token`);
  });

  it('goToLoginPortal - aar with malicious code', () => {
    goToLoginPortal('<script>malicious code</script>malicious-aar-token');
    expect(replaceFn).toBeCalledTimes(1);
    expect(replaceFn).toBeCalledWith(`${getConfiguration().URL_FE_LOGOUT}?aar=malicious-aar-token`);
  });

  it('getCurrentPage - test for notifications list page', () => {
    const currentPage = getCurrentEventTypePage(`${NOTIFICHE}`);
    expect(currentPage).toBe(EventPageType.LISTA_NOTIFICHE);
  });

  it('getCurrentPage - test for notification detail page', () => {
    const currentPage = getCurrentEventTypePage(`${DETTAGLIO_NOTIFICA.replace(':id', 'mocked-iun')}`);
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
