import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { act, getById } from '@pagopa-pn/pn-commons/src/test-utils';

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
    vi.useFakeTimers();
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
    // Wait login redirect
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(ROUTE_LOGIN);
    vi.useRealTimers();
  });

  it('login too many retry error - code 19', async () => {
    vi.useFakeTimers();

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
    // Wait login redirect
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(ROUTE_LOGIN);
    vi.useRealTimers();
  });

  it('login two authentication factor error - code 20', async () => {
    vi.useFakeTimers();

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
    // Wait login redirect
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(ROUTE_LOGIN);
    vi.useRealTimers();
  });

  it('login waiting for too long error - code 21', async () => {
    vi.useFakeTimers();

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
    // Wait login redirect
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(ROUTE_LOGIN);
    vi.useRealTimers();
  });

  it('login consent necessary error - code 22', async () => {
    vi.useFakeTimers();

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
    // Wait login redirect
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(ROUTE_LOGIN);
    vi.useRealTimers();
  });

  it('login spid identity rewoked or suspended error - code 23', async () => {
    vi.useFakeTimers();

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
    // Wait login redirect
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(ROUTE_LOGIN);
    vi.useRealTimers();
  });

  it('user cancelled the login - code 25', async () => {
    vi.useFakeTimers();

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
    // Wait login redirect
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(ROUTE_LOGIN);
    vi.useRealTimers();
  });

  it('user used a different spid type - code 30', async () => {
    vi.useFakeTimers();

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
    // Wait login redirect
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(ROUTE_LOGIN);
    vi.useRealTimers();
  });

  it("user doesn't have the minimum required age - code 1001", async () => {
    vi.useFakeTimers();

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
    // Wait login redirect
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(ROUTE_LOGIN);
    vi.useRealTimers();
  });
});
