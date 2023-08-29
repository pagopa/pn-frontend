import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import {
  AppResponseMessage,
  ResponseEventDispatcher,
  createMatchMedia,
  formatToTimezoneString,
  getNextDay,
  getNotificationAllowedStatus,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';

import { emptyNotificationsFromBe, notificationsDTO } from '../../__mocks__/Notifications.mock';
import {
  RenderResult,
  act,
  fireEvent,
  render,
  screen,
  testInput,
  waitFor,
} from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { NOTIFICATIONS_LIST } from '../../api/notifications/notifications.routes';
import { DASHBOARD_ACTIONS } from '../../redux/dashboard/actions';
import Dashboard from '../Dashboard.page';

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

describe('Dashboard Page', () => {
  let result: RenderResult | undefined;
  let mock: MockAdapter;
  const original = window.matchMedia;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
    window.matchMedia = original;
  });

  it('Dashboard without notifications, clicks on new notification inside empty state', async () => {
    mock
      .onGet(
        NOTIFICATIONS_LIST({
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(getNextDay(today)),
          size: 10,
        })
      )
      .reply(200, emptyNotificationsFromBe);
    await act(async () => {
      result = render(<Dashboard />);
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

  it('Dashboard without notifications, clicks on new notification button', async () => {
    mock
      .onGet(
        NOTIFICATIONS_LIST({
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(getNextDay(today)),
          size: 10,
        })
      )
      .reply(200, emptyNotificationsFromBe);
    await act(async () => {
      result = render(<Dashboard />);
    });
    expect(result?.container).toHaveTextContent(/empty-state/);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    const newNotificationBtn = result?.queryByTestId('newNotificationBtn');
    expect(newNotificationBtn).toHaveTextContent('new-notification-button');
    fireEvent.click(newNotificationBtn!);
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
    });
  });

  it('Dashboard without notifications, clicks on API KEYS page inside empty state', async () => {
    mock
      .onGet(
        NOTIFICATIONS_LIST({
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(getNextDay(today)),
          size: 10,
        })
      )
      .reply(200, emptyNotificationsFromBe);
    await act(async () => {
      result = render(<Dashboard />);
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

  it('renders page', async () => {
    mock
      .onGet(
        NOTIFICATIONS_LIST({
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(getNextDay(today)),
          size: 10,
        })
      )
      .reply(200, notificationsDTO);

    await act(async () => {
      result = render(<Dashboard />);
    });
    expect(screen.getByRole('heading')).toHaveTextContent(/title/i);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    const filterForm = result?.getByTestId('filter-form');
    expect(filterForm).toBeInTheDocument();
    const notificationsTable = result?.container.querySelector('table');
    expect(notificationsTable).toBeInTheDocument();
    const itemsPerPageSelector = result?.queryByTestId('itemsPerPageSelector');
    expect(itemsPerPageSelector).toBeInTheDocument();
    const pageSelector = result?.queryByTestId('pageSelector');
    expect(pageSelector).toBeInTheDocument();
  });

  it('change pagination', async () => {
    mock
      .onGet(
        NOTIFICATIONS_LIST({
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(getNextDay(today)),
          size: 10,
        })
      )
      .reply(200, { ...notificationsDTO, resultsPage: [notificationsDTO.resultsPage[0]] });
    mock
      .onGet(
        NOTIFICATIONS_LIST({
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(getNextDay(today)),
          size: 20,
        })
      )
      .reply(200, notificationsDTO);
    await act(async () => {
      result = render(<Dashboard />);
    });
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    let rows = result?.getAllByTestId('notificationsTable.row');
    expect(rows).toHaveLength(1);
    // change size
    const itemsPerPageSelector = result?.getByTestId('itemsPerPageSelector');
    const itemsPerPageSelectorBtn = itemsPerPageSelector?.querySelector('button');
    fireEvent.click(itemsPerPageSelectorBtn!);
    const itemsPerPageList = await screen.findAllByRole('menuitem');
    fireEvent.click(itemsPerPageList[1]!);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].url).toContain('/notifications/sent');
    });
    rows = result?.getAllByTestId('notificationsTable.row');
    expect(rows).toHaveLength(2);
  });

  it('changes page', async () => {
    mock
      .onGet(
        NOTIFICATIONS_LIST({
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(getNextDay(today)),
          size: 10,
        })
      )
      .reply(200, { ...notificationsDTO, resultsPage: [notificationsDTO.resultsPage[0]] });
    mock
      .onGet(
        NOTIFICATIONS_LIST({
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(getNextDay(today)),
          size: 10,
          nextPagesKey: notificationsDTO.nextPagesKey[0],
        })
      )
      .reply(200, { ...notificationsDTO, resultsPage: [notificationsDTO.resultsPage[1]] });
    await act(async () => {
      result = render(<Dashboard />);
    });
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    let rows = result?.getAllByTestId('notificationsTable.row');
    expect(rows).toHaveLength(1);
    expect(rows![0]).toHaveTextContent(notificationsDTO.resultsPage[0].iun);
    // change page
    const pageSelector = result!.getByTestId('pageSelector');
    const pageButtons = pageSelector?.querySelectorAll('button');
    // the buttons are < 1 2 >
    fireEvent.click(pageButtons[2]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].url).toContain('/notifications/sent');
    });
    rows = result?.getAllByTestId('notificationsTable.row');
    expect(rows).toHaveLength(1);
    expect(rows![0]).toHaveTextContent(notificationsDTO.resultsPage[1].iun);
  });

  it('filter', async () => {
    mock
      .onGet(
        NOTIFICATIONS_LIST({
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(getNextDay(today)),
          size: 10,
        })
      )
      .reply(200, notificationsDTO);
    mock
      .onGet(
        NOTIFICATIONS_LIST({
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(getNextDay(today)),
          size: 10,
          recipientId: notificationsDTO.resultsPage[1].recipients[0],
        })
      )
      .reply(200, { ...notificationsDTO, resultsPage: [notificationsDTO.resultsPage[1]] });
    await act(async () => {
      result = render(<Dashboard />);
    });
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    let rows = result?.getAllByTestId('notificationsTable.row');
    expect(rows).toHaveLength(2);
    rows?.forEach((row, index) => {
      expect(row).toHaveTextContent(notificationsDTO.resultsPage[index].iun);
    });
    // filter
    const form = result?.container.querySelector('form') as HTMLFormElement;
    await testInput(form, 'recipientId', notificationsDTO.resultsPage[1].recipients[0]);
    const submitButton = form!.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton!);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].url).toContain('/notifications/sent');
    });
    rows = result?.getAllByTestId('notificationsTable.row');
    expect(rows).toHaveLength(1);
    expect(rows![0]).toHaveTextContent(notificationsDTO.resultsPage[1].iun);
  });

  it('errors on api', async () => {
    mock
      .onGet(
        NOTIFICATIONS_LIST({
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(getNextDay(today)),
          size: 10,
        })
      )
      .reply(500);
    await act(async () => {
      result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <Dashboard />
        </>
      );
    });
    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${DASHBOARD_ACTIONS.GET_SENT_NOTIFICATIONS}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
  });

  it('renders page - mobile', async () => {
    window.matchMedia = createMatchMedia(800);
    mock
      .onGet(
        NOTIFICATIONS_LIST({
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(getNextDay(today)),
          size: 10,
        })
      )
      .reply(200, notificationsDTO);

    await act(async () => {
      result = render(<Dashboard />);
    });
    expect(screen.getByRole('heading')).toHaveTextContent(/title/i);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/notifications/sent');
    const filterForm = result?.getByTestId('dialogToggle');
    expect(filterForm).toBeInTheDocument();
    const notificationsCards = result?.getAllByTestId('itemCard');
    expect(notificationsCards).toHaveLength(notificationsDTO.resultsPage.length);
    const itemsPerPageSelector = result?.queryByTestId('itemsPerPageSelector');
    expect(itemsPerPageSelector).toBeInTheDocument();
    const pageSelector = result?.queryByTestId('pageSelector');
    expect(pageSelector).toBeInTheDocument();
  });
});
