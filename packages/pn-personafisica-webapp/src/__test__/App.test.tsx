import MockAdapter from 'axios-mock-adapter';
import React, { Suspense } from 'react';
import { vi } from 'vitest';

import { ThemeProvider } from '@emotion/react';
import { theme } from '@pagopa/mui-italia';

import App from '../App';
import { currentStatusDTO } from '../__mocks__/AppStatus.mock';
import { userResponse } from '../__mocks__/Auth.mock';
import { digitalAddresses } from '../__mocks__/Contacts.mock';
import { arrayOfDelegators } from '../__mocks__/Delegations.mock';
import { getApiClient } from '../api/apiClients';
import { GET_CONSENTS } from '../api/consents/consents.routes';
import { CONTACTS_LIST } from '../api/contacts/contacts.routes';
import { DELEGATIONS_BY_DELEGATE } from '../api/delegations/delegations.routes';
import { ConsentType } from '../models/consents';
import {
  RenderResult,
  act,
  fireEvent,
  render,
  screen,
  getTestStore,
  waitFor,
  within,
} from './test-utils';

// mock imports
vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  Trans: (props: { i18nKey: string }) => props.i18nKey,
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

vi.mock('../pages/Notifiche.page', () => ({default: () => <div>Generic Page</div>}));
vi.mock('../pages/Profile.page', () => ({default: () => <div>Profile Page</div>}));

const unmockedFetch = global.fetch;

const Component = () => (
  <ThemeProvider theme={theme}>
    <Suspense fallback="loading...">
      <App />
    </Suspense>
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
  },
};

describe('App', () => {
  let mock: MockAdapter;
  let result: RenderResult;
  const original = window.location;

  beforeAll(() => {
    mock = new MockAdapter(getApiClient());
    // FooterPreLogin (mui-italia) component calls an api to fetch selfcare products list.
    // this causes an error, so we mock to avoid it
    global.fetch = () =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      }) as Promise<Response>;
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    global.fetch = unmockedFetch;
  });

  it('render component - user not logged in', async () => {
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
    mock.onGet('downtime/v1/status').reply(200, currentStatusDTO);
    mock.onGet(CONTACTS_LIST()).reply(200, digitalAddresses);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, arrayOfDelegators);
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

  it('check header actions - user logged in', async () => {
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
    mock.onGet('downtime/v1/status').reply(200, currentStatusDTO);
    mock.onGet(CONTACTS_LIST()).reply(200, digitalAddresses);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, arrayOfDelegators);
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const header = document.querySelector('header');
    const userButton = header?.querySelector('[aria-label="party-menu-button"]');
    fireEvent.click(userButton!);
    let menu = await waitFor(() => screen.getByRole('presentation'));
    let menuItems = within(menu).getAllByRole('menuitem');
    expect(menuItems).toHaveLength(2);
    expect(menuItems[0]).toHaveTextContent('menu.profilo');
    expect(menuItems[1]).toHaveTextContent('header.logout');
    fireEvent.click(menuItems[0]);
    await waitFor(() => {
      expect(result!.container).toHaveTextContent('Profile Page');
    });
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '', replace: vi.fn() },
    });
    fireEvent.click(userButton!);
    menu = await waitFor(() => screen.getByRole('presentation'));
    menuItems = within(menu).getAllByRole('menuitem');
    fireEvent.click(menuItems[1]);
    await waitFor(() => {
      expect(getTestStore().getState().userState.user.sessionToken).toBe('');
    });
    Object.defineProperty(window, 'location', { writable: true, value: original });
  });

  it('sidemenu not included if error in API call to fetch TOS', async () => {
    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(200, {
      recipientId: userResponse.uid,
      consentType: ConsentType.DATAPRIVACY,
      accepted: true,
    });
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(500);
    mock.onGet('downtime/v1/status').reply(200, currentStatusDTO);
    mock.onGet(CONTACTS_LIST()).reply(200, digitalAddresses);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, arrayOfDelegators);
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const sideMenu = result!.queryByTestId('side-menu');
    expect(sideMenu).not.toBeInTheDocument();
    expect(result!.container).not.toHaveTextContent('Generic Page');
    expect(mock.history.get).toHaveLength(5);
  });

  it('sidemenu not included if error in API call to fetch PRIVACY', async () => {
    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(500);
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(200, {
      recipientId: userResponse.uid,
      consentType: ConsentType.TOS,
      accepted: true,
    });
    mock.onGet('downtime/v1/status').reply(200, currentStatusDTO);
    mock.onGet(CONTACTS_LIST()).reply(200, digitalAddresses);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, arrayOfDelegators);
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const sideMenu = result!.queryByTestId('side-menu');
    expect(sideMenu).not.toBeInTheDocument();
    expect(result!.container).not.toHaveTextContent('Generic Page');
    expect(mock.history.get).toHaveLength(5);
  });

  it('sidemenu not included if user has not accepted the TOS and PRIVACY', async () => {
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
    mock.onGet(CONTACTS_LIST()).reply(200, digitalAddresses);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, arrayOfDelegators);
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

  it('check header actions - user has not accepted the TOS and PRIVACY', async () => {
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
    mock.onGet(CONTACTS_LIST()).reply(200, digitalAddresses);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, arrayOfDelegators);
    await act(async () => {
      render(<Component />, { preloadedState: reduxInitialState });
    });
    const header = document.querySelector('header');
    const userButton = header?.querySelector('[aria-label="party-menu-button"]');
    fireEvent.click(userButton!);
    const menu = await waitFor(() => screen.getByRole('presentation'));
    const menuItems = within(menu).getAllByRole('menuitem');
    expect(menuItems).toHaveLength(1);
    expect(menuItems[0]).toHaveTextContent('header.logout');
  });

  it('sidemenu items if there are delegators', async () => {
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
    mock.onGet('downtime/v1/status').reply(200, currentStatusDTO);
    mock.onGet(CONTACTS_LIST()).reply(200, digitalAddresses);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, arrayOfDelegators);
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const sideMenu = result!.getByTestId('side-menu');
    const sideMenuItems = sideMenu.querySelectorAll('[data-testid^=sideMenuItem-]');
    expect(sideMenuItems).toHaveLength(4);
    const collapsibleMenu = sideMenuItems[0].querySelector('[data-testid=collapsible-menu]');
    expect(collapsibleMenu).toBeInTheDocument();
  });

  it('sidemenu items if there are no delegators', async () => {
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
    mock.onGet('downtime/v1/status').reply(200, currentStatusDTO);
    mock.onGet(CONTACTS_LIST()).reply(200, digitalAddresses);
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, []);
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const sideMenu = result!.getByTestId('side-menu');
    const sideMenuItems = sideMenu.querySelectorAll('[data-testid^=sideMenuItem-]');
    expect(sideMenuItems).toHaveLength(4);
    const collapsibleMenu = sideMenuItems[0].querySelector('[data-testid=collapsible-menu]');
    expect(collapsibleMenu).not.toBeInTheDocument();
  });
});
