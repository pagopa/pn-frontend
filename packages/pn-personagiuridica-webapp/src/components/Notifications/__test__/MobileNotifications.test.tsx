import { vi } from 'vitest';

import { createMatchMedia } from '@pagopa-pn/pn-commons/src/test-utils';

import { notificationsToFe } from '../../../__mocks__/Notifications.mock';
import { RenderResult, act, fireEvent, render, waitFor } from '../../../__test__/test-utils';
import {
  GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH,
  GET_DETTAGLIO_NOTIFICA_PATH,
} from '../../../navigation/routes.const';
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

  it('renders MobileNotifications - no notifications', async () => {
    // render component
    await act(async () => {
      result = render(
        <MobileNotifications
          notifications={[]}
          filtersApplied={false}
          onCleanFilters={onCleanFilters}
        />
      );
    });
    const notificationCards = result!.queryAllByTestId('mobileNotificationsCards');
    expect(notificationCards).toHaveLength(0);
    expect(result.container).toHaveTextContent(/empty-state.title/i);
    expect(result.container).toHaveTextContent(/empty-state.description/i);
  });

  it('renders component - no notification - delegate access', async () => {
    // render component
    await act(async () => {
      result = render(
        <MobileNotifications
          notifications={[]}
          filtersApplied={false}
          onCleanFilters={onCleanFilters}
          isDelegatedPage
        />
      );
    });
    const notificationCards = result!.queryAllByTestId('mobileNotificationsCards');
    expect(notificationCards).toHaveLength(0);
    expect(result.container).toHaveTextContent(/empty-state.delegate/i);
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
    expect(result.container).not.toHaveTextContent('table.destinatario');
  });

  it('renders component - notification - delegate access', async () => {
    // render component
    await act(async () => {
      result = render(
        <MobileNotifications
          notifications={notificationsToFe.resultsPage}
          filtersApplied={false}
          onCleanFilters={onCleanFilters}
          isDelegatedPage
        />
      );
    });
    const notificationCards = result!.queryAllByTestId('mobileNotificationsCards');
    expect(notificationCards).toHaveLength(notificationsToFe.resultsPage.length);
    expect(result.container).toHaveTextContent('table.destinatario');
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
    const notificationCards = result!.queryAllByTestId('mobileNotificationsCards');
    const notificationsCardButton = notificationCards[1].querySelector('button');
    fireEvent.click(notificationsCardButton!);
    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(
        GET_DETTAGLIO_NOTIFICA_PATH(notificationsToFe.resultsPage[1].iun)
      );
    });
  });

  it('go to notification detail - delegate access', async () => {
    await act(async () => {
      result = render(
        <MobileNotifications
          notifications={[
            ...notificationsToFe.resultsPage.map((n) => ({ ...n, mandateId: 'mocked-mandate-id' })),
          ]}
          filtersApplied={false}
          onCleanFilters={onCleanFilters}
          isDelegatedPage
        />
      );
    });
    const notificationCards = result!.queryAllByTestId('mobileNotificationsCards');
    const notificationsCardButton = notificationCards[1].querySelector('button');
    fireEvent.click(notificationsCardButton!);
    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(
        GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH(
          notificationsToFe.resultsPage[1].iun,
          'mocked-mandate-id'
        )
      );
    });
  });
});
