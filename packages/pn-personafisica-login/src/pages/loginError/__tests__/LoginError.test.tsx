import { render, waitFor, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import LoginError from '../LoginError';
import '../../../locales/i18n';
import { getConfiguration } from "../../../services/configuration.service";

const mockNavigateFn = jest.fn();

let spidErrorCode: string;

// simulate a particular SPID error code, which must be set to the spidErrorCode variable
// cfr. SPID error codes in https://www.agid.gov.it//sites/default/files/repository_files/tabella-messaggi-spid-v1.4.pdf
function mockCreateMockedSearchParams() {
  const mockedSearchParams = new URLSearchParams();
  mockedSearchParams.set("errorCode", spidErrorCode);
  return mockedSearchParams;
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
  useSearchParams: () => [mockCreateMockedSearchParams(), null],
}));

test('login technical error - show transient error screen before redirecting to login', async () => {
  spidErrorCode = '2';           // system not available
  render(
    <BrowserRouter>
      <LoginError />
    </BrowserRouter>
  );

  screen.getByText('Spiacenti, qualcosa è andato storto.');
  screen.getByText('A causa di un errore del sistema non è possibile completare la procedura.', {
    exact: false,
  });
  screen.getByText('Ti chiediamo di riprovare più tardi.', {
    exact: false,
  });

  await waitFor(
    () => {
      expect(mockNavigateFn).toBeCalledTimes(1);
      expect(mockNavigateFn).toBeCalledWith(getConfiguration().ROUTE_LOGIN);
    },
    {
      timeout: 3500,
    }
  );
});

test('user cancelled the login - immediate redirect to login page', async () => {
  spidErrorCode = '25';           // user cancel by clicking "Annulla" button or link
  await act(async () => {
      render(
        <BrowserRouter>
          <LoginError />
        </BrowserRouter>
      );
  });

  expect(mockNavigateFn).toBeCalledTimes(1);
  expect(mockNavigateFn).toBeCalledWith(getConfiguration().ROUTE_LOGIN);
});
