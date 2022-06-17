import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import Logout from '../Logout';
import { ROUTE_LOGIN } from '../../../utils/constants';
import { storageOnSuccessOps, storageTokenOps, storageUserOps } from '../../../utils/storage';

const mockNavigateFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

test('test logout', () => {
  storageOnSuccessOps.write('ON_SUCCESS');
  storageTokenOps.write('TOKEN');
  storageUserOps.write({
    uid: 'UID',
    name: 'NAME',
    surname: 'SURNAME',
    email: 'EMAIL',
    taxCode: 'TAXCODE',
  });

  render(
    <BrowserRouter>
      <Logout />
    </BrowserRouter>
  );

  expect(storageOnSuccessOps.read()).toBeUndefined();
  expect(storageTokenOps.read()).toBeUndefined();
  expect(storageUserOps.read()).toBeUndefined();

  expect(mockNavigateFn).toBeCalledTimes(1);
  expect(mockNavigateFn).toBeCalledWith(ROUTE_LOGIN);
});
