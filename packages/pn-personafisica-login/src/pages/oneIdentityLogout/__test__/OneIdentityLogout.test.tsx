import { render } from '../../../__test__/test-utils';
import { ROUTE_LOGIN, ROUTE_LOGOUT } from '../../../navigation/routes.const';
import OneIdentityLogout from '../OneIdentityLogout';

describe('One Identity Logout Page', () => {
  it('should handle one identity logout successfully', () => {
    const { router } = render(<OneIdentityLogout />);

    expect(router.state.location.pathname).toBe(ROUTE_LOGIN);
    expect(router.state.historyAction).toBe('REPLACE');
  });

  it('should handle one identity logout with query params', () => {
    const { router } = render(<OneIdentityLogout />, {
      route: ROUTE_LOGOUT + '?aar=123456',
    });

    expect(router.state.location.pathname).toBe(ROUTE_LOGIN);
    expect(router.state.location.search).toBe('?aar=123456');
    expect(router.state.historyAction).toBe('REPLACE');
  });
});
