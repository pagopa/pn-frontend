import { getById, waitFor } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render } from '../../../__test__/test-utils';
import { ROUTE_ONE_IDENTITY_LOGIN } from '../../../navigation/routes.const';
import OneIdentityLoginError from '../OneIdentityLoginError';

describe('OneIdentityLoginError component', () => {
  it('should render component and navigate to login page on button click', async () => {
    const { router } = render(<OneIdentityLoginError />);

    const errorDialog = getById(document.body, 'oneIdentityErrorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');

    const message = getById(errorDialog, 'message');
    expect(message).toHaveTextContent('loginError.message');

    const buttonRedirect = getById(document.body, 'login-button');
    fireEvent.click(buttonRedirect);

    await waitFor(() => {
      expect(router.state.location.pathname).toBe(ROUTE_ONE_IDENTITY_LOGIN);
    });
  });
});
