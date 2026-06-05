import { vi } from 'vitest';

import { AppRouteParams, EventPageType } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../../services/configuration.service';
import { UTM_KEY } from '../../utility/utm.utility';
import { getCurrentEventTypePage, goToLoginPortal } from '../navigation.utility';
import {
  APP_STATUS,
  DELEGATI,
  DELEGHE,
  DELEGHEACARICO,
  DIGITAL_DOMICILE,
  DIGITAL_DOMICILE_ACTIVATION,
  DIGITAL_DOMICILE_MANAGEMENT,
  INTEGRAZIONE_API,
  NOTIFICHE,
  NOTIFICHE_DELEGATO,
  NUOVA_DELEGA,
  RECAPITI,
  SELFCARE_LOGOUT,
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

  it('getCurrentEventTypePage returns notification list page', () => {
    expect(getCurrentEventTypePage(NOTIFICHE)).toBe(EventPageType.LISTA_NOTIFICHE);
    expect(getCurrentEventTypePage(NOTIFICHE_DELEGATO)).toBe(EventPageType.LISTA_NOTIFICHE);
  });

  it('getCurrentEventTypePage returns notification detail page', () => {
    expect(getCurrentEventTypePage('/notifiche/IUN123/dettaglio')).toBe(
      EventPageType.DETTAGLIO_NOTIFICA
    );
    expect(getCurrentEventTypePage('/notifiche-delegato/mandate-id/IUN123/dettaglio')).toBe(
      EventPageType.DETTAGLIO_NOTIFICA
    );
  });

  it('getCurrentEventTypePage returns delegations page', () => {
    expect(getCurrentEventTypePage(DELEGHE)).toBe(EventPageType.LISTA_DELEGHE);
    expect(getCurrentEventTypePage(DELEGHEACARICO)).toBe(EventPageType.LISTA_DELEGHE);
    expect(getCurrentEventTypePage(DELEGATI)).toBe(EventPageType.LISTA_DELEGHE);
    expect(getCurrentEventTypePage(NUOVA_DELEGA)).toBe(EventPageType.LISTA_DELEGHE);
  });

  it('getCurrentEventTypePage returns contacts page', () => {
    expect(getCurrentEventTypePage(RECAPITI)).toBe(EventPageType.RECAPITI);
    expect(getCurrentEventTypePage(DIGITAL_DOMICILE)).toBe(EventPageType.RECAPITI);
    expect(getCurrentEventTypePage(DIGITAL_DOMICILE_ACTIVATION)).toBe(EventPageType.RECAPITI);
    expect(getCurrentEventTypePage(DIGITAL_DOMICILE_MANAGEMENT)).toBe(EventPageType.RECAPITI);
  });

  it('getCurrentEventTypePage returns status page', () => {
    expect(getCurrentEventTypePage(APP_STATUS)).toBe(EventPageType.STATUS_PAGE);
  });

  it('getCurrentEventTypePage returns root page', () => {
    expect(getCurrentEventTypePage('/')).toBe(EventPageType.ROOT_PAGE);
  });

  it('getCurrentEventTypePage returns undefined for unmapped pages', () => {
    expect(getCurrentEventTypePage(INTEGRAZIONE_API)).toBeUndefined();
    expect(getCurrentEventTypePage('/unknown')).toBeUndefined();
  });
});
