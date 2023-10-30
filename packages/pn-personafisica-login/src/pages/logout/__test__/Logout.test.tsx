import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { render } from '../../../__test__/test-utils';
import { getConfiguration } from '../../../services/configuration.service';
import { storageAarOps, storageOnSuccessOps } from '../../../utility/storage';
import Logout from '../Logout';

const mockNavigateFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

describe('Logout page', () => {
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
