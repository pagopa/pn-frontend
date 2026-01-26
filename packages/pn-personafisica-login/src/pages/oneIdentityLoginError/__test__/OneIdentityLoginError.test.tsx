import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { getById, waitFor } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render } from '../../../__test__/test-utils';
import { ROUTE_ONE_IDENTITY_LOGIN } from '../../../navigation/routes.const';
import OneIdentityLoginError from '../OneIdentityLoginError';

const mockNavigateFn = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

describe('OneIdentityLoginError component', () => {
  it('should render component and navigate to login page on button click', async () => {
    render(
      <BrowserRouter>
        <OneIdentityLoginError />
      </BrowserRouter>
    );

    const errorDialog = getById(document.body, 'oneIdentityErrorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');

    const message = getById(errorDialog, 'message');
    expect(message).toHaveTextContent('loginError.message');

    const buttonRedirect = getById(document.body, 'login-button');
    fireEvent.click(buttonRedirect);

    await waitFor(() => {
      expect(mockNavigateFn).toHaveBeenCalledTimes(1);
      expect(mockNavigateFn).toHaveBeenCalledWith(ROUTE_ONE_IDENTITY_LOGIN);
    });
  });
});
