import MockAdapter from 'axios-mock-adapter';

import { userResponse } from '../../__mocks__/Auth.mock';
import { tosPrivacyConsentMock } from '../../__mocks__/Consents.mock';
import { act, render, screen, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import Router from '../routes';
import * as routes from '../routes.const';

// the user has a valid session, but has accepted neither the tos nor the privacy policy
const reduxState = {
  userState: {
    loading: false,
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

describe('Tests the Router component', () => {
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

  it('renders the support page if tos and privacy are not accepted', async () => {
    await act(async () => {
      render(<Router />, { preloadedState: reduxState, route: routes.SUPPORT });
    });
    // the support page is lazy loaded, so we have to wait for it
    await waitFor(() => {
      expect(screen.queryByTestId('supportForm')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('tos-acceptance-page')).toBeNull();
    // the support route is out of the ToSGuard, so the consents are not even fetched
    expect(mock.history.get).toHaveLength(0);
  });

  it('renders the tos page instead of a guarded page if tos and privacy are not accepted', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(false, false));
    await act(async () => {
      render(<Router />, { preloadedState: reduxState, route: routes.NOTIFICHE });
    });
    const supportForm = screen.queryByTestId('supportForm');
    const tosComponent = screen.queryByTestId('tos-acceptance-page');
    expect(tosComponent).toBeInTheDocument();
    expect(supportForm).toBeNull();
    expect(mock.history.get).toHaveLength(1);
  });
});
