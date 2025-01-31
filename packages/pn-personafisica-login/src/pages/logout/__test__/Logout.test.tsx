import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { render } from '../../../__test__/test-utils';
import { ROUTE_LOGIN } from '../../../navigation/routes.const';
import { storageAarOps, storageRetrievalIdOps } from '../../../utility/storage';
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
    storageAarOps.write('aar-test');
    storageRetrievalIdOps.write('retrievalId-test');
    render(
      <BrowserRouter>
        <Logout />
      </BrowserRouter>
    );
    expect(storageAarOps.read()).toBeUndefined();
    expect(storageRetrievalIdOps.read()).toBeUndefined();
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(ROUTE_LOGIN);
  });
});
