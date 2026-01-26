import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';

import { render } from '../../../__test__/test-utils';
import {
  ROUTE_ONE_IDENTITY_LOGIN_ERROR,
  oneIdentityRedirectUriPath,
} from '../../../navigation/routes.const';
import { getConfiguration } from '../../../services/configuration.service';
import {
  storageOneIdentityNonce,
  storageOneIdentityState,
  storageRapidAccessOps,
} from '../../../utility/storage';
import OneIdentityCallback from '../OneIdentityCallback';

const mockLocationReplace = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to, replace }: { to: string; replace?: boolean }) => {
      mockNavigate(to, replace);
      return null;
    },
  };
});

describe('OneIdentityCallback component', () => {
  const original = window.location;
  const mockState = 'mock-state-123';
  const mockCode = 'mock-code-456';
  const mockNonce = 'mock-nonce-789';

  const setWindowLocation = (search: string) => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        replace: mockLocationReplace,
        search,
      },
    });
  };

  const checkHashParams = (hashParams: URLSearchParams) => {
    const { PF_URL } = getConfiguration();
    expect(hashParams.get('code')).toBe(mockCode);
    expect(hashParams.get('state')).toBe(mockState);
    expect(hashParams.get('nonce')).toBe(mockNonce);
    expect(hashParams.get('lang')).toBe('it');
    expect(hashParams.get('redirect_uri')).toBe(
      encodeURIComponent(`${PF_URL}${oneIdentityRedirectUriPath}`)
    );
  };

  afterAll(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    storageOneIdentityState.write(mockState);
    storageOneIdentityNonce.write(mockNonce);
    storageRapidAccessOps.delete();

    setWindowLocation(`?state=${mockState}&code=${mockCode}`);
  });

  afterEach(() => {
    storageOneIdentityState.delete();
    storageOneIdentityNonce.delete();
    storageRapidAccessOps.delete();
  });

  it('should redirect with correct hash params', () => {
    render(
      <BrowserRouter>
        <OneIdentityCallback />
      </BrowserRouter>
    );

    expect(mockLocationReplace).toHaveBeenCalled();
    const calledUrl = mockLocationReplace.mock.calls[0][0];

    expect(calledUrl).toContain(getConfiguration().PF_URL);

    const url = new URL(calledUrl);
    const hashParams = new URLSearchParams(url.hash.substring(1));

    checkHashParams(hashParams);
  });

  it('should redirect with rapid access (aar)', () => {
    storageRapidAccessOps.write([AppRouteParams.AAR, 'aar-token']);

    render(
      <BrowserRouter>
        <OneIdentityCallback />
      </BrowserRouter>
    );

    expect(mockLocationReplace).toHaveBeenCalled();
    const calledUrl = mockLocationReplace.mock.calls[0][0];

    const url = new URL(calledUrl);
    const queryParams = new URLSearchParams(url.search);
    const hashParams = new URLSearchParams(url.hash.substring(1));

    expect(queryParams.get('aar')).toBe('aar-token');

    checkHashParams(hashParams);
  });

  it('should redirect with rapid access (retrievalId)', () => {
    storageRapidAccessOps.write([AppRouteParams.RETRIEVAL_ID, 'retrieval-id']);

    render(
      <BrowserRouter>
        <OneIdentityCallback />
      </BrowserRouter>
    );

    expect(mockLocationReplace).toHaveBeenCalled();
    const calledUrl = mockLocationReplace.mock.calls[0][0];

    const url = new URL(calledUrl);
    const queryParams = new URLSearchParams(url.search);
    const hashParams = new URLSearchParams(url.hash.substring(1));

    expect(queryParams.get('retrievalId')).toBe('retrieval-id');

    checkHashParams(hashParams);
  });

  it('should sanitize rapid access parameter (XSS protection)', () => {
    storageRapidAccessOps.write([AppRouteParams.AAR, '<script>some-code</script>aar-token']);

    render(
      <BrowserRouter>
        <OneIdentityCallback />
      </BrowserRouter>
    );

    expect(mockLocationReplace).toHaveBeenCalled();
    const calledUrl = mockLocationReplace.mock.calls[0][0];

    expect(calledUrl).not.toContain('<script>');
    expect(calledUrl).not.toContain('</script>');

    const url = new URL(calledUrl);
    const queryParams = new URLSearchParams(url.search);
    const aarValue = queryParams.get('aar');

    expect(aarValue).not.toContain('<script>');
    expect(aarValue).not.toContain('</script>');
  });

  it('should navigate to error route when state does not match', () => {
    storageOneIdentityState.write('different-state');

    render(
      <BrowserRouter>
        <OneIdentityCallback />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith(ROUTE_ONE_IDENTITY_LOGIN_ERROR, true);
    expect(mockLocationReplace).not.toHaveBeenCalled();
  });

  it('should navigate to error route when code is missing', () => {
    setWindowLocation(`?state=${mockState}`);

    render(
      <BrowserRouter>
        <OneIdentityCallback />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith(ROUTE_ONE_IDENTITY_LOGIN_ERROR, true);
    expect(mockLocationReplace).not.toHaveBeenCalled();
  });

  it('should navigate to error route when state is missing', () => {
    setWindowLocation(`?code=${mockCode}`);

    render(
      <BrowserRouter>
        <OneIdentityCallback />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith(ROUTE_ONE_IDENTITY_LOGIN_ERROR, true);
    expect(mockLocationReplace).not.toHaveBeenCalled();
  });

  it('should navigate to error route when nonce is missing from storage', () => {
    storageOneIdentityNonce.delete();

    render(
      <BrowserRouter>
        <OneIdentityCallback />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith(ROUTE_ONE_IDENTITY_LOGIN_ERROR, true);
    expect(mockLocationReplace).not.toHaveBeenCalled();
  });

  it('should clean up storage after successful redirect', () => {
    const deleteStateSpy = vi.spyOn(storageOneIdentityState, 'delete');
    const deleteNonceSpy = vi.spyOn(storageOneIdentityNonce, 'delete');
    const deleteRapidAccessSpy = vi.spyOn(storageRapidAccessOps, 'delete');

    storageRapidAccessOps.write([AppRouteParams.AAR, 'aar-token']);

    render(
      <BrowserRouter>
        <OneIdentityCallback />
      </BrowserRouter>
    );

    expect(deleteStateSpy).toHaveBeenCalledTimes(1);
    expect(deleteNonceSpy).toHaveBeenCalledTimes(1);
    expect(deleteRapidAccessSpy).toHaveBeenCalledTimes(1);
  });

  it('should not include query params when rapid access is not present', () => {
    render(
      <BrowserRouter>
        <OneIdentityCallback />
      </BrowserRouter>
    );

    expect(mockLocationReplace).toHaveBeenCalled();
    const calledUrl = mockLocationReplace.mock.calls[0][0];

    const url = new URL(calledUrl);

    expect(url.search).toBe('');
    expect(url).not.toContain('?');

    const hashParams = new URLSearchParams(url.hash.substring(1));

    checkHashParams(hashParams);
  });
});
