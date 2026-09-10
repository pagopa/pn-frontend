import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import {
  AppResponseMessage,
  ResponseEventDispatcher,
  formatDate,
  formatToTimezoneString,
  getEndOfDay,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';
import { createMatchMedia, testInput } from '@pagopa-pn/pn-commons/src/test-utils';

import { userResponse } from '../../__mocks__/Auth.mock';
import { errorMock } from '../../__mocks__/Errors.mock';
import { emptyNotificationsFromBe, notificationsDTO } from '../../__mocks__/Notifications.mock';
import {
  RenderResult,
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { DASHBOARD_ACTIONS } from '../../redux/dashboard/actions';
import Notifiche from '../Notifiche.page';

describe('Notifiche Page ', () => {
  let result: RenderResult;
  let mock: MockAdapter;
  const originalMatchMedia = globalThis.matchMedia;
  const originalResizeObserver = globalThis.ResizeObserver;

  const notificationsPath = `/bff/v1/notifications/received?startDate=${encodeURIComponent(
    formatToTimezoneString(tenYearsAgo)
  )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=10&communicationType=ALL`;
  const notificationsDelegatedPath = `/bff/v1/notifications/received/delegated?startDate=${encodeURIComponent(
    formatToTimezoneString(tenYearsAgo)
  )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=10`;

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
    globalThis.ResizeObserver = originalResizeObserver;
  });

  it('renders page', async () => {
    mock.onGet(notificationsPath).reply(200, notificationsDTO);

    await act(async () => {
      result = render(<Notifiche />, { preloadedState: { userState: { user: userResponse } } });
    });
    expect(screen.getByTestId('titleBox')).toHaveTextContent(/title/i);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/received');
    const filterForm = result.getByTestId('filter-form');
    expect(filterForm).toBeInTheDocument();
    expect(filterForm.querySelector('input[name="communicationType"]')).toBeInTheDocument();
    const notificationsTable = result.container.querySelector('table');
    expect(notificationsTable).toBeInTheDocument();
    const itemsPerPageSelector = result.queryByTestId('itemsPerPageSelector');
    expect(itemsPerPageSelector).toBeInTheDocument();
    const pageSelector = result.queryByTestId('pageSelector');
    expect(pageSelector).toBeInTheDocument();
    const addDomicileBanner = result.getByTestId('addDomicileBanner');
    expect(addDomicileBanner).toBeInTheDocument();
    const groupSelector = result.queryByTestId('groupSelector');
    expect(groupSelector).not.toBeInTheDocument();
  });

  it('does not render filters on desktop when there are no notifications and no filters applied', async () => {
    mock.onGet(notificationsPath).reply(200, emptyNotificationsFromBe);

    await act(async () => {
      result = render(<Notifiche />);
    });

    expect(mock.history.get).toHaveLength(1);
    expect(result.queryByTestId('filter-form')).not.toBeInTheDocument();
    expect(result.queryByTestId('notificationsTable')).not.toBeInTheDocument();
  });

  it('render page without notifications after filtering and remove filters', async () => {
    mock.onGet(notificationsPath).reply(200, notificationsDTO);
    mock
      .onGet(
        `/bff/v1/notifications/received?startDate=${encodeURIComponent(
          formatToTimezoneString(tenYearsAgo)
        )}&endDate=${encodeURIComponent(
          formatToTimezoneString(getEndOfDay(tenYearsAgo))
        )}&size=10&communicationType=ALL`
      )
      .reply(200, emptyNotificationsFromBe);
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
    expect(result.getByTestId('filter-form')).toBeInTheDocument();
    // remove filters
    const routeContactsBtn = result.getByTestId('link-remove-filters');
    fireEvent.click(routeContactsBtn);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[2].url).toContain('/bff/v1/notifications/received');
    });
    expect(result.container).not.toHaveTextContent(/empty-state.filtered/);
  });

  it('change pagination', async () => {
    mock
      .onGet(notificationsPath)
      .reply(200, { ...notificationsDTO, resultsPage: [notificationsDTO.resultsPage[0]] });
    const notificationsPathWithSize = `/bff/v1/notifications/received?startDate=${encodeURIComponent(
      formatToTimezoneString(tenYearsAgo)
    )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=20&communicationType=ALL`;
    mock.onGet(notificationsPathWithSize).reply(200, notificationsDTO);
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
    const notificationsPathPageTwo = `/bff/v1/notifications/received?startDate=${encodeURIComponent(
      formatToTimezoneString(tenYearsAgo)
    )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=10&nextPagesKey=${
      notificationsDTO.nextPagesKey[0]
    }&communicationType=ALL`;
    mock
      .onGet(notificationsPathPageTwo)
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
    const notificationsPathFiltered = `/bff/v1/notifications/received?startDate=${encodeURIComponent(
      formatToTimezoneString(tenYearsAgo)
    )}&endDate=${encodeURIComponent(
      formatToTimezoneString(today)
    )}&iunMatch=ABCD-EFGH-ILMN-123456-A-1&size=10&communicationType=ALL`;
    mock
      .onGet(notificationsPathFiltered)
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

  it('renders page - delegated', async () => {
    mock.onGet(notificationsDelegatedPath).reply(200, notificationsDTO);

    await act(async () => {
      result = render(<Notifiche isDelegatedPage />, {
        preloadedState: {
          userState: {
            user: userResponse,
          },
        },
      });
    });
    expect(screen.getByRole('heading')).toHaveTextContent(/title-delegated-notifications/i);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/bff/v1/notifications/received/delegated');
    const filterForm = result.getByTestId('filter-form');
    expect(filterForm).toBeInTheDocument();
    expect(filterForm.querySelector('input[name="communicationType"]')).not.toBeInTheDocument();
    const notificationsTable = result.container.querySelector('table');
    expect(notificationsTable).toBeInTheDocument();
    const itemsPerPageSelector = result.queryByTestId('itemsPerPageSelector');
    expect(itemsPerPageSelector).toBeInTheDocument();
    const pageSelector = result.queryByTestId('pageSelector');
    expect(pageSelector).toBeInTheDocument();
    const addDomicileBanner = result.queryByTestId('addDomicileBanner');
    expect(addDomicileBanner).not.toBeInTheDocument();
    const groupSelector = result.queryByTestId('groupSelector');
    expect(groupSelector).not.toBeInTheDocument();
  });

  it('renders page - delegated with groups', async () => {
    const notificationGroup1 = notificationsDTO.resultsPage.filter((n) => n.group === 'group-1');
    const notificationGroup3 = notificationsDTO.resultsPage.filter((n) => n.group === 'group-3');
    const notificationsDelegatedPathGroupOne = `/bff/v1/notifications/received/delegated?startDate=${encodeURIComponent(
      formatToTimezoneString(tenYearsAgo)
    )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&group=group-1&size=10`;
    mock.onGet(notificationsDelegatedPathGroupOne).reply(200, {
      ...notificationsDTO,
      resultsPage: notificationGroup1,
    });
    const notificationsDelegatedPathGroupThree = `/bff/v1/notifications/received/delegated?startDate=${encodeURIComponent(
      formatToTimezoneString(tenYearsAgo)
    )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&group=group-3&size=10`;
    mock.onGet(notificationsDelegatedPathGroupThree).reply(200, {
      ...notificationsDTO,
      resultsPage: notificationGroup3,
    });
    mock.onGet('/bff/v1/pg/groups').reply(200, [
      { id: 'group-1', name: 'Group 1' },
      { id: 'group-2', name: 'Group 2' },
      { id: 'group-3', name: 'Group 3' },
    ]);
    await act(async () => {
      result = render(<Notifiche isDelegatedPage />, {
        preloadedState: {
          userState: {
            user: {
              ...userResponse,
              organization: {
                ...userResponse.organization,
                groups: ['group-1', 'group-2', 'group-3'],
              },
            },
          },
        },
      });
    });
    expect(mock.history.get).toHaveLength(2);
    expect(mock.history.get[0].url).toContain('/bff/v1/pg/groups');
    expect(mock.history.get[1].url).toContain('/bff/v1/notifications/received/delegated');
    const groupSelector = result.getByTestId('groupSelector');
    expect(groupSelector).toBeInTheDocument();
    let notificationsTableRows = result.getAllByTestId('notificationsTable.body.row');
    expect(notificationsTableRows).toHaveLength(notificationGroup1.length);
    // change group
    const menuButton = result.getByTestId('groupSelectorButton');
    expect(menuButton).toHaveTextContent('Group 1');
    fireEvent.click(menuButton);
    const dropdown = await waitFor(() => screen.getByRole('presentation'));
    expect(dropdown).toBeInTheDocument();
    const menuItems = within(dropdown).getAllByRole('menuitem');
    expect(menuItems).toHaveLength(3);
    expect(menuItems[0]).toHaveTextContent('Group 1');
    expect(menuItems[1]).toHaveTextContent('Group 2');
    expect(menuItems[2]).toHaveTextContent('Group 3');
    fireEvent.click(menuItems[2]);
    await waitFor(() => {
      expect(menuButton).toHaveTextContent('Group 3');
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[2].url).toContain('/bff/v1/notifications/received/delegated');
    });
    notificationsTableRows = result.getAllByTestId('notificationsTable.body.row');
    expect(notificationsTableRows).toHaveLength(notificationGroup3.length);
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

  it('does not render filters on mobile when there are no notifications and no filters applied', async () => {
    globalThis.matchMedia = createMatchMedia(800);
    mock.onGet(notificationsPath).reply(200, emptyNotificationsFromBe);

    await act(async () => {
      result = render(<Notifiche />);
    });

    expect(mock.history.get).toHaveLength(1);
    expect(result.queryByTestId('dialogToggle')).not.toBeInTheDocument();
    expect(result.queryAllByTestId('mobileNotificationsCards')).toHaveLength(0);
  });

  it('keeps draft filters when switching between desktop and mobile', async () => {
    mock.onGet(notificationsPath).reply(200, notificationsDTO);

    await act(async () => {
      result = render(<Notifiche />);
    });

    const desktopForm = result.getByTestId('filter-form');
    await testInput(desktopForm, 'iunMatch', 'ABCD-EFGH-ILMN-123456-A-1');

    globalThis.matchMedia = createMatchMedia(800);

    result.rerender(<Notifiche />);

    const toggleButton = result.getByTestId('dialogToggleButton');
    fireEvent.click(toggleButton);

    const mobileForm = await screen.findByTestId<HTMLFormElement>('filter-form');
    expect(mobileForm.querySelector('input[name="iunMatch"]')).toHaveValue(
      'ABCD-EFGH-ILMN-123456-A-1'
    );
  });

  describe('new notifications dot', () => {
    const receivedRegExp = new RegExp('/bff/v1/notifications/received');
    const notificationsWithNew = notificationsDTO;
    const notificationsWithoutNew = {
      ...notificationsDTO,
      resultsPage: notificationsDTO.resultsPage.map((n) => ({ ...n, isNewNotification: false })),
    };

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
          preloadedState: {
            generalInfoState: {
              pendingDelegators: 0,
              domicileBannerOpened: true,
              hasNewNotifications: true,
            },
          },
        });
      });
      expect(result.testStore.getState().generalInfoState.hasNewNotifications).toBe(false);
    });

    it('does not update the dot on the delegated page', async () => {
      mock.onGet(receivedRegExp).reply(200, notificationsWithNew);
      await act(async () => {
        result = render(<Notifiche isDelegatedPage />, {
          preloadedState: { userState: { user: userResponse } },
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
      // change page
      const pageSelector = result.getByTestId('pageSelector');
      const pageButtons = pageSelector?.querySelectorAll('button');
      // the buttons are < 1 2 >
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
      // change size
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
