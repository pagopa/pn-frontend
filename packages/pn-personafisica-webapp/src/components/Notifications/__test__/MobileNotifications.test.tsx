import { vi } from 'vitest';

import { createMatchMedia } from '@pagopa-pn/pn-commons/src/test-utils';

import { digitalAddressesSercq } from '../../../__mocks__/Contacts.mock';
import { notificationsToFe } from '../../../__mocks__/Notifications.mock';
import { RenderResult, act, fireEvent, render, waitFor } from '../../../__test__/test-utils';
import * as routes from '../../../navigation/routes.const';
import MobileNotifications from '../MobileNotifications';

describe('MobileNotifications Component', () => {
  let result: RenderResult;
  const onCleanFilters = vi.fn();
  const originalMatchMedia = globalThis.matchMedia;
  const originalResizeObserver = globalThis.ResizeObserver;

  beforeAll(() => {
    globalThis.matchMedia = createMatchMedia(800);
    globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  afterAll(() => {
    globalThis.matchMedia = originalMatchMedia;
    globalThis.ResizeObserver = originalResizeObserver;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders MobileNotifications - no notifications - no contacts', async () => {
    // render component
    await act(async () => {
      result = render(
        <MobileNotifications
          notifications={[]}
          filtersApplied={false}
          onCleanFilters={onCleanFilters}
        />,
        {
          preloadedState: {
            contactsState: {
              digitalAddresses: [],
            },
          },
        }
      );
    });
    const notificationCards = result!.queryAllByTestId('mobileNotificationsCards');
    expect(notificationCards).toHaveLength(0);
    expect(result!.container).toHaveTextContent(/empty-state.title/i);
    expect(result!.container).toHaveTextContent(/empty-state.description-onboarding/i);
    // clicks on empty state action
    const button = result.getByTestId('button-route-onboarding');
    fireEvent.click(button);
    expect(result.router.state.location.pathname).toBe(routes.ONBOARDING);
  });

  it('renders MobileNotifications - no notifications - with contacts', async () => {
    // render component
    await act(async () => {
      result = render(
        <MobileNotifications
          notifications={[]}
          filtersApplied={false}
          onCleanFilters={onCleanFilters}
        />,
        {
          preloadedState: {
            contactsState: {
              digitalAddresses: digitalAddressesSercq,
            },
          },
        }
      );
    });
    const notificationCards = result!.queryAllByTestId('mobileNotificationsCards');
    expect(notificationCards).toHaveLength(0);
    expect(result!.container).toHaveTextContent(/empty-state.title/i);
    expect(result!.container).toHaveTextContent(/empty-state.description/i);
    // clicks on empty state action
    const button = result.getByTestId('link-route-contacts');
    fireEvent.click(button);
    expect(result.router.state.location.pathname).toBe(routes.RECAPITI);
  });

  it('renders MobileNotifications - notifications', async () => {
    // render component
    await act(async () => {
      result = render(
        <MobileNotifications
          notifications={notificationsToFe.resultsPage}
          filtersApplied={false}
          onCleanFilters={onCleanFilters}
        />
      );
    });
    const notificationCards = result!.queryAllByTestId('mobileNotificationsCards');
    expect(notificationCards).toHaveLength(notificationsToFe.resultsPage.length);
  });

  it('renders component - no notification after filter', async () => {
    // render component
    await act(async () => {
      result = render(
        <MobileNotifications notifications={[]} filtersApplied onCleanFilters={onCleanFilters} />
      );
    });

    const notificationCards = result.queryAllByTestId('mobileNotificationsCards');
    expect(notificationCards).toHaveLength(0);
    expect(result.container).toHaveTextContent(/empty-state.filtered/i);

    const button = result.getByTestId('link-remove-filters');
    fireEvent.click(button);

    expect(onCleanFilters).toHaveBeenCalledTimes(1);
  });

  it('clicks on go to detail action', async () => {
    // render component
    await act(async () => {
      result = render(
        <MobileNotifications
          notifications={notificationsToFe.resultsPage}
          filtersApplied={false}
          onCleanFilters={onCleanFilters}
        />
      );
    });
    const notificationCards = result!.getAllByTestId('mobileNotificationsCards');
    const notificationsCardButton = notificationCards[0].querySelector('button');
    fireEvent.click(notificationsCardButton!);
    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(
        routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationsToFe.resultsPage[0].iun)
      );
    });
  });
});
