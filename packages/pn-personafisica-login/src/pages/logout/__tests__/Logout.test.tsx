import React from 'react';
import { render } from '@testing-library/react';
import Logout from '../Logout';
import { ROUTE_LOGIN } from '../../../utils/constants';
import { storageOnSuccessOps } from '../../../utils/storage';
import { storageTokenOps, storageUserOps } from '@pagopa/selfcare-common-frontend/utils/storage';

const oldWindowLocation = global.window.location;

beforeAll(() => {
  Object.defineProperty(window, 'location', { value: { assign: jest.fn() } });
});
afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

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

  render(<Logout />);

  expect(storageOnSuccessOps.read()).toBeUndefined();
  expect(storageTokenOps.read()).toBeUndefined();
  expect(storageUserOps.read()).toBeUndefined();

  expect(global.window.location.assign).toBeCalledWith(ROUTE_LOGIN);
});
