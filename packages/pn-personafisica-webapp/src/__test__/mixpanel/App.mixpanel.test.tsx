import MockAdapter from 'axios-mock-adapter';
import { Suspense } from 'react';
import { vi } from 'vitest';

import { ThemeProvider } from '@mui/material';
import { themeNext } from '@pagopa/mui-italia';

import App from '../../App';
import { currentStatusDTO } from '../../__mocks__/AppStatus.mock';
import { userResponse } from '../../__mocks__/Auth.mock';
import { tosPrivacyConsentMock } from '../../__mocks__/Consents.mock';
import { mandatesByDelegate } from '../../__mocks__/Delegations.mock';
import { apiClient, authClient } from '../../api/apiClients';
import { PFEventsType } from '../../models/PFEventsType';
import { LoginProvider } from '../../models/User';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import { PFTriggerEventSpy, act, fireEvent, render, screen, waitFor, within } from '../test-utils';

vi.mock('../../pages/Notifiche.page', () => ({ default: () => <div>Generic Page</div> }));
vi.mock('../../pages/Profile.page', () => ({ default: () => <div>Profile Page</div> }));

const Component = () => (
  <ThemeProvider theme={themeNext}>
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
    tosConsent: { accepted: false, isFirstAccept: false, currentVersion: 'mocked-version-1' },
    privacyConsent: { accepted: false, isFirstAccept: false, currentVersion: 'mocked-version-1' },
    tosPrivacyApiError: false,
    loginProvider: LoginProvider.SPIDHUB,
  },
};

const unmockedFetch = globalThis.fetch;

describe('App - Mixpanel events', () => {
  let triggerEventSpy: PFTriggerEventSpy;
  let mock: MockAdapter;
  let mockAuth: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    mockAuth = new MockAdapter(authClient);
    globalThis.fetch = () =>
      Promise.resolve({ json: () => Promise.resolve([]) }) as Promise<Response>;
  });

  beforeEach(() => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(true, true));
    mock.onGet('/bff/v1/downtime/status').reply(200, currentStatusDTO);
    mock.onGet('/bff/v1/mandate/delegate').reply(200, mandatesByDelegate);
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    mock.reset();
    mockAuth.reset();
    triggerEventSpy.mockRestore();
  });

  afterAll(() => {
    mock.restore();
    mockAuth.restore();
    globalThis.fetch = unmockedFetch;
  });

  it('fires SEND_VIEW_PROFILE when the profile menu item is clicked', async () => {
    await act(async () => {
      render(<Component />, { preloadedState: reduxInitialState });
    });

    const header = document.querySelector('header');
    const userButton = header?.querySelector(
      `[aria-label="Area utente ${userResponse.name} ${userResponse.family_name}"]`
    );

    await act(async () => {
      fireEvent.click(userButton!);
    });

    const menu = await waitFor(() => screen.getByRole('presentation'));
    const menuItems = within(menu).getAllByRole('menuitem');

    await act(async () => {
      fireEvent.click(menuItems[0]);
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_VIEW_PROFILE, {
      source: 'user_menu',
    });
  });
});
