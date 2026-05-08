import { vi } from 'vitest';

import { waitFor } from '@testing-library/react';

import { render } from '../../../__test__/test-utils';
import { OneIdentityApi } from '../../../api/OneIdentity/OneIdentity.api';
import { ROUTE_ONE_IDENTITY_LOGIN_ERROR } from '../../../navigation/routes.const';
import { getConfiguration } from '../../../services/configuration.service';
import OneIdentityCallback from '../OneIdentityCallback';

const mockLocationReplace = vi.fn();

vi.mock('../../../api/OneIdentity/OneIdentity.api', () => ({
  OneIdentityApi: {
    getOidcStateData: vi.fn(),
  },
}));

describe('OneIdentityCallback component', () => {
  const original = globalThis.location;
  const mockState = 'mock-state-123';
  const mockCode = 'mock-code-456';
  const mockNonce = 'mock-nonce-789';
  const mockIdp = 'mock-idp';

  const checkHashParams = (hashParams: URLSearchParams) => {
    expect(hashParams.get('code')).toBe(mockCode);
    expect(hashParams.get('state')).toBe(mockState);
    expect(hashParams.get('nonce')).toBe(mockNonce);
    expect(hashParams.get('lang')).toBe('it');
  };

  beforeAll(() => {
    Object.defineProperty(globalThis, 'location', {
      configurable: true,
      value: {
        replace: mockLocationReplace,
      },
    });
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(OneIdentityApi.getOidcStateData).mockResolvedValue({
      nonce: mockNonce,
      idp: mockIdp,
    });
  });

  afterAll(() => {
    Object.defineProperty(globalThis, 'location', { configurable: true, value: original });
  });

  it('should redirect with correct hash params', async () => {
    render(<OneIdentityCallback />, { route: `/?state=${mockState}&code=${mockCode}` });

    await waitFor(() => expect(mockLocationReplace).toHaveBeenCalled());

    const calledUrl = mockLocationReplace.mock.calls[0][0];
    expect(calledUrl).toContain(getConfiguration().PF_URL);

    const url = new URL(calledUrl);
    const hashParams = new URLSearchParams(url.hash.substring(1));

    checkHashParams(hashParams);
  });

  it('should call getOidcStateData with the state param', async () => {
    render(<OneIdentityCallback />, { route: `/?state=${mockState}&code=${mockCode}` });

    await waitFor(() => expect(OneIdentityApi.getOidcStateData).toHaveBeenCalledWith(mockState));
  });

  it('should redirect with rapid access (aar)', async () => {
    vi.mocked(OneIdentityApi.getOidcStateData).mockResolvedValue({
      nonce: mockNonce,
      idp: mockIdp,
      aar: 'aar-token',
    });

    render(<OneIdentityCallback />, { route: `/?state=${mockState}&code=${mockCode}` });

    await waitFor(() => expect(mockLocationReplace).toHaveBeenCalled());

    const calledUrl = mockLocationReplace.mock.calls[0][0];
    const url = new URL(calledUrl);
    const queryParams = new URLSearchParams(url.search);
    const hashParams = new URLSearchParams(url.hash.substring(1));

    expect(queryParams.get('aar')).toBe('aar-token');
    checkHashParams(hashParams);
  });

  it('should redirect with rapid access (retrievalId)', async () => {
    vi.mocked(OneIdentityApi.getOidcStateData).mockResolvedValue({
      nonce: mockNonce,
      idp: mockIdp,
      retrievalId: 'retrieval-id',
    });

    render(<OneIdentityCallback />, { route: `/?state=${mockState}&code=${mockCode}` });

    await waitFor(() => expect(mockLocationReplace).toHaveBeenCalled());

    const calledUrl = mockLocationReplace.mock.calls[0][0];
    const url = new URL(calledUrl);
    const queryParams = new URLSearchParams(url.search);
    const hashParams = new URLSearchParams(url.hash.substring(1));

    expect(queryParams.get('retrievalId')).toBe('retrieval-id');
    checkHashParams(hashParams);
  });

  it('should sanitize rapid access parameter (XSS protection)', async () => {
    vi.mocked(OneIdentityApi.getOidcStateData).mockResolvedValue({
      nonce: mockNonce,
      idp: mockIdp,
      aar: '<script>some-code</script>aar-token',
    });

    render(<OneIdentityCallback />, { route: `/?state=${mockState}&code=${mockCode}` });

    await waitFor(() => expect(mockLocationReplace).toHaveBeenCalled());

    const calledUrl = mockLocationReplace.mock.calls[0][0];

    expect(calledUrl).not.toContain('<script>');
    expect(calledUrl).not.toContain('</script>');

    const url = new URL(calledUrl);
    const queryParams = new URLSearchParams(url.search);
    const aarValue = queryParams.get('aar');

    expect(aarValue).not.toContain('<script>');
    expect(aarValue).not.toContain('</script>');
  });

  it('should navigate to error route when code is missing', async () => {
    const { router } = render(<OneIdentityCallback />, { route: `/?state=${mockState}` });

    await waitFor(() => expect(router.state.location.pathname).toBe(ROUTE_ONE_IDENTITY_LOGIN_ERROR));
    expect(router.state.location.search).toBe(`?state=${mockState}`);
    expect(router.state.historyAction).toBe('REPLACE');
    expect(mockLocationReplace).not.toHaveBeenCalled();
  });

  it('should navigate to error route when state is missing', async () => {
    const { router } = render(<OneIdentityCallback />, { route: `/?code=${mockCode}` });

    await waitFor(() => expect(router.state.location.pathname).toBe(ROUTE_ONE_IDENTITY_LOGIN_ERROR));
    expect(router.state.location.search).toBe('');
    expect(router.state.historyAction).toBe('REPLACE');
    expect(mockLocationReplace).not.toHaveBeenCalled();
  });

  it('should navigate to error route with error param forwarded', async () => {
    const { router } = render(<OneIdentityCallback />, {
      route: '/auth/callback?error=invalid_scope',
    });

    await waitFor(() => expect(router.state.location.pathname).toBe(ROUTE_ONE_IDENTITY_LOGIN_ERROR));
    expect(router.state.location.search).toBe('?error=invalid_scope');
    expect(router.state.historyAction).toBe('REPLACE');
    expect(mockLocationReplace).not.toHaveBeenCalled();
  });

  it('should navigate to error route when error param is present alongside code and state', async () => {
    const { router } = render(<OneIdentityCallback />, {
      route: `/auth/callback?error=invalid_scope&code=${mockCode}&state=${mockState}`,
    });

    await waitFor(() => expect(router.state.location.pathname).toBe(ROUTE_ONE_IDENTITY_LOGIN_ERROR));
    expect(router.state.location.search).toBe(`?state=${mockState}&error=invalid_scope`);
    expect(router.state.historyAction).toBe('REPLACE');
    expect(mockLocationReplace).not.toHaveBeenCalled();
  });

  it('should navigate to error route when API call fails', async () => {
    vi.mocked(OneIdentityApi.getOidcStateData).mockRejectedValue(new Error('API error'));

    const { router } = render(<OneIdentityCallback />, {
      route: `/auth/callback?state=${mockState}&code=${mockCode}`,
    });

    await waitFor(() => expect(router.state.location.pathname).toBe(ROUTE_ONE_IDENTITY_LOGIN_ERROR));
    expect(router.state.location.search).toBe(`?state=${mockState}`);
    expect(router.state.historyAction).toBe('REPLACE');
    expect(mockLocationReplace).not.toHaveBeenCalled();
  });

  it('should not include query params when rapid access is not present', async () => {
    render(<OneIdentityCallback />, { route: `/?state=${mockState}&code=${mockCode}` });

    await waitFor(() => expect(mockLocationReplace).toHaveBeenCalled());

    const calledUrl = mockLocationReplace.mock.calls[0][0];
    const url = new URL(calledUrl);

    expect(url.search).toBe('');

    const hashParams = new URLSearchParams(url.hash.substring(1));
    checkHashParams(hashParams);
  });
});
