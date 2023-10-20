import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import { ThemeProvider } from '@emotion/react';
import { theme } from '@pagopa/mui-italia';

import App from '../App';
import { currentStatusDTO } from '../__mocks__/AppStatus.mock';
import { userResponse } from '../__mocks__/Auth.mock';
import { apiClient } from '../api/apiClients';
import { GET_CONSENTS } from '../api/consents/consents.routes';
import { ConsentType } from '../models/consents';
import { RenderResult, act, render } from './test-utils';
import { GET_INSTITUTIONS, GET_INSTITUTION_PRODUCTS } from '../api/external-registries/external-registries-routes';
import { institutionsList, productsList } from '../__mocks__/User.mock';

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  Trans: (props: { i18nKey: string }) => props.i18nKey,
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

jest.mock('../pages/Dashboard.page', () => () => <div>Generic Page</div>);

const unmockedFetch = global.fetch;

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
    productsOfInstitution: []
  },
};

describe('App', () => {
  let mock: MockAdapter;

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
    let result: RenderResult;
    await act(async () => {
      result = render(<Component />);
    });
    const header = document.querySelector('header');
    expect(header).toBeInTheDocument();
    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
    const sideMenu = result!.queryByTestId('side-menu');
    expect(sideMenu).not.toBeInTheDocument();
    expect(result!.container).toHaveTextContent(
      'Non hai le autorizzazioni necessarie per accedere a questa pagina'
    );
  });

  it('render component - user logged in', async () => {
    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(200, {
      recipientId: userResponse.uid,
      consentType: ConsentType.DATAPRIVACY,
      accepted: true,
    });
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(200, {
      recipientId: userResponse.uid,
      consentType: ConsentType.TOS,
      accepted: true,
    });
    mock.onGet(GET_INSTITUTIONS()).reply(200, institutionsList);
    mock.onGet(GET_INSTITUTION_PRODUCTS('1')).reply(200, productsList);
    mock.onGet('downtime/v1/status').reply(200, currentStatusDTO);
    let result: RenderResult;
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const header = document.querySelector('header');
    expect(header).toBeInTheDocument();
    const footer = document.querySelector('footer');
    expect(footer).toBeInTheDocument();
    const sideMenu = result!.queryByTestId('side-menu');
    expect(sideMenu).toBeInTheDocument();
    expect(result!.container).toHaveTextContent('Generic Page');
    expect(mock.history.get).toHaveLength(5);
  });

  it('Sidemenu not included if error in API call to fetch TOS', async () => {
    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(200, {
      recipientId: userResponse.uid,
      consentType: ConsentType.DATAPRIVACY,
      accepted: true,
    });
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(500);
    mock.onGet('downtime/v1/status').reply(200, currentStatusDTO);
    let result: RenderResult;
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const sideMenu = result!.queryByTestId('side-menu');
    expect(sideMenu).not.toBeInTheDocument();
    expect(result!.container).not.toHaveTextContent('Generic Page');
    expect(mock.history.get).toHaveLength(5);
  });

  it('Sidemenu not included if error in API call to fetch PRIVACY', async () => {
    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(500);
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(200, {
      recipientId: userResponse.uid,
      consentType: ConsentType.TOS,
      accepted: true,
    });
    mock.onGet('downtime/v1/status').reply(200, currentStatusDTO);
    let result: RenderResult;
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const sideMenu = result!.queryByTestId('side-menu');
    expect(sideMenu).not.toBeInTheDocument();
    expect(result!.container).not.toHaveTextContent('Generic Page');
    expect(mock.history.get).toHaveLength(5);
  });

  it('Sidemenu not included if user has not accepted the TOS and PRIVACY', async () => {
    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(200, {
      recipientId: userResponse.uid,
      consentType: ConsentType.DATAPRIVACY,
      accepted: false,
    });
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(200, {
      recipientId: userResponse.uid,
      consentType: ConsentType.TOS,
      accepted: false,
    });
    mock.onGet('downtime/v1/status').reply(200, currentStatusDTO);
    let result: RenderResult;
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const sideMenu = result!.queryByTestId('side-menu');
    expect(sideMenu).not.toBeInTheDocument();
    const tosPage = result!.queryByTestId('tos-acceptance-page');
    expect(tosPage).toBeInTheDocument();
    expect(result!.container).not.toHaveTextContent('Generic Page');
    expect(mock.history.get).toHaveLength(5);
  });
});
