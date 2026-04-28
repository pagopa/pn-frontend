import MockAdapter from 'axios-mock-adapter';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import {
  Configuration,
  GetNotificationsResponse,
  NotificationStatus,
  formatToTimezoneString,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';

import { digitalAddresses } from '../../__mocks__/Contacts.mock';
import { emptyNotificationsFromBe, notificationsDTO } from '../../__mocks__/Notifications.mock';
import { RenderResult, act, render, screen, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import type { PfConfiguration } from '../../services/configuration.service';
import OnboardingGuard from '../OnboardingGuard';
import * as routes from '../routes.const';

const Guard = () => (
  <Routes>
    <Route element={<OnboardingGuard />}>
      <Route path="/" element={<div>Onboarding Page</div>} />
      <Route path="/notifiche" element={<div>Notifications Page</div>} />
    </Route>
  </Routes>
);

describe('OnboardingGuard', async () => {
  let mock: MockAdapter;
  let result: RenderResult;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    Configuration.setForTest<PfConfiguration>({
      IS_ONBOARDING_ENABLED: true,
    } as PfConfiguration);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  const fetchReceivedNotifications = (response: GetNotificationsResponse) => {
    mock
      .onGet(
        `/bff/v1/notifications/received?startDate=${encodeURIComponent(
          formatToTimezoneString(tenYearsAgo)
        )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=10`
      )
      .reply(200, response);
  };

  it('redirects to onboarding when all conditions are met', async () => {
    mock.onGet('/bff/v1/addresses').reply(200, []);
    fetchReceivedNotifications(emptyNotificationsFromBe);

    await act(async () => {
      result = render(<Guard />, {
        preloadedState: { userState: { isFreshLogin: true } },
      });
    });

    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(routes.ONBOARDING);
    });
  });

  it('does not redirect when not on root path', async () => {
    mock.onGet('/bff/v1/addresses').reply(200, []);
    fetchReceivedNotifications(emptyNotificationsFromBe);

    await act(async () => {
      result = render(<Guard />, {
        preloadedState: { userState: { isFreshLogin: true } },
        route: '/notifiche',
      });
    });

    await waitFor(() => {
      expect(screen.queryByText('Notifications Page')).toBeInTheDocument();
    });
    expect(result.router.state.location.pathname).toBe('/notifiche');
  });

  it('does not redirect when isFreshLogin is false', async () => {
    mock.onGet('/bff/v1/addresses').reply(200, []);
    fetchReceivedNotifications(emptyNotificationsFromBe);

    await act(async () => {
      result = render(<Guard />, {
        preloadedState: { userState: { isFreshLogin: false } },
      });
    });

    await waitFor(() => {
      expect(screen.queryByText('Onboarding Page')).toBeInTheDocument();
    });
    expect(result.router.state.location.pathname).toBe('/');
  });

  it('does not redirect when user has required contacts', async () => {
    mock.onGet('/bff/v1/addresses').reply(200, digitalAddresses);
    fetchReceivedNotifications(emptyNotificationsFromBe);

    await act(async () => {
      result = render(<Guard />, {
        preloadedState: {
          userState: { isFreshLogin: true },
          contactsState: { digitalAddresses },
        },
      });
    });

    await waitFor(() => {
      expect(screen.queryByText('Onboarding Page')).toBeInTheDocument();
    });
    expect(result.router.state.location.pathname).toBe('/');
  });

  it('does not redirect when user has unread notifications', async () => {
    const unreadNotificationsResponse = {
      ...emptyNotificationsFromBe,
      resultsPage: [
        {
          ...notificationsDTO.resultsPage[0],
          notificationStatus: NotificationStatus.DELIVERED,
        },
      ],
    };
    mock.onGet('/bff/v1/addresses').reply(200, []);
    fetchReceivedNotifications(unreadNotificationsResponse);

    await act(async () => {
      result = render(<Guard />, {
        preloadedState: { userState: { isFreshLogin: true } },
      });
    });

    await waitFor(() => {
      expect(screen.queryByText('Onboarding Page')).toBeInTheDocument();
    });
    expect(result.router.state.location.pathname).toBe('/');
  });

  it('does not redirect when IS_ONBOARDING_ENABLED is false', async () => {
    Configuration.setForTest<PfConfiguration>({
      IS_ONBOARDING_ENABLED: false,
    } as PfConfiguration);
    mock.onGet('/bff/v1/addresses').reply(200, []);
    fetchReceivedNotifications(emptyNotificationsFromBe);

    await act(async () => {
      result = render(<Guard />, {
        preloadedState: { userState: { isFreshLogin: true } },
      });
    });

    await waitFor(() => {
      expect(screen.queryByText('Onboarding Page')).toBeInTheDocument();
    });
    expect(result.router.state.location.pathname).toBe('/');
  });

  it('sets isFreshLogin to false after loading completes', async () => {
    mock.onGet('/bff/v1/addresses').reply(200, []);
    fetchReceivedNotifications(emptyNotificationsFromBe);

    await act(async () => {
      result = render(<Guard />, {
        preloadedState: { userState: { isFreshLogin: true } },
      });
    });

    await waitFor(() => {
      expect(result.testStore.getState().userState.isFreshLogin).toBe(false);
    });
  });
});
