import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import {
  AppResponseMessage,
  ResponseEventDispatcher,
  formatDate,
  formatToTimezoneString,
  tenYearsAgo,
} from '@pagopa-pn/pn-commons';
import { createMatchMedia, testInput } from '@pagopa-pn/pn-commons/src/test-utils';
import { getEndOfDay, today } from '@pagopa-pn/pn-commons/src/utility/date.utility';

import { mandatesByDelegate } from '../../__mocks__/Delegations.mock';
import { errorMock } from '../../__mocks__/Errors.mock';
import { emptyNotificationsFromBe, notificationsDTO } from '../../__mocks__/Notifications.mock';
import { RenderResult, act, fireEvent, render, screen, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { DASHBOARD_ACTIONS } from '../../redux/dashboard/actions';
import Notifiche from '../Notifiche.page';

describe('Notifiche Page', () => {
  let result: RenderResult;
  let mock: MockAdapter;
  const originalMatchMedia = globalThis.matchMedia;
  const originalResizeObserver = globalThis.ResizeObserver;

  const notificationsPath = `/bff/v1/notifications/received?startDate=${encodeURIComponent(
    formatToTimezoneString(tenYearsAgo)
  )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=10&communicationType=ALL`;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  afterEach(() => {
    mock.reset();
    globalThis.matchMedia = originalMatchMedia;
  });

  afterAll(() => {
    mock.restore();
    globalThis.matchMedia = originalMatchMedia;
    globalThis.ResizeObserver = originalResizeObserver;
  });

  it('renders page', async () => {
    mock.onGet(notificationsPath).reply(200, notificationsDTO);

    await act(async () => {
      result = render(<Notifiche />);
    });
    expect(screen.getByTestId('titleBox')).toHaveTextContent(/title/i);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/received');
    const filterForm = result.getByTestId('filter-form');
    expect(filterForm).toBeInTheDocument();
    const notificationsTable = result.container.querySelector('table');
    expect(notificationsTable).toBeInTheDocument();
    const itemsPerPageSelector = result.queryByTestId('itemsPerPageSelector');
    expect(itemsPerPageSelector).toBeInTheDocument();
    const pageSelector = result.queryByTestId('pageSelector');
    expect(pageSelector).toBeInTheDocument();
  });

  it('render page without notifications after filtering and remove filters', async () => {
    mock.onGet(notificationsPath).reply(200, notificationsDTO);
    const notificationsPathFiltered = `/bff/v1/notifications/received?startDate=${encodeURIComponent(
      formatToTimezoneString(tenYearsAgo)
    )}&endDate=${encodeURIComponent(
      formatToTimezoneString(getEndOfDay(tenYearsAgo))
    )}&size=10&communicationType=ALL`;
    mock.onGet(notificationsPathFiltered).reply(200, emptyNotificationsFromBe);
    await act(async () => {
      result = render(<Notifiche />);
    });
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/received');
    // filter
    const form = result.container.querySelector('form') as HTMLFormElement;
    await testInput(form, 'startDate', formatDate(tenYearsAgo.toISOString()));
    await testInput(form, 'endDate', formatDate(tenYearsAgo.toISOString()));
    const submitButton = form.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton!);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].url).toContain('/bff/v1/notifications/received');
    });
    expect(result.container).toHaveTextContent(/empty-state.filtered/);
    // remove filters
    const routeContactsBtn = result.getByTestId('link-remove-filters');
    fireEvent.click(routeContactsBtn);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[1].url).toContain('/bff/v1/notifications/received');
    });
    expect(result.container).not.toHaveTextContent(/empty-state.filtered/);
  });

  it('change pagination', async () => {
    mock
      .onGet(notificationsPath)
      .reply(200, { ...notificationsDTO, resultsPage: [notificationsDTO.resultsPage[0]] });
    const notificationPathWithSize = `/bff/v1/notifications/received?startDate=${encodeURIComponent(
      formatToTimezoneString(tenYearsAgo)
    )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=20&communicationType=ALL`;
    mock.onGet(notificationPathWithSize).reply(200, notificationsDTO);
    await act(async () => {
      result = render(<Notifiche />);
    });
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/received');
    let rows = result.getAllByTestId('notificationsTable.body.row');
    expect(rows).toHaveLength(1);
    // change size
    const itemsPerPageSelector = result.getByTestId('itemsPerPageSelector');
    const itemsPerPageSelectorBtn = itemsPerPageSelector?.querySelector('button');
    fireEvent.click(itemsPerPageSelectorBtn!);
    const itemsPerPageList = screen.getAllByRole('menuitem');
    fireEvent.click(itemsPerPageList[1]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].url).toContain('/bff/v1/notifications/received');
    });
    rows = result.getAllByTestId('notificationsTable.body.row');
    expect(rows).toHaveLength(3);
  });

  it('changes page', async () => {
    mock
      .onGet(notificationsPath)
      .reply(200, { ...notificationsDTO, resultsPage: [notificationsDTO.resultsPage[0]] });
    const notificationPathSecondPage = `/bff/v1/notifications/received?startDate=${encodeURIComponent(
      formatToTimezoneString(tenYearsAgo)
    )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=10&nextPagesKey=${
      notificationsDTO.nextPagesKey[0]
    }&communicationType=ALL`;
    mock
      .onGet(notificationPathSecondPage)
      .reply(200, { ...notificationsDTO, resultsPage: [notificationsDTO.resultsPage[1]] });
    await act(async () => {
      result = render(<Notifiche />);
    });
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/received');
    let rows = result.getAllByTestId('notificationsTable.body.row');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(notificationsDTO.resultsPage[0].iun);
    // change page
    const pageSelector = result.getByTestId('pageSelector');
    const pageButtons = pageSelector?.querySelectorAll('button');
    // the buttons are < 1 2 >
    fireEvent.click(pageButtons[2]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].url).toContain('/bff/v1/notifications/received');
    });
    rows = result.getAllByTestId('notificationsTable.body.row');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(notificationsDTO.resultsPage[1].iun);
  });

  it('filter', async () => {
    mock.onGet(notificationsPath).reply(200, notificationsDTO);
    const notificationPathFiltered = `/bff/v1/notifications/received?startDate=${encodeURIComponent(
      formatToTimezoneString(tenYearsAgo)
    )}&endDate=${encodeURIComponent(
      formatToTimezoneString(today)
    )}&iunMatch=ABCD-EFGH-ILMN-123456-A-1&size=10&communicationType=ALL`;
    mock
      .onGet(notificationPathFiltered)
      .reply(200, { ...notificationsDTO, resultsPage: [notificationsDTO.resultsPage[1]] });
    await act(async () => {
      result = render(<Notifiche />);
    });
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/received');
    let rows = result.getAllByTestId('notificationsTable.body.row');
    expect(rows).toHaveLength(3);
    rows?.forEach((row, index) => {
      expect(row).toHaveTextContent(notificationsDTO.resultsPage[index].iun);
    });
    // filter
    const form = result.container.querySelector('form') as HTMLFormElement;
    await testInput(form, 'iunMatch', 'ABCD-EFGH-ILMN-123456-A-1');
    const submitButton = form.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton!);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].url).toContain('/bff/v1/notifications/received');
    });
    rows = result.getAllByTestId('notificationsTable.body.row');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(notificationsDTO.resultsPage[1].iun);
  });

  it('errors on api', async () => {
    mock.onGet(notificationsPath).reply(errorMock.status, errorMock.data);
    await act(async () => {
      result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <Notifiche />
        </>
      );
    });
    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${DASHBOARD_ACTIONS.GET_RECEIVED_NOTIFICATIONS}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
  });

  it('renders page - mobile', async () => {
    globalThis.matchMedia = createMatchMedia(800);
    mock.onGet(notificationsPath).reply(200, notificationsDTO);

    await act(async () => {
      result = render(<Notifiche />);
    });
    expect(screen.getByTestId('titleBox')).toHaveTextContent(/title/i);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/received');
    const filterForm = result.getByTestId('dialogToggle');
    expect(filterForm).toBeInTheDocument();
    const notificationsCards = result.getAllByTestId('mobileNotificationsCards');
    expect(notificationsCards).toHaveLength(notificationsDTO.resultsPage.length);
    const itemsPerPageSelector = result.queryByTestId('itemsPerPageSelector');
    expect(itemsPerPageSelector).toBeInTheDocument();
    const pageSelector = result.queryByTestId('pageSelector');
    expect(pageSelector).toBeInTheDocument();
  });

  describe('new notifications dot', () => {
    const receivedRegExp = new RegExp('/bff/v1/notifications/received');
    const notificationsWithNew = notificationsDTO;
    const notificationsWithoutNew = {
      ...notificationsDTO,
      resultsPage: notificationsDTO.resultsPage.map((n) => ({ ...n, isNewNotification: false })),
    };
    const generalInfoState = (overrides: Record<string, unknown>) => ({
      pendingDelegators: 0,
      delegators: [],
      domicileBannerOpened: true,
      paymentTpp: {},
      hasNewNotifications: false,
      onboardingData: {
        hasBeenShown: false,
        hasSkippedOnboarding: false,
        exitReminderShown: false,
      },
      ...overrides,
    });

    it('sets hasNewNotifications to true when the first page has unread notifications', async () => {
      mock.onGet(receivedRegExp).reply(200, notificationsWithNew);
      await act(async () => {
        result = render(<Notifiche />);
      });
      expect(result.testStore.getState().generalInfoState.hasNewNotifications).toBe(true);
    });

    it('sets hasNewNotifications to false when the first page has no unread notifications', async () => {
      mock.onGet(receivedRegExp).reply(200, notificationsWithoutNew);
      await act(async () => {
        result = render(<Notifiche />, {
          preloadedState: { generalInfoState: generalInfoState({ hasNewNotifications: true }) },
        });
      });
      expect(result.testStore.getState().generalInfoState.hasNewNotifications).toBe(false);
    });

    it('does not update the dot on a delegated page', async () => {
      mock.onGet(receivedRegExp).reply(200, notificationsWithNew);
      await act(async () => {
        result = render(<Notifiche />, {
          route: `/notifiche/${mandatesByDelegate[1].mandateId}`,
          path: '/notifiche/:mandateId',
          preloadedState: {
            generalInfoState: generalInfoState({ delegators: mandatesByDelegate }),
          },
        });
      });
      expect(result.testStore.getState().generalInfoState.hasNewNotifications).toBe(false);
    });

    it('keeps the dot value when navigating to another page', async () => {
      mock.onGet(receivedRegExp).replyOnce(200, notificationsWithNew);
      mock.onGet(receivedRegExp).replyOnce(200, notificationsWithoutNew);
      await act(async () => {
        result = render(<Notifiche />);
      });
      expect(result.testStore.getState().generalInfoState.hasNewNotifications).toBe(true);

      const pageSelector = result.getByTestId('pageSelector');
      const pageButtons = pageSelector?.querySelectorAll('button');
      fireEvent.click(pageButtons[2]);
      await waitFor(() => {
        expect(mock.history.get).toHaveLength(2);
      });
      expect(result.testStore.getState().generalInfoState.hasNewNotifications).toBe(true);
    });

    it('recomputes the dot when the page size changes', async () => {
      mock.onGet(receivedRegExp).replyOnce(200, notificationsWithoutNew);
      mock.onGet(receivedRegExp).replyOnce(200, notificationsWithNew);
      await act(async () => {
        result = render(<Notifiche />);
      });
      expect(result.testStore.getState().generalInfoState.hasNewNotifications).toBe(false);

      const itemsPerPageSelector = result.getByTestId('itemsPerPageSelector');
      const itemsPerPageSelectorBtn = itemsPerPageSelector?.querySelector('button');
      fireEvent.click(itemsPerPageSelectorBtn!);
      const itemsPerPageList = screen.getAllByRole('menuitem');
      fireEvent.click(itemsPerPageList[1]);
      await waitFor(() => {
        expect(mock.history.get).toHaveLength(2);
      });
      expect(result.testStore.getState().generalInfoState.hasNewNotifications).toBe(true);
    });

    it('does not recompute the dot when a filter is active', async () => {
      mock.onGet(receivedRegExp).replyOnce(200, notificationsWithNew);
      mock.onGet(receivedRegExp).replyOnce(200, notificationsWithoutNew);
      await act(async () => {
        result = render(<Notifiche />);
      });
      expect(result.testStore.getState().generalInfoState.hasNewNotifications).toBe(true);
      // apply a filter
      const form = result.container.querySelector('form') as HTMLFormElement;
      await testInput(form, 'iunMatch', 'ABCD-EFGH-ILMN-123456-A-1');
      const submitButton = form.querySelector(`button[type="submit"]`);
      fireEvent.click(submitButton!);
      await waitFor(() => {
        expect(mock.history.get).toHaveLength(2);
      });
      expect(result.testStore.getState().generalInfoState.hasNewNotifications).toBe(true);
    });
  });
});
