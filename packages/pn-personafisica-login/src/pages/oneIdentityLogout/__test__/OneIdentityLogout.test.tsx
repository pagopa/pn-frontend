import { AppRouteParams } from '@pagopa-pn/pn-commons';

import { render } from '../../../__test__/test-utils';
import {
  ROUTE_ONE_IDENTITY_LOGIN,
  ROUTE_ONE_IDENTITY_LOGOUT,
} from '../../../navigation/routes.const';
import {
  storageOneIdentityNonce,
  storageOneIdentityState,
  storageRapidAccessOps,
} from '../../../utility/storage';
import OneIdentityLogout from '../OneIdentityLogout';

describe('One Identity Logout Page', () => {
  it('should handle one identity logout successfully', () => {
    storageRapidAccessOps.write([AppRouteParams.AAR, 'aar-test']);
    storageOneIdentityNonce.write('123');
    storageOneIdentityState.write('123');

    const { router } = render(<OneIdentityLogout />);
    expect(storageRapidAccessOps.read()).toBeUndefined();
    expect(storageOneIdentityNonce.read()).toBeUndefined();
    expect(storageOneIdentityState.read()).toBeUndefined();

    expect(router.state.location.pathname).toBe(ROUTE_ONE_IDENTITY_LOGIN);
    expect(router.state.historyAction).toBe('REPLACE');
  });

  it('should handle one identity logout with query params', () => {
    storageRapidAccessOps.write([AppRouteParams.AAR, 'aar-test']);
    storageOneIdentityNonce.write('123');
    storageOneIdentityState.write('123');

    const { router } = render(<OneIdentityLogout />, {
      route: ROUTE_ONE_IDENTITY_LOGOUT + '?aar=123456',
    });
    expect(storageRapidAccessOps.read()).toBeUndefined();
    expect(storageOneIdentityNonce.read()).toBeUndefined();
    expect(storageOneIdentityState.read()).toBeUndefined();

    expect(router.state.location.pathname).toBe(ROUTE_ONE_IDENTITY_LOGIN);
    expect(router.state.location.search).toBe('?aar=123456');
    expect(router.state.historyAction).toBe('REPLACE');
  });
});
