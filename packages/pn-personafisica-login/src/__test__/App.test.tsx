import { render, screen } from '@testing-library/react';
import App from '../App';
import { ROUTE_LOGIN } from '../utils/constants';
import { storageOnSuccessOps, storageTokenOps } from '../utils/storage';

const oldWindowLocation = global.window.location;
const mockedLocation = {
  assign: jest.fn(),
  pathname: '',
  origin: 'MOCKED_ORIGIN',
  search: '',
  hash: '',
};

beforeAll(() => {
  Object.defineProperty(window, 'location', { value: mockedLocation });
});
afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

// clean storage after each test
afterEach(() => {
  jest.requireActual('../pages/logout/Logout').default();
  mockedLocation.assign.mockReset();
});

jest.mock('../pages/logout/Logout', () => () => 'LOGOUT');
jest.mock('../pages/login/Login', () => () => 'LOGIN');

test('test not served path', () => {
  render(<App />);
  expect(global.window.location.assign).toBeCalledWith(ROUTE_LOGIN);
  checkRedirect(true);
});

test('test Logout', () => {
  mockedLocation.pathname = '/logout';
  render(<App />);
  screen.getByText('LOGOUT');
  checkRedirect(false);
});

test('test Logout even if in session', () => {
  mockedLocation.pathname = '/logout';
  storageTokenOps.write('token');
  render(<App />);
  screen.getByText('LOGOUT');
  checkRedirect(false);
});

test('test Login', () => {
  mockedLocation.pathname = '/login';
  render(<App />);
  screen.getByText('LOGIN');
  expect(storageOnSuccessOps.read()).toBeUndefined();
  checkRedirect(false);
});

test('test Login with onSuccess', () => {
  mockedLocation.pathname = '/login';
  mockedLocation.search = 'onSuccess=prova';
  render(<App />);
  screen.getByText('LOGIN');
  expect(storageOnSuccessOps.read()).toBe('prova');
  checkRedirect(false);
});

function checkRedirect(expected: boolean) {
  expect(mockedLocation.assign.mock.calls.length).toBe(expected ? 1 : 0);
}
