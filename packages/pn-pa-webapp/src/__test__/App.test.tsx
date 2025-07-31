import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { ThemeProvider, createTheme } from '@mui/material';

import App from '../App';
import { currentStatusDTO } from '../__mocks__/AppStatus.mock';
import { userResponse } from '../__mocks__/Auth.mock';
import { tosPrivacyConsentMock } from '../__mocks__/Consents.mock';
import { institutionsDTO, productsDTO } from '../__mocks__/User.mock';
import { apiClient, authClient } from '../api/apiClients';
import { SELFCARE_LOGIN_PATH, SELFCARE_LOGOUT_PATH } from '../navigation/routes.const';
import { getConfiguration } from '../services/configuration.service';
import { RenderResult, act, fireEvent, getByText, render, screen, waitFor } from './test-utils';

vi.mock('../pages/Dashboard.page', () => ({ default: () => <div>Generic Page</div> }));

const unmockedFetch = global.fetch;

const theme = createTheme({});
const Component = () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

const reduxInitialState = {
  userState: {
    user: userResponse,
    fetchedTos: false,
    fetchedPrivacy: false,
    tosConsent: {
      accepted: false,
      isFirstAccept: false,
      currentVersion: 'mocked-version-1',
    },
    privacyConsent: {
      accepted: false,
      isFirstAccept: false,
      currentVersion: 'mocked-version-1',
    },
    institutions: [],
    productsOfInstitution: [],
  },
};

describe('App', async () => {
  let mock: MockAdapter;
  let mockAuth: MockAdapter;
  let result: RenderResult;
  const mockOpenFn = vi.fn();
  const originalOpen = window.open;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    mockAuth = new MockAdapter(authClient);
    // FooterPreLogin (mui-italia) component calls an api to fetch selfcare products list.
    // this causes an error, so we mock to avoid it
    global.fetch = () =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      }) as Promise<Response>;

    Object.defineProperty(window, 'open', {
      configurable: true,
      value: mockOpenFn,
    });
  });

  afterEach(() => {
    mock.reset();
    mockAuth.reset();
    vi.restoreAllMocks();
  });

  afterAll(() => {
    mock.restore();
    mockAuth.restore();
    global.fetch = unmockedFetch;
    Object.defineProperty(window, 'open', { configurable: true, value: originalOpen });
  });

  it('render component - user not logged in', async () => {
    await act(async () => {
      result = render(<Component />);
    });
    const header = result.container.querySelector('header');
    expect(header).toBeInTheDocument();
    const footer = result.container.querySelector('footer');
    expect(footer).toBeInTheDocument();
    const sideMenu = result.queryByTestId('side-menu');
    expect(sideMenu).not.toBeInTheDocument();
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    const url = `${getConfiguration().SELFCARE_BASE_URL}${SELFCARE_LOGIN_PATH}`;
    expect(mockOpenFn).toHaveBeenCalledWith(url, '_self');
  });

  it('render component - user logged in', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(true, true));
    mock.onGet('/bff/v1/institutions').reply(200, institutionsDTO);
    mock.onGet('/bff/v1/institutions/products').reply(200, productsDTO);
    mock.onGet('/bff/v1/pa/additional-languages').reply(200, { additionalLanguages: [] });
    mock.onGet('downtime/v1/status').reply(200, currentStatusDTO);
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const header = result.container.querySelector('header');
    expect(header).toBeInTheDocument();
    const footer = result.container.querySelector('footer');
    expect(footer).toBeInTheDocument();
    const sideMenu = result.queryByTestId('side-menu');
    expect(sideMenu).toBeInTheDocument();
    expect(result.container).toHaveTextContent('Generic Page');
    expect(mock.history.get).toHaveLength(5);
  });

  it('Sidemenu not included if error in API call to fetch TOS and Privacy', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(500);
    mock.onGet('downtime/v1/status').reply(200, currentStatusDTO);
    mock.onGet('/bff/v1/institutions').reply(200, institutionsDTO);
    mock.onGet('/bff/v1/institutions/products').reply(200, productsDTO);
    mock.onGet('/bff/v1/pa/additional-languages').reply(200, { additionalLanguages: [] });
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const sideMenu = result.queryByTestId('side-menu');
    expect(sideMenu).not.toBeInTheDocument();
    expect(result.container).not.toHaveTextContent('Generic Page');
    expect(mock.history.get).toHaveLength(5);
  });

  it('Sidemenu not included if user has not accepted the TOS and PRIVACY', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(false, false));
    mock.onGet('downtime/v1/status').reply(200, currentStatusDTO);
    mock.onGet('/bff/v1/institutions').reply(200, institutionsDTO);
    mock.onGet('/bff/v1/institutions/products').reply(200, productsDTO);
    mock.onGet('/bff/v1/pa/additional-languages').reply(200, { additionalLanguages: [] });
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const sideMenu = result.queryByTestId('side-menu');
    expect(sideMenu).not.toBeInTheDocument();
    const tosPage = result.queryByTestId('tos-acceptance-page');
    expect(tosPage).toBeInTheDocument();
    expect(result.container).not.toHaveTextContent('Generic Page');
    expect(mock.history.get).toHaveLength(5);
  });

  it('render component - user logs out', async () => {
    mockAuth.onPost('/logout').reply(200);

    const clearSpy = vi.spyOn(Storage.prototype, 'clear');

    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });

    const header = result.container.querySelector('header');
    expect(header).toBeInTheDocument();

    const button = getByText(header!, 'Esci');
    fireEvent.click(button);

    const modalConfirmButton = await waitFor(() => screen.queryByTestId('confirm-button'));
    fireEvent.click(modalConfirmButton!);
    
    await waitFor(() => {
      expect(mockOpenFn).toHaveBeenCalledTimes(1);
      const url = `${getConfiguration().SELFCARE_BASE_URL}${SELFCARE_LOGOUT_PATH}`;
      expect(mockOpenFn).toHaveBeenCalledWith(url, '_self');
      expect(clearSpy).toHaveBeenCalled();
      expect(mockAuth.history.post.length).toBe(1);
    });

  });
});
