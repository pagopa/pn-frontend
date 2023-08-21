import { render, waitFor, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import LoginError from '../LoginError';
import { getConfiguration } from '../../../services/configuration.service';

const mockNavigateFn = jest.fn();

let spidErrorCode: string;

// simulate a particular SPID error code, which must be set to the spidErrorCode variable
// cfr. SPID error codes in https://www.agid.gov.it//sites/default/files/repository_files/tabella-messaggi-spid-v1.4.pdf
function mockCreateMockedSearchParams() {
  const mockedSearchParams = new URLSearchParams();
  mockedSearchParams.set('errorCode', spidErrorCode);
  return mockedSearchParams;
}

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
  useNavigate: () => mockNavigateFn,
  useSearchParams: () => [mockCreateMockedSearchParams(), null],
}));

test('login technical error - show transient error screen before redirecting to login', async () => {
  spidErrorCode = '2'; // system not available
  render(
    <BrowserRouter>
      <LoginError />
    </BrowserRouter>
  );

  screen.getByText('loginError.title', {
    exact: false,
  });

  await waitFor(
    () => {
      expect(mockNavigateFn).toBeCalledTimes(1);
      expect(mockNavigateFn).toBeCalledWith(getConfiguration().ROUTE_LOGIN);
    },
    {
      timeout: 5500,
    }
  );
}, 5500);

test('user cancelled the login - immediate redirect to login page', async () => {
  spidErrorCode = '25'; // user cancel by clicking "Annulla" button or link
  await act(async () => {
    render(
      <BrowserRouter>
        <LoginError />
      </BrowserRouter>
    );
  });

  screen.getByText('loginError.title', {
    exact: false,
  });
  screen.getByText('loginError.message', {
    exact: false,
  });

  await waitFor(
    () => {
      expect(mockNavigateFn).toBeCalledTimes(1);
      expect(mockNavigateFn).toBeCalledWith(getConfiguration().ROUTE_LOGIN);
    },
    {
      timeout: 5500,
    }
  );
}, 5500);
