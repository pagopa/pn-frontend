import { getById } from '@pagopa-pn/pn-commons/src/test-utils';
import { waitFor } from '@testing-library/react';

import { fireEvent, render } from '../../../__test__/test-utils';
import { ROUTE_LOGIN } from '../../../navigation/routes.const';
import OneIdentityLoginError from '../OneIdentityLoginError';

describe('OneIdentityLoginError component', () => {
  it('renders the error dialog with title and default message', () => {
    render(<OneIdentityLoginError />, { route: '/?error=server_error' });
    const errorDialog = getById(document.body, 'oneIdentityErrorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');
    expect(getById(errorDialog, 'message')).toHaveTextContent('loginError.message');
  });

  it('navigates to login on button click', async () => {
    const { router } = render(<OneIdentityLoginError />, { route: '/?error=server_error' });
    fireEvent.click(getById(document.body, 'login-button'));
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
