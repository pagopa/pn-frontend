import { vi } from 'vitest';

import { waitFor } from '@testing-library/react';

import { render } from '../../../__test__/test-utils';
import { ROUTE_ONE_IDENTITY_LOGIN_ERROR } from '../../../navigation/routes.const';
import { getConfiguration } from '../../../services/configuration.service';
import OneIdentityCallback from '../OneIdentityCallback';

const mockLocationReplace = vi.fn();

describe('OneIdentityCallback component', () => {
  const mockState = 'mock-state-123';
  const mockCode = 'mock-code-456';

  const checkHashParams = (hashParams: URLSearchParams) => {
    expect(hashParams.get('code')).toBe(mockCode);
    expect(hashParams.get('state')).toBe(mockState);
    expect(hashParams.get('lang')).toBe('it');
  };

  beforeAll(() => {
    vi.stubGlobal('location', { replace: mockLocationReplace });
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.unstubAllGlobals();
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

  it('should navigate to error route when code is missing', async () => {
    const { router } = render(<OneIdentityCallback />, { route: `/?state=${mockState}` });

    await waitFor(() =>
      expect(router.state.location.pathname).toBe(ROUTE_ONE_IDENTITY_LOGIN_ERROR)
    );
    expect(router.state.location.search).toBe(`?state=${mockState}`);
    expect(router.state.historyAction).toBe('REPLACE');
    expect(mockLocationReplace).not.toHaveBeenCalled();
  });

  it('should navigate to error route when state is missing', async () => {
    const { router } = render(<OneIdentityCallback />, { route: `/?code=${mockCode}` });

    await waitFor(() =>
      expect(router.state.location.pathname).toBe(ROUTE_ONE_IDENTITY_LOGIN_ERROR)
    );
    expect(router.state.location.search).toBe('');
    expect(router.state.historyAction).toBe('REPLACE');
    expect(mockLocationReplace).not.toHaveBeenCalled();
  });

  it('should navigate to error route with error param forwarded', async () => {
    const { router } = render(<OneIdentityCallback />, {
      route: '/auth/callback?error=invalid_scope',
    });

    await waitFor(() =>
      expect(router.state.location.pathname).toBe(ROUTE_ONE_IDENTITY_LOGIN_ERROR)
    );
    expect(router.state.location.search).toBe('?error=invalid_scope');
    expect(router.state.historyAction).toBe('REPLACE');
    expect(mockLocationReplace).not.toHaveBeenCalled();
  });

  it('should navigate to error route when error param is present alongside code and state', async () => {
    const { router } = render(<OneIdentityCallback />, {
      route: `/auth/callback?error=invalid_scope&code=${mockCode}&state=${mockState}`,
    });

    await waitFor(() =>
      expect(router.state.location.pathname).toBe(ROUTE_ONE_IDENTITY_LOGIN_ERROR)
    );
    expect(router.state.location.search).toBe(`?state=${mockState}&error=invalid_scope`);
    expect(router.state.historyAction).toBe('REPLACE');
    expect(mockLocationReplace).not.toHaveBeenCalled();
  });
});
