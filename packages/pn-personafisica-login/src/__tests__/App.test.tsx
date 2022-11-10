import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import App from '../App';

const mockNavigateFn = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

jest.mock('../pages/logout/Logout', () => () => 'LOGOUT');
jest.mock('../pages/login/Login', () => () => 'LOGIN');
jest.mock('../pages/loginError/LoginError', () => () => 'LOGIN_ERROR');


test('test not served path', () => {
  const result = render(<BrowserRouter><App /></BrowserRouter>);
  expect(result.container).toHaveTextContent('LOGIN');
});

test('test logout', () => {
  const result = render(<MemoryRouter initialEntries={['/logout']}><App /></MemoryRouter>);
  expect(result.container).toHaveTextContent('LOGOUT');
});

test('test login error', () => {
  const result = render(<MemoryRouter initialEntries={['/login/error']}><App /></MemoryRouter>);
  expect(result.container).toHaveTextContent('LOGIN_ERROR');
});
