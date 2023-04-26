import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppRouteParams, AppRouteType } from '@pagopa-pn/pn-commons';

import { storageAarOps, storageTypeOps } from '../../../utils/storage';
import Login from '../Login';
import '../../../locales/i18n';
import { getConfiguration } from "../../../services/configuration.service";

const oldWindowLocation = global.window.location;

// simulate url params
function mockCreateMockedSearchParams() {
  const mockedSearchParams = new URLSearchParams();
  mockedSearchParams.set(AppRouteParams.TYPE, AppRouteType.PF);
  mockedSearchParams.set(AppRouteParams.AAR, 'fake-aar-token');
  return mockedSearchParams;
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => [mockCreateMockedSearchParams(), null],
}));

describe('test login page', () => {
  beforeAll(() => {
    // eslint-disable-next-line functional/immutable-data
    Object.defineProperty(window, 'location', { value: { assign: jest.fn() } });
  });

  afterAll(() => {
    // eslint-disable-next-line functional/immutable-data
    Object.defineProperty(window, 'location', { value: oldWindowLocation });
  });

  test('rendering test', () => {
    const result = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(result.container).toHaveTextContent(/Come vuoi accedere/i);
  });

  test('renders button Entra con Spid', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const ButtonSpid = document.getElementById('spidButton');
    if (ButtonSpid) {
      fireEvent.click(ButtonSpid);
    }
    expect(screen.getAllByRole('img')[0]).toHaveAttribute('src', 'spid_big.svg');
  });

  test('renders button Entra con CIE', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const ButtonCIE = document.getElementById('cieButton');
    if (ButtonCIE) {
      fireEvent.click(ButtonCIE);
    }

    expect(global.window.location.assign).toBeCalledWith(
      `${getConfiguration().URL_API_LOGIN}/login?entityID=xx_servizicie_test&authLevel=SpidL2`
    );
  });

  // portale login has only privacy policy and not terms and conditions page
  test('does render the privacy disclaimer link', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const privacyDisclaimerLink = screen.queryByText(/Informativa Privacy/i);

    expect(privacyDisclaimerLink).toBeInTheDocument();
  });

  test('does not render the link', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const privacyDisclaimerLink = screen.queryByTestId('terms-and-conditions');
    expect(privacyDisclaimerLink).not.toBeInTheDocument();
  });

  test('check aar and type stored correctly', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(storageTypeOps.read()).toBe(AppRouteType.PF);
    expect(storageAarOps.read()).toBe('fake-aar-token');
  });
});
