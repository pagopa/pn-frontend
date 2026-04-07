import { vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';

import { render } from '../../../__test__/test-utils';
import { ROUTE_LOGIN } from '../../../navigation/routes.const';
import { storageRapidAccessOps } from '../../../utility/storage';
import Logout from '../Logout';

describe('Logout page', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('test logout', () => {
    storageRapidAccessOps.write([AppRouteParams.AAR, 'aar-test']);
    const { router } = render(<Logout />);
    expect(storageRapidAccessOps.read()).toBeUndefined();
    expect(router.state.location.pathname).toBe(ROUTE_LOGIN);
    expect(router.state.historyAction).toBe('REPLACE');
  });
});
