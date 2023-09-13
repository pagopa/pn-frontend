import React from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

import { getByTestId, render } from '@testing-library/react';

import App from '../App';

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('App', () => {
  it('inital page', () => {
    const { getByTestId, queryByTestId } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const loginPage = getByTestId('loginPage');
    expect(loginPage).toBeInTheDocument();
    const errorDialog = queryByTestId('errorDialog');
    expect(errorDialog).not.toBeInTheDocument();
  });

  it('logout page', () => {
    const { queryByTestId } = render(
      <MemoryRouter initialEntries={['/logout']}>
        <App />
      </MemoryRouter>
    );
    const loginPage = queryByTestId('loginPage');
    expect(loginPage).not.toBeInTheDocument();
    const errorDialog = queryByTestId('errorDialog');
    expect(errorDialog).not.toBeInTheDocument();
  });

  it('login error', () => {
    const { queryByTestId, getByTestId } = render(
      <MemoryRouter initialEntries={['/login/error']}>
        <App />
      </MemoryRouter>
    );
    const loginPage = queryByTestId('loginPage');
    expect(loginPage).not.toBeInTheDocument();
    const errorDialog = getByTestId('errorDialog');
    expect(errorDialog).toBeInTheDocument();
  });
});
