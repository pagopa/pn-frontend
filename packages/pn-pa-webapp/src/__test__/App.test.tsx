import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import { ThemeProvider } from '@emotion/react';
import { apiOutcomeTestHelper } from '@pagopa-pn/pn-commons';
import { theme } from '@pagopa/mui-italia';

import App from '../App';
import { userResponse } from '../__mocks__/Auth.mock';
import { apiClient } from '../api/apiClients';
import { GET_CONSENTS } from '../api/consents/consents.routes';
import { ConsentType } from '../models/consents';
import { AUTH_ACTIONS } from '../redux/auth/actions';
import { act, render, screen } from './test-utils';

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

let mockLayout = false;

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  const OriginalLayout = original.Layout;
  return {
    ...original,
    Layout: (props: any) =>
      mockLayout ? (
        <>
          <div>{props.showSideMenu ? 'sidemenu' : ''}</div>
          <div>Content</div>
        </>
      ) : (
        <OriginalLayout {...props} />
      ),
  };
});

const Component = () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

const reduxInitialState = {
  userState: {
    user: userResponse,
    fetchedTos: true,
    fetchedPrivacy: true,
    tosConsent: {
      accepted: true,
      isFirstAccept: false,
      currentVersion: 'mocked-version-1',
    },
    privacyConsent: {
      accepted: true,
      isFirstAccept: false,
      currentVersion: 'mocked-version-1',
    },
  },
};

describe('App', () => {
  // eslint-disable-next-line functional/no-let
  let mock: MockAdapter;

  beforeEach(() => {
    mockLayout = false;
  });

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('render component - user not logged in', async () => {
    let result;
    await act(async () => {
      result = render(<Component />);
    });
    expect(result.container).toHaveTextContent(
      'Non hai le autorizzazioni necessarie per accedere a questa pagina'
    );
  });

  it('render component - user logged ind', async () => {
    let result;
    await act(async () => {
      result = render(<Component />, { preloadedState: reduxInitialState });
    });
    expect(result.container).toHaveTextContent('header.notification-platform');
    expect(result.container).toHaveTextContent('Content');
  });

  it.skip('Sidemenu not included if error in API call to fetch organization', async () => {
    mockLayout = true;
    await act(async () => {
      render(<Component />, { preloadedState: reduxInitialState });
    });
    const sidemenuComponent = screen.queryByText('sidemenu');
    expect(sidemenuComponent).toBeNull();
  });

  it.skip('Sidemenu not included if error in API call to fetch TOS', async () => {
    mockLayout = true;
    const mockReduxStateWithApiError = {
      ...reduxInitialState,
      appState: apiOutcomeTestHelper.appStateWithMessageForAction(AUTH_ACTIONS.GET_TOS_APPROVAL),
    };
    await act(
      async () => void render(<Component />, { preloadedState: mockReduxStateWithApiError })
    );
    const sidemenuComponent = screen.queryByText('sidemenu');
    expect(sidemenuComponent).toBeNull();
  });

  it.skip('Sidemenu not included if error in API call to fetch PRIVACY', async () => {
    mockLayout = true;
    const mockReduxStateWithApiError = {
      ...reduxInitialState,
      appState: apiOutcomeTestHelper.appStateWithMessageForAction(
        AUTH_ACTIONS.GET_PRIVACY_APPROVAL
      ),
    };
    await act(
      async () => void render(<Component />, { preloadedState: mockReduxStateWithApiError })
    );
    const sidemenuComponent = screen.queryByText('sidemenu');
    expect(sidemenuComponent).toBeNull();
  });

  it.skip('Sidemenu not included if user has not accepted the TOS and PRIVACY', async () => {
    mockLayout = true;
    await act(async () => void render(<Component />, { preloadedState: reduxInitialState }));
    const sidemenuComponent = screen.queryByText('sidemenu');
    expect(sidemenuComponent).toBeNull();
  });

  it.skip('Sidemenu included if user has accepted the TOS and PRIVACY', async () => {
    mockLayout = true;
    await act(async () => void render(<Component />, { preloadedState: reduxInitialState }));
    const sidemenuComponent = screen.queryByText('sidemenu');
    expect(sidemenuComponent).toBeTruthy();
  });
});
