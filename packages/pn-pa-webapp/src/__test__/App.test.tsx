import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { ThemeProvider, createTheme } from '@mui/material';

import App from '../App';
import { currentStatusDTO } from '../__mocks__/AppStatus.mock';
import { userResponse } from '../__mocks__/Auth.mock';
import { tosPrivacyConsentMock } from '../__mocks__/Consents.mock';
import { institutionsDTO, productsDTO } from '../__mocks__/User.mock';
import { apiClient } from '../api/apiClients';
import { RenderResult, act, render } from './test-utils';

// mock imports
vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  Trans: (props: { i18nKey: string }) => props.i18nKey,
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: {
      language: 'it',
      changeLanguage: () => new Promise(() => {}),
    },
  }),
}));

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
  let result: RenderResult;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    // FooterPreLogin (mui-italia) component calls an api to fetch selfcare products list.
    // this causes an error, so we mock to avoid it
    global.fetch = () =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      }) as Promise<Response>;
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
    global.fetch = unmockedFetch;
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
    expect(result.container).toHaveTextContent(
      'Non hai le autorizzazioni necessarie per accedere a questa pagina'
    );
  });

  it('render component - user logged in', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(true, true));
    mock.onGet('/bff/v1/institutions').reply(200, institutionsDTO);
    mock.onGet('/bff/v1/institutions/products').reply(200, productsDTO);
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
    expect(mock.history.get).toHaveLength(4);
  });

  it('Sidemenu not included if error in API call to fetch TOS and Privacy', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(500);
    mock.onGet('downtime/v1/status').reply(200, currentStatusDTO);
    mock.onGet('/bff/v1/institutions').reply(200, institutionsDTO);
    mock.onGet('/bff/v1/institutions/products').reply(200, productsDTO);
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const sideMenu = result.queryByTestId('side-menu');
    expect(sideMenu).not.toBeInTheDocument();
    expect(result.container).not.toHaveTextContent('Generic Page');
    expect(mock.history.get).toHaveLength(4);
  });

  it('Sidemenu not included if user has not accepted the TOS and PRIVACY', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(false, false));
    mock.onGet('downtime/v1/status').reply(200, currentStatusDTO);
    mock.onGet('/bff/v1/institutions').reply(200, institutionsDTO);
    mock.onGet('/bff/v1/institutions/products').reply(200, productsDTO);
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const sideMenu = result.queryByTestId('side-menu');
    expect(sideMenu).not.toBeInTheDocument();
    const tosPage = result.queryByTestId('tos-acceptance-page');
    expect(tosPage).toBeInTheDocument();
    expect(result.container).not.toHaveTextContent('Generic Page');
    expect(mock.history.get).toHaveLength(4);
  });
});
