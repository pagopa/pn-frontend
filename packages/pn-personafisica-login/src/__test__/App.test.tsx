import React from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

import { getById, queryById } from '@pagopa-pn/pn-commons/src/test-utils';

import App from '../App';
import { render } from './test-utils';

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
    const { container } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const loginPage = getById(container, 'loginPage');
    expect(loginPage).toBeInTheDocument();
    const errorDialog = queryById(document.body, 'errorDialog');
    expect(errorDialog).not.toBeInTheDocument();
  });

  it('logout page', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/logout']}>
        <App />
      </MemoryRouter>
    );
    const loginPage = queryById(container, 'loginPage');
    expect(loginPage).not.toBeInTheDocument();
    const errorDialog = queryById(document.body, 'errorDialog');
    expect(errorDialog).not.toBeInTheDocument();
  });

  it('login error', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/login/error']}>
        <App />
      </MemoryRouter>
    );
    const loginPage = queryById(container, 'loginPage');
    expect(loginPage).not.toBeInTheDocument();
    const errorDialog = getById(document.body, 'errorDialog');
    expect(errorDialog).toBeInTheDocument();
  });
});
