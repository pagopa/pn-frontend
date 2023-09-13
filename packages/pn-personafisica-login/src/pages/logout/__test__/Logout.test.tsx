import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AppRouteType } from '@pagopa-pn/pn-commons';
import { render } from '@testing-library/react';

import { getConfiguration } from '../../../services/configuration.service';
import { storageAarOps, storageOnSuccessOps, storageTypeOps } from '../../../utils/storage';
import Logout from '../Logout';

const mockNavigateFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

describe('Logout page', () => {
  it('test logout', () => {
    storageOnSuccessOps.write('ON_SUCCESS');
    storageTypeOps.write(AppRouteType.PF);
    storageAarOps.write('aar-test');
    render(
      <BrowserRouter>
        <Logout />
      </BrowserRouter>
    );
    expect(storageOnSuccessOps.read()).toBeUndefined();
    expect(storageTypeOps.read()).toBeUndefined();
    expect(storageAarOps.read()).toBeUndefined();
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(getConfiguration().ROUTE_LOGIN);
  });
});
