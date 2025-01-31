import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';

import { render } from '../../../__test__/test-utils';
import { ROUTE_LOGIN } from '../../../navigation/routes.const';
import { storageRapidAccessOps } from '../../../utility/storage';
import Logout from '../Logout';

const mockNavigateFn = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

describe('Logout page', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('test logout', () => {
    storageRapidAccessOps.write([AppRouteParams.AAR, 'aar-test']);
    render(
      <BrowserRouter>
        <Logout />
      </BrowserRouter>
    );
    expect(storageRapidAccessOps.read()).toBeUndefined();
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(ROUTE_LOGIN);
  });
});
