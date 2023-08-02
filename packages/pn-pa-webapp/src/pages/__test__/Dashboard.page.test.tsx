import React from 'react';

import { act, fireEvent, RenderResult, screen, waitFor, within } from '@testing-library/react';
import {
  formatToTimezoneString,
  getNextDay,
  tenYearsAgo,
  today,
  Notification,
} from '@pagopa-pn/pn-commons';

import { mockApi, render } from '../../__test__/test-utils';
import { emptyNotificationsFromBe, notificationsFromBe, notificationsFromBe2rows, notificationsFromBePage2 } from '../../redux/dashboard/__test__/test-utils';
import Dashboard from '../Dashboard.page';
import { apiClient } from '../../api/apiClients';
import { NOTIFICATIONS_LIST } from '../../api/notifications/notifications.routes';
import MockAdapter from 'axios-mock-adapter';

const mockNavigateFn = jest.fn();

// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    useIsMobile: () => false,
  };
});

describe('Dashboard Page', () => {
  // eslint-disable-next-line functional/no-let
  let result: RenderResult | undefined;
  let mock: MockAdapter;

  const initialState = (notifications: Array<Notification>, pageSize?: number) => ({
    preloadedState: {
      dashboardState: {
        notifications,
        filters: {
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(today),
        },
        sort: {
          orderBy: '',
          order: 'asc',
        },
        pagination: {
          nextPagesKey: ['mocked-page-key-1', 'mocked-page-key-2', 'mocked-page-key-3'],
          size: pageSize ? pageSize : 10,
          page: 0,
          moreResult: true,
        },
      },
    },
  });

  afterEach(() => {
    result = undefined;
    mock.reset();
    mock.restore();
  });

  it('Dashboard without notifications, clicks on new notification inside DesktopNotifications component', async () => {
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATIONS_LIST({
        startDate: formatToTimezoneString(tenYearsAgo),
        endDate: formatToTimezoneString(getNextDay(today)),
        size: 10,
      }),
      200,
      undefined,
      emptyNotificationsFromBe
    );
    await act(async () => {
      result = render(<Dashboard />, initialState([]));
    });
    expect(result?.container).toHaveTextContent(/empty-state/);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    const newNotificationBtn = result?.queryByTestId('callToActionSecond');
    fireEvent.click(newNotificationBtn!);
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
    });
  });

  it('Dashboard without notifications, clicks on API KEYS page inside DesktopNotifications component', async () => {
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATIONS_LIST({
        startDate: formatToTimezoneString(tenYearsAgo),
        endDate: formatToTimezoneString(getNextDay(today)),
        size: 10,
      }),
      200,
      undefined,
      emptyNotificationsFromBe
    );
    await act(async () => {
      result = render(<Dashboard />, initialState([]));
    });
    expect(result?.container).toHaveTextContent(/empty-state/);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    const apiKeysBtn = result?.queryByTestId('callToActionFirst');
    fireEvent.click(apiKeysBtn!);
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
    });
  });

  it('renders dashboard page', async () => {
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATIONS_LIST({
        startDate: formatToTimezoneString(tenYearsAgo),
        endDate: formatToTimezoneString(getNextDay(today)),
        size: 10,
      }),
      200,
      undefined,
      notificationsFromBe
    );

    await act(async () => {
      result = render(<Dashboard />, initialState([]));
    });

    expect(screen.getByRole('heading')).toHaveTextContent(/title/i);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    const filterForm = await waitFor(() => result?.findByTestId('filter-form'));
    expect(filterForm).toBeInTheDocument();
    const notificationsTable = result?.container.querySelector('table');
    expect(notificationsTable).toBeInTheDocument();
    const itemsPerPageSelector = result?.queryByTestId('itemsPerPageSelector');
    expect(itemsPerPageSelector).toBeInTheDocument();
    const pageSelector = result?.queryByTestId('pageSelector');
    expect(pageSelector).toBeInTheDocument();
  });

  it('changes items per page', async () => {
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATIONS_LIST({
        startDate: formatToTimezoneString(tenYearsAgo),
        endDate: formatToTimezoneString(getNextDay(today)),
        size: 1,
      }),
      200,
      undefined,
      notificationsFromBe
    );
    mockApi(
      mock,
      'GET',
      NOTIFICATIONS_LIST({
        startDate: formatToTimezoneString(tenYearsAgo),
        endDate: formatToTimezoneString(getNextDay(today)),
        size: 50,
      }),
      200,
      undefined,
      notificationsFromBe2rows
    );
    await act(async () => {
      result = render(<Dashboard />, initialState([], 1));
    });
    const rows = result?.container.querySelectorAll('tr');
    expect(rows?.length).toBe(2);

    const itemsPerPageSelectorBtn = result?.container.querySelector(
      '[data-testid="itemsPerPageSelector"] > button'
    );
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    fireEvent.click(itemsPerPageSelectorBtn!);
    const itemsPerPageDropdown = await waitFor(() => screen.queryByRole('presentation'));
    expect(itemsPerPageDropdown).toBeInTheDocument();
    const itemsPerPageItem = within(itemsPerPageDropdown!).queryByText('50');

    await waitFor(() => fireEvent.click(itemsPerPageItem!));
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[1].url).toContain('/notifications/sent');
    const newRows = result?.container.querySelectorAll('tr');
    expect(newRows?.length).toBe(3);
  });

  it('changes page', async () => {
    mock = mockApi(
      apiClient,
      'GET',
      NOTIFICATIONS_LIST({
        startDate: formatToTimezoneString(tenYearsAgo),
        endDate: formatToTimezoneString(getNextDay(today)),
        size: 1,
      }),
      200,
      undefined,
      notificationsFromBe
    );
    mockApi(
      mock,
      'GET',
      NOTIFICATIONS_LIST({
        startDate: formatToTimezoneString(tenYearsAgo),
        endDate: formatToTimezoneString(getNextDay(today)),
        size: 1,
      }),
      200,
      undefined,
      notificationsFromBePage2
    );
    await act(async () => {
      result = render(<Dashboard />, initialState([], 1));
    });
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    const pageSelectorBtn = result?.container.querySelector(
      '[data-testid="pageSelector"] li:nth-child(3) > button'
    );
    fireEvent.click(pageSelectorBtn!);
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[1].url).toContain('/notifications/sent');
  });

  it('clicks on new notification', async () => {
    await act(async () => {
      result = render(<Dashboard />, initialState([]));
    });
    expect(result?.container).toHaveTextContent(/empty-state/);
    const newNotificationBtn = result?.queryByTestId('newNotificationBtn');
    expect(newNotificationBtn).toHaveTextContent('new-notification-button');
    fireEvent.click(newNotificationBtn!);
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
    });
  });
});
