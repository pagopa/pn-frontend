import { getById } from '@pagopa-pn/pn-commons/src/test-utils';
import { waitFor } from '@testing-library/react';

import { fireEvent, render } from '../../../__test__/test-utils';
import { ROUTE_ONE_IDENTITY_LOGIN } from '../../../navigation/routes.const';
import OneIdentityLoginError from '../OneIdentityLoginError';

describe('OneIdentityLoginError component', () => {
  it('renders the error dialog with title and default message', () => {
    render(<OneIdentityLoginError />);
    const errorDialog = getById(document.body, 'oneIdentityErrorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');
    expect(getById(errorDialog, 'message')).toHaveTextContent('loginError.message');
  });

  it('navigates to login on button click', async () => {
    const { router } = render(<OneIdentityLoginError />);
    fireEvent.click(getById(document.body, 'login-button'));
    await waitFor(() => expect(router.state.location.pathname).toBe(ROUTE_ONE_IDENTITY_LOGIN));
    expect(router.state.location.search).toBe('');
  });
});
