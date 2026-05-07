import { vi } from 'vitest';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';
import { waitFor } from '@testing-library/react';

import { fireEvent, render, screen } from '../../../__test__/test-utils';
import { OneIdentityApi } from '../../../api/OneIdentity/OneIdentity.api';
import { ROUTE_ONE_IDENTITY_LOGIN } from '../../../navigation/routes.const';
import OneIdentityLoginError from '../OneIdentityLoginError';

vi.mock('../../../api/OneIdentity/OneIdentity.api', () => ({
  OneIdentityApi: {
    getOidcStateData: vi.fn(),
  },
}));

describe('OneIdentityLoginError component', () => {
  const mockState = 'mock-state-123';
  const mockIdp = 'mock-idp';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(OneIdentityApi.getOidcStateData).mockResolvedValue({
      nonce: 'mock-nonce',
      idp: mockIdp,
    });
  });

  describe('rendering', () => {
    it('renders the error dialog with title and default message', () => {
      render(<OneIdentityLoginError />);
      const errorDialog = getById(document.body, 'oneIdentityErrorDialog');
      expect(errorDialog).toHaveTextContent('loginError.title');
      expect(getById(errorDialog, 'message')).toHaveTextContent('loginError.message');
    });

    it.each([
      ['invalid_scope', 'loginError.oneIdentity.invalid_scope'],
      ['unsupported_response_type', 'loginError.oneIdentity.unsupported_response_type'],
      ['server_error', 'loginError.oneIdentity.server_error'],
      ['invalid_request', 'loginError.oneIdentity.invalid_request'],
      ['unknown_error', 'loginError.message'],
    ])('shows correct message for error=%s', (error, expectedKey) => {
      render(<OneIdentityLoginError />, { route: `/?error=${error}` });
      expect(
        getById(getById(document.body, 'oneIdentityErrorDialog'), 'message')
      ).toHaveTextContent(expectedKey);
    });
  });

  describe('loading state', () => {
    it('button is enabled immediately when no state param', () => {
      render(<OneIdentityLoginError />);
      expect(getById(document.body, 'login-button')).not.toBeDisabled();
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('button is disabled with spinner while API is pending', () => {
      vi.mocked(OneIdentityApi.getOidcStateData).mockReturnValue(new Promise(() => {}));
      render(<OneIdentityLoginError />, { route: `/?state=${mockState}` });
      expect(getById(document.body, 'login-button')).toBeDisabled();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('button is enabled without spinner after API resolves', async () => {
      render(<OneIdentityLoginError />, { route: `/?state=${mockState}` });
      await waitFor(() => expect(getById(document.body, 'login-button')).not.toBeDisabled());
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('button is enabled without spinner after API rejects', async () => {
      vi.mocked(OneIdentityApi.getOidcStateData).mockRejectedValue(new Error('API error'));
      render(<OneIdentityLoginError />, { route: `/?state=${mockState}` });
      await waitFor(() => expect(getById(document.body, 'login-button')).not.toBeDisabled());
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  describe('API integration', () => {
    it('calls getOidcStateData with state param', async () => {
      render(<OneIdentityLoginError />, { route: `/?state=${mockState}` });
      await waitFor(() => expect(OneIdentityApi.getOidcStateData).toHaveBeenCalledWith(mockState));
    });

    it('does not call getOidcStateData when no state param', () => {
      render(<OneIdentityLoginError />);
      expect(OneIdentityApi.getOidcStateData).not.toHaveBeenCalled();
    });
  });

  describe('navigation on button click', () => {
    it('navigates to login without params when no state param', async () => {
      const { router } = render(<OneIdentityLoginError />);
      fireEvent.click(getById(document.body, 'login-button'));
      await waitFor(() => expect(router.state.location.pathname).toBe(ROUTE_ONE_IDENTITY_LOGIN));
      expect(router.state.location.search).toBe('');
    });

    it('navigates to login without params when API call fails', async () => {
      vi.mocked(OneIdentityApi.getOidcStateData).mockRejectedValue(new Error('API error'));
      const { router } = render(<OneIdentityLoginError />, { route: `/?state=${mockState}` });
      await waitFor(() => expect(getById(document.body, 'login-button')).not.toBeDisabled());
      fireEvent.click(getById(document.body, 'login-button'));
      await waitFor(() => expect(router.state.location.pathname).toBe(ROUTE_ONE_IDENTITY_LOGIN));
      expect(router.state.location.search).toBe('');
    });

    it('navigates to login without params when API returns no rapid access', async () => {
      const { router } = render(<OneIdentityLoginError />, { route: `/?state=${mockState}` });
      await waitFor(() => expect(getById(document.body, 'login-button')).not.toBeDisabled());
      fireEvent.click(getById(document.body, 'login-button'));
      await waitFor(() => expect(router.state.location.pathname).toBe(ROUTE_ONE_IDENTITY_LOGIN));
      expect(router.state.location.search).toBe('');
    });

    it('navigates to login with aar param', async () => {
      vi.mocked(OneIdentityApi.getOidcStateData).mockResolvedValue({
        nonce: 'mock-nonce',
        idp: mockIdp,
        aar: 'aar-token',
      });
      const { router } = render(<OneIdentityLoginError />, { route: `/?state=${mockState}` });
      await waitFor(() => expect(getById(document.body, 'login-button')).not.toBeDisabled());
      fireEvent.click(getById(document.body, 'login-button'));
      await waitFor(() => expect(router.state.location.pathname).toBe(ROUTE_ONE_IDENTITY_LOGIN));
      expect(router.state.location.search).toBe('?aar=aar-token');
    });

    it('navigates to login with retrievalId param', async () => {
      vi.mocked(OneIdentityApi.getOidcStateData).mockResolvedValue({
        nonce: 'mock-nonce',
        idp: mockIdp,
        retrievalId: 'retrieval-id',
      });
      const { router } = render(<OneIdentityLoginError />, { route: `/?state=${mockState}` });
      await waitFor(() => expect(getById(document.body, 'login-button')).not.toBeDisabled());
      fireEvent.click(getById(document.body, 'login-button'));
      await waitFor(() => expect(router.state.location.pathname).toBe(ROUTE_ONE_IDENTITY_LOGIN));
      expect(router.state.location.search).toBe('?retrievalId=retrieval-id');
    });
  });
});
