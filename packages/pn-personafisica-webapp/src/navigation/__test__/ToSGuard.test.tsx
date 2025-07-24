import MockAdapter from 'axios-mock-adapter';
import { Route, Routes } from 'react-router-dom';

import { userResponse } from '../../__mocks__/Auth.mock';
import { tosPrivacyConsentMock } from '../../__mocks__/Consents.mock';
import { act, render, screen, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import ToSGuard from '../ToSGuard';

const reduxState = {
  userState: {
    user: userResponse,
    fetchedTos: false,
    fetchedPrivacy: false,
    tosConsent: {
      accepted: false,
      isFirstAccept: false,
      consentVersion: '',
    },
    privacyConsent: {
      accepted: false,
      isFirstAccept: false,
      consentVersion: '',
    },
    tosPrivacyApiError: false,
  },
};

const Guard = () => (
  <Routes>
    <Route path="/" element={<ToSGuard />}>
      <Route path="/" element={<div>Generic Page</div>} />
    </Route>
  </Routes>
);

describe('Tests the ToSGuard component', async () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders the loading page component if tos and privacy are not fetched', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([200, tosPrivacyConsentMock(false, false)]);
        }, 2000);
      });
    });

    await act(async () => {
      render(<Guard />, { preloadedState: reduxState });
    });
    const pageComponent = screen.queryByTestId('loading-skeleton');
    const tosComponent = screen.queryByTestId('tos-acceptance-page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
    expect(tosComponent).toBeNull();
    expect(genericPage).toBeNull();
    expect(mock.history.get).toHaveLength(1);
  });

  it('renders the tos page component if privacy are not accepted', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(true, false));
    await act(async () => {
      render(<Guard />, { preloadedState: reduxState });
    });
    const pageComponent = screen.queryByTestId('loading-skeleton');
    const tosComponent = screen.queryByTestId('tos-acceptance-page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeNull();
    expect(tosComponent).toBeTruthy();
    expect(genericPage).toBeNull();
    expect(mock.history.get).toHaveLength(1);
  });

  it('renders the tos page component if tos are not accepted', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(false, true));
    await act(async () => {
      render(<Guard />, { preloadedState: reduxState });
    });
    const pageComponent = screen.queryByTestId('loading-skeleton');
    const tosComponent = screen.queryByTestId('tos-acceptance-page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeNull();
    expect(tosComponent).toBeTruthy();
    expect(genericPage).toBeNull();
    expect(mock.history.get).toHaveLength(1);
  });

  it('renders the generic page component if tos and privacy are accepted', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(true, true));
    await act(async () => {
      render(<Guard />, { preloadedState: reduxState });
    });
    const pageComponent = screen.queryByTestId('loading-skeleton');
    const tosComponent = screen.queryByTestId('tos-acceptance-page');
    const genericPage = screen.queryByText('Generic Page');
    expect(pageComponent).toBeNull();
    expect(tosComponent).toBeNull();
    expect(genericPage).toBeTruthy();
    expect(mock.history.get).toHaveLength(1);
  });

  it('renders sessionModal if tosApi has errors ', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(500);
    await act(async () => {
      render(<Guard />, {
        preloadedState: { userState: { ...reduxState.userState, tosPrivacyApiError: true } },
      });
    });

    await waitFor(() => {
      const logoutComponent = screen.queryByTestId('session-modal');
      expect(logoutComponent).toBeTruthy();
    });
  });
});
