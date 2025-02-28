import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { fireEvent, getById, waitFor } from '@pagopa-pn/pn-commons/src/test-utils';

import { render } from '../../../__test__/test-utils';
import { ROUTE_LOGIN } from '../../../navigation/routes.const';
import LoginError from '../LoginError';

const mockNavigateFn = vi.fn();
let spidErrorCode: string;

// mock imports
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
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
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('login technical error - code generic', async () => {
    spidErrorCode = '2';
    render(
      <BrowserRouter>
        <LoginError />
      </BrowserRouter>
    );
    const errorDialog = getById(document.body, 'errorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');
    const message = getById(errorDialog, 'message');
    expect(message).toHaveTextContent('loginError.message');
    const buttonRedirect = getById(document.body, 'login-button');
    fireEvent.click(buttonRedirect);
    await waitFor(() => {
      expect(mockNavigateFn).toHaveBeenCalledTimes(1);
      expect(mockNavigateFn).toHaveBeenCalledWith(ROUTE_LOGIN);
    });
  });

  it('login too many retry error - code 19', async () => {
    spidErrorCode = '19';
    render(
      <BrowserRouter>
        <LoginError />
      </BrowserRouter>
    );
    const errorDialog = getById(document.body, 'errorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');
    const message = getById(errorDialog, 'message');
    expect(message).toHaveTextContent('loginError.code.error_19');
  });

  it('login two authentication factor error - code 20', async () => {
    spidErrorCode = '20';
    render(
      <BrowserRouter>
        <LoginError />
      </BrowserRouter>
    );
    const errorDialog = getById(document.body, 'errorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');
    const message = getById(errorDialog, 'message');
    expect(message).toHaveTextContent('loginError.code.error_20');
  });

  it('login waiting for too long error - code 21', async () => {
    spidErrorCode = '21';
    render(
      <BrowserRouter>
        <LoginError />
      </BrowserRouter>
    );
    const errorDialog = getById(document.body, 'errorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');
    const message = getById(errorDialog, 'message');
    expect(message).toHaveTextContent('loginError.code.error_21');
  });

  it('login consent necessary error - code 22', async () => {
    spidErrorCode = '22';
    render(
      <BrowserRouter>
        <LoginError />
      </BrowserRouter>
    );
    const errorDialog = getById(document.body, 'errorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');
    const message = getById(errorDialog, 'message');
    expect(message).toHaveTextContent('loginError.code.error_22');
  });

  it('login spid identity rewoked or suspended error - code 23', async () => {
    spidErrorCode = '23';
    render(
      <BrowserRouter>
        <LoginError />
      </BrowserRouter>
    );
    const errorDialog = getById(document.body, 'errorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');
    const message = getById(errorDialog, 'message');
    expect(message).toHaveTextContent('loginError.code.error_23');
  });

  it('user cancelled the login - code 25', async () => {
    spidErrorCode = '25';
    render(
      <BrowserRouter>
        <LoginError />
      </BrowserRouter>
    );
    const errorDialog = getById(document.body, 'errorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');
    const message = getById(errorDialog, 'message');
    expect(message).toHaveTextContent('loginError.code.error_25');
  });

  it('user used a different spid type - code 30', async () => {
    spidErrorCode = '30';
    render(
      <BrowserRouter>
        <LoginError />
      </BrowserRouter>
    );
    const errorDialog = getById(document.body, 'errorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');
    const message = getById(errorDialog, 'message');
    expect(message).toHaveTextContent('loginError.code.error_30');
  });

  it("user doesn't have the minimum required age - code 1001", async () => {
    spidErrorCode = '1001';
    render(
      <BrowserRouter>
        <LoginError />
      </BrowserRouter>
    );
    const errorDialog = getById(document.body, 'errorDialog');
    expect(errorDialog).toHaveTextContent('loginError.title');
    const message = getById(errorDialog, 'message');
    expect(message).toHaveTextContent('loginError.code.error_1001');
  });
});
