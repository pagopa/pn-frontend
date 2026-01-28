import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';

import { render } from '../../../__test__/test-utils';
import { ROUTE_ONE_IDENTITY_LOGIN } from '../../../navigation/routes.const';
import {
  storageOneIdentityNonce,
  storageOneIdentityState,
  storageRapidAccessOps,
} from '../../../utility/storage';
import OneIdentityLogout from '../OneIdentityLogout';

const mockNavigateFn = vi.fn();
const mockLocationReplace = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

const setWindowLocation = (search: string) => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: {
      replace: mockLocationReplace,
      search,
    },
  });
};

describe('One Identity Logout Page', () => {
  beforeEach(() => {
    setWindowLocation('');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should handle one identity logout successfully', () => {
    storageRapidAccessOps.write([AppRouteParams.AAR, 'aar-test']);
    storageOneIdentityNonce.write('123');
    storageOneIdentityState.write('123');

    render(
      <BrowserRouter>
        <OneIdentityLogout />
      </BrowserRouter>
    );
    expect(storageRapidAccessOps.read()).toBeUndefined();
    expect(storageOneIdentityNonce.read()).toBeUndefined();
    expect(storageOneIdentityState.read()).toBeUndefined();

    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(ROUTE_ONE_IDENTITY_LOGIN, { replace: true });
  });

  it('should handle one identity logout with query params', () => {
    setWindowLocation('?aar=123456');
    storageRapidAccessOps.write([AppRouteParams.AAR, 'aar-test']);
    storageOneIdentityNonce.write('123');
    storageOneIdentityState.write('123');

    render(
      <BrowserRouter>
        <OneIdentityLogout />
      </BrowserRouter>
    );
    expect(storageRapidAccessOps.read()).toBeUndefined();
    expect(storageOneIdentityNonce.read()).toBeUndefined();
    expect(storageOneIdentityState.read()).toBeUndefined();

    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(ROUTE_ONE_IDENTITY_LOGIN + '?aar=123456', {
      replace: true,
    });
  });
});
