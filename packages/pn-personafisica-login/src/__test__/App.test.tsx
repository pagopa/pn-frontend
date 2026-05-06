import { vi } from 'vitest';

import { getById, queryById } from '@pagopa-pn/pn-commons/src/test-utils';

import App from '../App';
import { ROUTE_LOGIN_ERROR, ROUTE_LOGOUT } from '../navigation/routes.const';
import { render } from './test-utils';

// mock imports
// This is needed to test the logout page.
// If we don't mock the useNavigate, when logout page is shown an immediate redirect happens and the test fails.
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => vi.fn(),
}));

describe('App', () => {
  it('inital page', () => {
    const { container } = render(<App />);
    const loginPage = getById(container, 'loginPage');
    expect(loginPage).toBeInTheDocument();
    const errorDialog = queryById(document.body, 'errorDialog');
    expect(errorDialog).not.toBeInTheDocument();
  });

  it('logout page', () => {
    const { container } = render(<App />, { route: ROUTE_LOGOUT });
    const loginPage = queryById(container, 'loginPage');
    expect(loginPage).not.toBeInTheDocument();
    const errorDialog = queryById(document.body, 'errorDialog');
    expect(errorDialog).not.toBeInTheDocument();
  });

  it('login error', () => {
    const { container } = render(<App />, { route: ROUTE_LOGIN_ERROR });
    const loginPage = queryById(container, 'loginPage');
    expect(loginPage).not.toBeInTheDocument();
    const errorDialog = getById(document.body, 'errorDialog');
    expect(errorDialog).toBeInTheDocument();
  });
});
