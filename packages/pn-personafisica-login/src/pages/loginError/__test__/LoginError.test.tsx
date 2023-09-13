import React, { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { act, render, screen, waitFor, within } from '@testing-library/react';

import { getConfiguration } from '../../../services/configuration.service';
import LoginError from '../LoginError';

const mockNavigateFn = jest.fn();
let spidErrorCode: string;

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string; children: ReactNode }) => (
    <>
      {props.i18nKey} {props.children}
    </>
  ),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
  useSearchParams: () => [mockCreateMockedSearchParams(), null],
}));

// simulate a particular SPID error code, which must be set to the spidErrorCode variable
// cfr. SPID error codes in https://www.agid.gov.it//sites/default/files/repository_files/tabella-messaggi-spid-v1.4.pdf
function mockCreateMockedSearchParams() {
  const mockedSearchParams = new URLSearchParams();
  mockedSearchParams.set('errorCode', spidErrorCode);
  return mockedSearchParams;
}

describe('LoginError component', () => {
  it('login technical error - code generic', async () => {
    spidErrorCode = '2';
    render(
      <BrowserRouter>
        <LoginError />
      </BrowserRouter>
    );
    const errorDialog = screen.getByTestId('errorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');
    const message = within(errorDialog).getByTestId('message');
    expect(message).toHaveTextContent('loginError.message');
    // Wait login redirect
    await new Promise((t) => setTimeout(t, 200));
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(getConfiguration().ROUTE_LOGIN);
  });

  it('login too many retry error - code 19', async () => {
    spidErrorCode = '19';
    render(
      <BrowserRouter>
        <LoginError />
      </BrowserRouter>
    );
    const errorDialog = screen.getByTestId('errorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');
    const message = within(errorDialog).getByTestId('message');
    expect(message).toHaveTextContent('loginError.message loginError.code.error_19');
    // Wait login redirect
    await new Promise((t) => setTimeout(t, 200));
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(getConfiguration().ROUTE_LOGIN);
  });

  it('login two authentication factor error - code 20', async () => {
    spidErrorCode = '20';
    render(
      <BrowserRouter>
        <LoginError />
      </BrowserRouter>
    );
    const errorDialog = screen.getByTestId('errorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');
    const message = within(errorDialog).getByTestId('message');
    expect(message).toHaveTextContent('loginError.message loginError.code.error_20');
    // Wait login redirect
    await new Promise((t) => setTimeout(t, 200));
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(getConfiguration().ROUTE_LOGIN);
  });

  it('login waiting for too long error - code 21', async () => {
    spidErrorCode = '21';
    render(
      <BrowserRouter>
        <LoginError />
      </BrowserRouter>
    );
    const errorDialog = screen.getByTestId('errorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');
    const message = within(errorDialog).getByTestId('message');
    expect(message).toHaveTextContent('loginError.message loginError.code.error_21');
    // Wait login redirect
    await new Promise((t) => setTimeout(t, 200));
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(getConfiguration().ROUTE_LOGIN);
  });

  it('login consent necessary error - code 22', async () => {
    spidErrorCode = '22';
    render(
      <BrowserRouter>
        <LoginError />
      </BrowserRouter>
    );
    const errorDialog = screen.getByTestId('errorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');
    const message = within(errorDialog).getByTestId('message');
    expect(message).toHaveTextContent('loginError.message loginError.code.error_22');
    // Wait login redirect
    await new Promise((t) => setTimeout(t, 200));
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(getConfiguration().ROUTE_LOGIN);
  });

  it('login spid identity rewoked or suspended error - code 23', async () => {
    spidErrorCode = '23';
    render(
      <BrowserRouter>
        <LoginError />
      </BrowserRouter>
    );
    const errorDialog = screen.getByTestId('errorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');
    const message = within(errorDialog).getByTestId('message');
    expect(message).toHaveTextContent('loginError.message loginError.code.error_23');
    // Wait login redirect
    await new Promise((t) => setTimeout(t, 200));
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(getConfiguration().ROUTE_LOGIN);
  });

  it('user cancelled the login - code 25', async () => {
    spidErrorCode = '25';
    render(
      <BrowserRouter>
        <LoginError />
      </BrowserRouter>
    );
    const errorDialog = screen.getByTestId('errorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');
    const message = within(errorDialog).getByTestId('message');
    expect(message).toHaveTextContent('loginError.message loginError.code.error_25');
    // Wait login redirect
    await new Promise((t) => setTimeout(t, 200));
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(getConfiguration().ROUTE_LOGIN);
  });

  it('user used a different spid type - code 30', async () => {
    spidErrorCode = '30';
    render(
      <BrowserRouter>
        <LoginError />
      </BrowserRouter>
    );
    const errorDialog = screen.getByTestId('errorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');
    const message = within(errorDialog).getByTestId('message');
    expect(message).toHaveTextContent('loginError.message loginError.code.error_30');
    // Wait login redirect
    await new Promise((t) => setTimeout(t, 200));
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(getConfiguration().ROUTE_LOGIN);
  });

  it("user doesn't have the minimum required age - code 1001", async () => {
    spidErrorCode = '1001';
    render(
      <BrowserRouter>
        <LoginError />
      </BrowserRouter>
    );
    const errorDialog = screen.getByTestId('errorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');
    const message = within(errorDialog).getByTestId('message');
    expect(message).toHaveTextContent('loginError.message loginError.code.error_1001');
    // Wait login redirect
    await new Promise((t) => setTimeout(t, 200));
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(getConfiguration().ROUTE_LOGIN);
  });
});
