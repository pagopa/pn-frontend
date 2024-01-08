import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { render } from '../../../__test__/test-utils';
import { getConfiguration } from '../../../services/configuration.service';
import { storageAarOps, storageOnSuccessOps } from '../../../utility/storage';
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
    storageOnSuccessOps.write('ON_SUCCESS');
    storageAarOps.write('aar-test');
    render(
      <BrowserRouter>
        <Logout />
      </BrowserRouter>
    );
    expect(storageOnSuccessOps.read()).toBeUndefined();
    expect(storageAarOps.read()).toBeUndefined();
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(getConfiguration().ROUTE_LOGIN);
  });
});
