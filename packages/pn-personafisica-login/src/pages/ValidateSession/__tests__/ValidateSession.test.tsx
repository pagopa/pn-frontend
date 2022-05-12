import React from 'react';
import { render } from '@testing-library/react';
import ValidSession from '../ValidateSession';
import { ENV } from '../../../utils/env';
import { User } from '../../../models/User';
import { storageUserOps } from '@pagopa/selfcare-common-frontend/utils/storage';

const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZ1cmlvdml0YWxlQG1hcnRpbm8uaXQiLCJmYW1pbHlfbmFtZSI6IlNhcnRvcmkiLCJmaXNjYWxfbnVtYmVyIjoiU1JUTkxNMDlUMDZHNjM1UyIsIm5hbWUiOiJBbnNlbG1vIiwiZnJvbV9hYSI6ZmFsc2UsImxldmVsIjoiTDIiLCJpYXQiOjE2MzUzNjI4MTUsImV4cCI6MTYzNTM2NjQxNSwiaXNzIjoiU1BJRCIsImp0aSI6IjAxRksxS0dGVFhGNk1IMzBLUjJFMUZFQ0hEIiwidWlkIjoiMCJ9.dJyfFPobeK7OfH43JWuhWbVxr1ukOMVsg49G2b3aV_DqMER-gn3M-0FgeqeK4ZaCHqgkQMR37N_DGWNXRSOPCuOoTTpbFBGhSp-vxDCdVJgCgvRLzX0QawlvEthigNsFVSlw0_psXe4OcQpoVWWFdetRQmY_hWa-cT2Ulefb7YVXa6WBNrVZP8Yq5M19G3y7vBs-IKHKjdRoKAvr3m0PkGTRFIVbcoQzvmbo7QpWMKOYcDUf3zapESp07EQgWx4TjpOZjETz-zdQbH-fuN0IR_aiSIISNw4H2sTT5WPtkkeEKU5RSVSkacQsXpCQm_bNEqkGHhKpFMYeIM1s0q1Siw';

const oldWindowLocation = global.window.location;

beforeAll(() => {
  Object.defineProperty(window, 'location', { value: { assign: jest.fn() } });
});
afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

test('test validate session', () => {
  render(<ValidSession sessionToken={token} />);

  const user: User = storageUserOps.read();
  expect(user).not.toBeNull();
  expect(user.uid).toBe('0');
  expect(user.taxCode).toBe('SRTNLM09T06G635S');
  expect(user.name).toBe('Anselmo');
  expect(user.surname).toBe('Sartori');
  expect(user.email).toBe('furiovitale@martino.it');

  expect(global.window.location.assign).toBeCalledWith(ENV.URL_FE.DASHBOARD);
});

test('test validate session when already user stored', () => {
  const expectedUser: User = {
    uid: 'UID',
    name: 'NAME',
    surname: 'SURNAME',
    email: 'EMAIL',
    taxCode: 'TAXCODE',
  };
  storageUserOps.write(expectedUser);
  render(<ValidSession sessionToken={token} />);

  const user: User = storageUserOps.read();
  expect(JSON.stringify(user)).toBe(JSON.stringify(expectedUser));

  expect(global.window.location.assign).toBeCalledWith(ENV.URL_FE.DASHBOARD);
});
