import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { width } from '@mui/system';
import Login from '../Login';
import { ENV } from '../../../utils/env';
import './../../../locale';

const oldWindowLocation = global.window.location;

beforeAll(() => {
  // eslint-disable-next-line functional/immutable-data
  Object.defineProperty(window, 'location', { value: { assign: jest.fn() } });
});
afterAll(() => {
  // eslint-disable-next-line functional/immutable-data
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

test('rendering test', () => {
  render(<Login />);
  const LinkName = screen.getByText(/Scopri di più/i);
  expect(LinkName).toHaveAttribute(
    'href',
    'https://www.spid.gov.it/cos-e-spid/come-attivare-spid/'
  );
});

test('renders button Entra con Spid', () => {
  const login = render(<Login />);
  const ButtonSpid = document.getElementById('spidButton');
  fireEvent.click(ButtonSpid);
  expect(screen.getAllByRole('img')[0]).toHaveAttribute('src', 'spid_big.svg');
});

test('renders button Entra con CIE', () => {
  const login = render(<Login />);
  const ButtonCIE = screen.getByRole(/Button/i, {
    name: 'Entra con CIE',
  });

  fireEvent.click(ButtonCIE);
  expect(global.window.location.assign).toBeCalledWith(
    `${ENV.URL_API.LOGIN}/login?entityID=xx_servizicie_test&authLevel=SpidL2`
  );
});
