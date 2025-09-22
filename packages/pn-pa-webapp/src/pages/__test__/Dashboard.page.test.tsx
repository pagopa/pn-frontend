import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import {
  AppResponseMessage,
  ResponseEventDispatcher,
  formatToTimezoneString,
  getStartOfDay,
  sixMonthsAgo,
  today,
} from '@pagopa-pn/pn-commons';
import { createMatchMedia, testInput } from '@pagopa-pn/pn-commons/src/test-utils';

import { errorMock } from '../../__mocks__/Errors.mock';
import { emptyNotificationsFromBe, notificationsDTO } from '../../__mocks__/Notifications.mock';
import { RenderResult, act, fireEvent, render, screen, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { DASHBOARD_ACTIONS } from '../../redux/dashboard/actions';
import Dashboard from '../Dashboard.page';

const mockNavigateFn = vi.fn();

// mock imports
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

describe('Dashboard Page', async () => {
  let result: RenderResult;
  let mock: MockAdapter;
  const original = window.matchMedia;

  const startParam = encodeURIComponent(formatToTimezoneString(getStartOfDay(sixMonthsAgo)));
  const endParam = encodeURIComponent(formatToTimezoneString(today));

  const notificationsPath = `/bff/v1/notifications/sent?startDate=${startParam}&endDate=${endParam}&size=10`;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    window.matchMedia = original;
  });

  it('Dashboard without notifications, clicks on new notification inside empty state', async () => {
    mock.onGet(notificationsPath).reply(200, emptyNotificationsFromBe);
    await act(async () => {
      result = render(<Dashboard />);
    });
    expect(result.container).toHaveTextContent(/empty-state/);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/sent');
    const newNotificationBtn = result.queryByTestId('link-create-notification');
    fireEvent.click(newNotificationBtn!);
    await waitFor(() => {
      expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    });
  });

  it('Dashboard without notifications, clicks on new notification button', async () => {
    mock.onGet(notificationsPath).reply(200, emptyNotificationsFromBe);
    await act(async () => {
      result = render(<Dashboard />);
    });
    expect(result.container).toHaveTextContent(/empty-state/);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/sent');
    const newNotificationBtn = result.queryByTestId('newNotificationBtn');
    expect(newNotificationBtn).toHaveTextContent('new-notification-button');
    fireEvent.click(newNotificationBtn!);
    await waitFor(() => {
      expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    });
  });

  it('Dashboard without notifications, clicks on API KEYS page inside empty state', async () => {
    mock.onGet(notificationsPath).reply(200, emptyNotificationsFromBe);
    await act(async () => {
      result = render(<Dashboard />);
    });
    expect(result.container).toHaveTextContent(/empty-state/);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/sent');
    const apiKeysBtn = result.queryByTestId('link-api-keys');
    fireEvent.click(apiKeysBtn!);
    await waitFor(() => {
      expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    });
  });

  it('renders page', async () => {
    mock.onGet(notificationsPath).reply(200, notificationsDTO);

    await act(async () => {
      result = render(<Dashboard />);
    });

    expect(screen.getByRole('heading')).toHaveTextContent(/title/i);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/sent');

    const filterForm = result.getByTestId('filter-form');
    expect(filterForm).toBeInTheDocument();

    const notificationsTable = result.container.querySelector('table');
    expect(notificationsTable).toBeInTheDocument();

    const itemsPerPageSelector = result.queryByTestId('itemsPerPageSelector');
    expect(itemsPerPageSelector).toBeInTheDocument();

    const pageSelector = result.queryByTestId('pageSelector');
    expect(pageSelector).toBeInTheDocument();
  });

  it('change pagination', async () => {
    mock
      .onGet(notificationsPath)
      .reply(200, { ...notificationsDTO, resultsPage: [notificationsDTO.resultsPage[0]] });

    const notificationsPathWithSize = `/bff/v1/notifications/sent?startDate=${startParam}&endDate=${endParam}&size=20`;

    mock.onGet(notificationsPathWithSize).reply(200, notificationsDTO);
    await act(async () => {
      result = render(<Dashboard />);
    });
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/sent');
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
      expect(mock.history.get[1].url).toContain('/bff/v1/notifications/sent');
    });
    rows = result.getAllByTestId('notificationsTable.body.row');
    expect(rows).toHaveLength(4);
  });

  it('changes page', async () => {
    mock
      .onGet(notificationsPath)
      .reply(200, { ...notificationsDTO, resultsPage: [notificationsDTO.resultsPage[0]] });

    const notificationsPathSecondPage = `/bff/v1/notifications/sent?startDate=${startParam}&endDate=${endParam}&size=10&nextPagesKey=${notificationsDTO.nextPagesKey[0]}`;

    mock
      .onGet(notificationsPathSecondPage)
      .reply(200, { ...notificationsDTO, resultsPage: [notificationsDTO.resultsPage[1]] });
    await act(async () => {
      result = render(<Dashboard />);
    });
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/sent');
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
      expect(mock.history.get[1].url).toContain('/bff/v1/notifications/sent');
    });
    rows = result.getAllByTestId('notificationsTable.body.row');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent(notificationsDTO.resultsPage[1].iun);
  });

  it('filter', async () => {
    mock.onGet(notificationsPath).reply(200, notificationsDTO);

    const notificationsPathFiltered = `/bff/v1/notifications/sent?startDate=${startParam}&endDate=${endParam}&recipientId=${notificationsDTO.resultsPage[0].recipients[0]}&size=10`;

    mock
      .onGet(notificationsPathFiltered)
      .reply(200, { ...notificationsDTO, resultsPage: [notificationsDTO.resultsPage[1]] });
    await act(async () => {
      result = render(<Dashboard />);
    });
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/sent');
    let rows = result.getAllByTestId('notificationsTable.body.row');
    expect(rows).toHaveLength(4);
    rows?.forEach((row, index) => {
      expect(row).toHaveTextContent(notificationsDTO.resultsPage[index].iun);
    });
    // filter
    const form = result.container.querySelector('form') as HTMLFormElement;
    await testInput(form, 'recipientId', notificationsDTO.resultsPage[1].recipients[0]);
    const submitButton = form.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton!);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].url).toContain('/bff/v1/notifications/sent');
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
    mock.onGet(notificationsPath).reply(200, notificationsDTO);

    await act(async () => {
      result = render(<Dashboard />);
    });
    expect(screen.getByRole('heading')).toHaveTextContent(/title/i);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/sent');
    const filterForm = result.getByTestId('dialogToggle');
    expect(filterForm).toBeInTheDocument();
    const notificationsCards = result.getAllByTestId('mobileCards');
    expect(notificationsCards).toHaveLength(notificationsDTO.resultsPage.length);
    const itemsPerPageSelector = result.queryByTestId('itemsPerPageSelector');
    expect(itemsPerPageSelector).toBeInTheDocument();
    const pageSelector = result.queryByTestId('pageSelector');
    expect(pageSelector).toBeInTheDocument();
  });
});
