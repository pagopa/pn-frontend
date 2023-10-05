import MockAdapter from 'axios-mock-adapter';
import React, { ReactNode } from 'react';

import {
  AppResponseMessage,
  ResponseEventDispatcher,
  formatDate,
  formatToTimezoneString,
  getNextDay,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';
import { createMatchMedia, testInput } from '@pagopa-pn/pn-commons/src/test-utils';

import { userResponse } from '../../__mocks__/Auth.mock';
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
import { GET_GROUPS } from '../../api/external-registries/external-registries-routes';
import { NOTIFICATIONS_LIST } from '../../api/notifications/notifications.routes';
import { DASHBOARD_ACTIONS } from '../../redux/dashboard/actions';
import Notifiche from '../Notifiche.page';

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
  Trans: (props: { i18nKey: string; components?: Array<ReactNode> }) => (
    <>
      {props.i18nKey} {props.components && props.components!.map((c) => c)}
    </>
  ),
}));

describe('Notifiche Page ', () => {
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
      result = render(<Notifiche />, { preloadedState: { userState: { user: userResponse } } });
    });
    expect(screen.getByRole('heading')).toHaveTextContent(/title/i);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/notifications/received');
    const filterForm = result?.getByTestId('filter-form');
    expect(filterForm).toBeInTheDocument();
    const notificationsTable = result?.container.querySelector('table');
    expect(notificationsTable).toBeInTheDocument();
    const itemsPerPageSelector = result?.queryByTestId('itemsPerPageSelector');
    expect(itemsPerPageSelector).toBeInTheDocument();
    const pageSelector = result?.queryByTestId('pageSelector');
    expect(pageSelector).toBeInTheDocument();
    const addDomicileBanner = result?.getByTestId('addDomicileBanner');
    expect(addDomicileBanner).toBeInTheDocument();
    const groupSelector = result?.queryByTestId('groupSelector');
    expect(groupSelector).not.toBeInTheDocument();
  });

  it('render page without notifications after filtering and remove filters', async () => {
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
          endDate: formatToTimezoneString(getNextDay(tenYearsAgo)),
          size: 10,
        })
      )
      .reply(200, emptyNotificationsFromBe);
    await act(async () => {
      result = render(<Notifiche />);
    });
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/notifications/received');
    // filter
    const form = result?.container.querySelector('form') as HTMLFormElement;
    await testInput(form, 'startDate', formatDate(tenYearsAgo.toISOString()));
    await testInput(form, 'endDate', formatDate(tenYearsAgo.toISOString()));
    const submitButton = form!.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton!);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].url).toContain('/notifications/received');
    });
    expect(result?.container).toHaveTextContent(/empty-state.filtered/);
    // remove filters
    const routeContactsBtn = result?.getByTestId('link-remove-filters');
    fireEvent.click(routeContactsBtn!);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
      expect(mock.history.get[1].url).toContain('/notifications/received');
    });
    expect(result?.container).not.toHaveTextContent(/empty-state.filtered/);
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
      result = render(<Notifiche />);
    });
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/notifications/received');
    let rows = result?.getAllByTestId('notificationsTable.row');
    expect(rows).toHaveLength(1);
    // change size
    const itemsPerPageSelector = result?.getByTestId('itemsPerPageSelector');
    const itemsPerPageSelectorBtn = itemsPerPageSelector?.querySelector('button');
    fireEvent.click(itemsPerPageSelectorBtn!);
    const itemsPerPageList = screen.getAllByRole('menuitem');
    fireEvent.click(itemsPerPageList[1]!);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].url).toContain('/notifications/received');
      rows = result?.getAllByTestId('notificationsTable.row');
      expect(rows).toHaveLength(3);
    });
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
      result = render(<Notifiche />);
    });
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/notifications/received');
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
      expect(mock.history.get[1].url).toContain('/notifications/received');
      rows = result?.getAllByTestId('notificationsTable.row');
      expect(rows).toHaveLength(1);
      expect(rows![0]).toHaveTextContent(notificationsDTO.resultsPage[1].iun);
    });
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
          iunMatch: 'ABCD-EFGH-ILMN-123456-A-1',
        })
      )
      .reply(200, { ...notificationsDTO, resultsPage: [notificationsDTO.resultsPage[1]] });
    await act(async () => {
      result = render(<Notifiche />);
    });
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/notifications/received');
    let rows = result?.getAllByTestId('notificationsTable.row');
    expect(rows).toHaveLength(3);
    rows?.forEach((row, index) => {
      expect(row).toHaveTextContent(notificationsDTO.resultsPage[index].iun);
    });
    // filter
    const form = result?.container.querySelector('form') as HTMLFormElement;
    await testInput(form, 'iunMatch', 'ABCD-EFGH-ILMN-123456-A-1');
    const submitButton = form!.querySelector(`button[type="submit"]`);
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton!);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.get[1].url).toContain('/notifications/received');
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
    mock
      .onGet(
        NOTIFICATIONS_LIST(
          {
            startDate: formatToTimezoneString(tenYearsAgo),
            endDate: formatToTimezoneString(getNextDay(today)),
            size: 10,
          },
          true
        )
      )
      .reply(200, notificationsDTO);

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
    expect(mock.history.get[0].url).toContain('/notifications/received/delegated');
    const filterForm = result?.getByTestId('filter-form');
    expect(filterForm).toBeInTheDocument();
    const notificationsTable = result?.container.querySelector('table');
    expect(notificationsTable).toBeInTheDocument();
    const itemsPerPageSelector = result?.queryByTestId('itemsPerPageSelector');
    expect(itemsPerPageSelector).toBeInTheDocument();
    const pageSelector = result?.queryByTestId('pageSelector');
    expect(pageSelector).toBeInTheDocument();
    const addDomicileBanner = result?.queryByTestId('addDomicileBanner');
    expect(addDomicileBanner).not.toBeInTheDocument();
    const groupSelector = result?.queryByTestId('groupSelector');
    expect(groupSelector).not.toBeInTheDocument();
  });

  it('renders page - delegated with groups', async () => {
    const notificationGroup1 = notificationsDTO.resultsPage.filter((n) => n.group === 'group-1');
    const notificationGroup3 = notificationsDTO.resultsPage.filter((n) => n.group === 'group-3');
    mock
      .onGet(
        NOTIFICATIONS_LIST(
          {
            startDate: formatToTimezoneString(tenYearsAgo),
            endDate: formatToTimezoneString(getNextDay(today)),
            size: 10,
            group: 'group-1',
          },
          true
        )
      )
      .reply(200, {
        ...notificationsDTO,
        resultsPage: notificationGroup1,
      });
    mock
      .onGet(
        NOTIFICATIONS_LIST(
          {
            startDate: formatToTimezoneString(tenYearsAgo),
            endDate: formatToTimezoneString(getNextDay(today)),
            size: 10,
            group: 'group-3',
          },
          true
        )
      )
      .reply(200, {
        ...notificationsDTO,
        resultsPage: notificationGroup3,
      });
    mock.onGet(GET_GROUPS()).reply(200, [
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
    expect(mock.history.get[0].url).toContain(GET_GROUPS());
    expect(mock.history.get[1].url).toContain('/notifications/received/delegated');
    const groupSelector = result?.getByTestId('groupSelector');
    expect(groupSelector).toBeInTheDocument();
    let notificationsTableRows = result?.getAllByTestId('notificationsTable.row');
    expect(notificationsTableRows).toHaveLength(notificationGroup1.length);
    // change group
    const menuButton = result?.getByTestId('groupSelectorButton');
    expect(menuButton).toHaveTextContent('Group 1');
    fireEvent.click(menuButton!);
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
      expect(mock.history.get[2].url).toContain('/notifications/received/delegated');
    });
    notificationsTableRows = result?.getAllByTestId('notificationsTable.row');
    expect(notificationsTableRows).toHaveLength(notificationGroup3.length);
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
      result = render(<Notifiche />);
    });
    expect(screen.getByRole('heading')).toHaveTextContent(/title/i);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toContain('/notifications/received');
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
