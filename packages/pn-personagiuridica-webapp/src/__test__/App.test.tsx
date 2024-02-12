import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';

import App from '../App';
import { currentStatusDTO } from '../__mocks__/AppStatus.mock';
import { userResponse } from '../__mocks__/Auth.mock';
import { digitalAddresses } from '../__mocks__/Contacts.mock';
import { GET_CONSENTS } from '../api/consents/consents.routes';
import { CONTACTS_LIST } from '../api/contacts/contacts.routes';
import { COUNT_DELEGATORS } from '../api/delegations/delegations.routes';
import { DelegationStatus } from '../models/Deleghe';
import { ConsentType } from '../models/consents';
import { PNRole, PartyRole } from '../redux/auth/types';
import { RenderResult, act, render } from './test-utils';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  Trans: (props: { i18nKey: string }) => props.i18nKey,
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

vi.mock('../pages/Notifiche.page', () => ({ default: () => <div>Generic Page</div> }));

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
  },
};

describe('App', async () => {
  let mock: MockAdapter;
  // this is needed because there is a bug when vi.mock is used
  // https://github.com/vitest-dev/vitest/issues/3300
  // maybe with vitest 1, we can remove the workaround
  const apiClients = await import('../api/apiClients');

  beforeAll(() => {
    mock = new MockAdapter(apiClients.apiClient);
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
    mock.onGet('downtime/v1/status').reply(200, currentStatusDTO);
    mock.onGet(CONTACTS_LIST()).reply(200, digitalAddresses);
    mock.onGet(COUNT_DELEGATORS(DelegationStatus.PENDING)).reply(200, 3);
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

  it('sidemenu not included if error in API call to fetch TOS', async () => {
    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(200, {
      recipientId: userResponse.uid,
      consentType: ConsentType.DATAPRIVACY,
      accepted: true,
    });
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(500);
    mock.onGet('downtime/v1/status').reply(200, currentStatusDTO);
    mock.onGet(CONTACTS_LIST()).reply(200, digitalAddresses);
    mock.onGet(COUNT_DELEGATORS(DelegationStatus.PENDING)).reply(200, 3);
    let result: RenderResult;
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
    mock.onGet(COUNT_DELEGATORS(DelegationStatus.PENDING)).reply(200, 3);
    let result: RenderResult;
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
    mock.onGet(COUNT_DELEGATORS(DelegationStatus.PENDING)).reply(200, 3);
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

  it('sidemenu items if user is admin', async () => {
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
    mock.onGet(COUNT_DELEGATORS(DelegationStatus.PENDING)).reply(200, 3);
    let result: RenderResult;
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    const sideMenu = result!.getByTestId('side-menu');
    const sideMenuItems = sideMenu.querySelectorAll('[data-testid^=sideMenuItem-]');
    // link to notifications + link to delegated notifications + link to app status + link to delegations +
    // link to contacts + 2 links to selfcare + collapsible menu that contains the first two links
    expect(sideMenuItems).toHaveLength(8);
    const collapsibleMenu = sideMenuItems[0].querySelector('[data-testid=collapsible-menu]');
    expect(collapsibleMenu).toBeInTheDocument();
  });

  it('sidemenu items if user is a group admin', async () => {
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
    mock.onGet(COUNT_DELEGATORS(DelegationStatus.PENDING)).reply(200, 3);
    let result: RenderResult;
    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          ...reduxInitialState,
          userState: {
            user: {
              ...userResponse,
              hasGroup: true,
            },
          },
        },
      });
    });
    expect(mock.history.get).toHaveLength(4);
    const sideMenu = result!.getByTestId('side-menu');
    const sideMenuItems = sideMenu.querySelectorAll('[data-testid^=sideMenuItem-]');
    // link to delegated notifications + link to app status + link to delegations +
    // 2 links to selfcare
    expect(sideMenuItems).toHaveLength(5);
    const collapsibleMenu = sideMenuItems[0].querySelector('[data-testid=collapsible-menu]');
    expect(collapsibleMenu).not.toBeInTheDocument();
  });

  it('sidemenu items if user is an operator', async () => {
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
    let result: RenderResult;
    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          ...reduxInitialState,
          userState: {
            user: {
              ...userResponse,
              organization: {
                ...userResponse.organization,
                roles: [
                  {
                    partyRole: PartyRole.MANAGER,
                    role: PNRole.OPERATOR,
                  },
                ],
              },
            },
          },
        },
      });
    });
    expect(mock.history.get).toHaveLength(3);
    const sideMenu = result!.getByTestId('side-menu');
    const sideMenuItems = sideMenu.querySelectorAll('[data-testid^=sideMenuItem-]');
    // link to notifications + link to delegated notifications + link to app status +
    // 2 links to selfcare + collapsible menu that contains the first two links
    expect(sideMenuItems).toHaveLength(6);
    const collapsibleMenu = sideMenuItems[0].querySelector('[data-testid=collapsible-menu]');
    expect(collapsibleMenu).toBeInTheDocument();
  });

  it('sidemenu items if user is a group operator', async () => {
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
    let result: RenderResult;
    await act(async () => {
      result = render(<Component />, {
        preloadedState: {
          ...reduxInitialState,
          userState: {
            user: {
              ...userResponse,
              organization: {
                ...userResponse.organization,
                roles: [
                  {
                    partyRole: PartyRole.MANAGER,
                    role: PNRole.OPERATOR,
                  },
                ],
              },
              hasGroup: true,
            },
          },
        },
      });
    });
    expect(mock.history.get).toHaveLength(3);
    const sideMenu = result!.getByTestId('side-menu');
    const sideMenuItems = sideMenu.querySelectorAll('[data-testid^=sideMenuItem-]');
    // link to delegated notifications + link to app status +
    // 2 links to selfcare
    expect(sideMenuItems).toHaveLength(4);
    const collapsibleMenu = sideMenuItems[0].querySelector('[data-testid=collapsible-menu]');
    expect(collapsibleMenu).not.toBeInTheDocument();
  });
});
