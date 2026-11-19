import { getById } from '@pagopa-pn/pn-commons/src/test-utils';
import { waitFor } from '@testing-library/react';

import { act, fireEvent, render } from '../../../__test__/test-utils';
import { OneIdentityErrorCode } from '../../../models/OneIdentity';
import { ROUTE_LOGIN } from '../../../navigation/routes.const';
import OneIdentityLoginError from '../OneIdentityLoginError';

describe('OneIdentityLoginError component', () => {
  it('renders the error page with title, message and close button', () => {
    render(<OneIdentityLoginError />, { route: `/?error=${OneIdentityErrorCode.SERVER_ERROR}` });
    const errorPage = getById(document.body, 'oneIdentityLoginError');
    expect(getById(errorPage, 'title')).toHaveTextContent('one-identity-login-error.title');
    expect(getById(errorPage, 'message')).toHaveTextContent('one-identity-login-error.message');
    expect(getById(errorPage, 'close-button')).toHaveTextContent('button.close');
  });

  it('shows the error page without redirecting when authorize fails', async () => {
    // act async flushes any pending navigation triggered by the mount effect
    const { router } = await act(async () =>
      render(<OneIdentityLoginError />, {
        route: `/?error=${OneIdentityErrorCode.AUTHORIZE_ERROR}`,
      })
    );
    expect(getById(document.body, 'oneIdentityLoginError')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
  });

  it('navigates to login on close button click', async () => {
    const { router } = render(<OneIdentityLoginError />, {
      route: `/?error=${OneIdentityErrorCode.SERVER_ERROR}`,
    });
    fireEvent.click(getById(document.body, 'close-button'));
    await waitFor(() => expect(router.state.location.pathname).toBe(ROUTE_LOGIN));
    expect(router.state.location.search).toBe('');
  });

  it('redirects to login immediately when error is unknown', async () => {
    const { router } = render(<OneIdentityLoginError />, { route: '/?error=unknown_error' });
    await waitFor(() => expect(router.state.location.pathname).toBe(ROUTE_LOGIN));
  });

  it('redirects to login immediately when error param is missing', async () => {
    const { router } = render(<OneIdentityLoginError />);
    await waitFor(() => expect(router.state.location.pathname).toBe(ROUTE_LOGIN));
  });
});
