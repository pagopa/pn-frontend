import MockAdapter from 'axios-mock-adapter';
import { ReactNode } from 'react';
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

import { errorMock } from '../../__mocks__/Errors.mock';
import { emptyNotificationsFromBe, notificationsDTO } from '../../__mocks__/Notifications.mock';
import { RenderResult, act, fireEvent, render, screen, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { DASHBOARD_ACTIONS } from '../../redux/dashboard/actions';
import Notifiche from '../Notifiche.page';

const mockNavigateFn = vi.fn();

// mock imports
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
  Trans: (props: { i18nKey: string; components?: Array<ReactNode> }) => (
    <>
      {props.i18nKey} {props.components?.map((c) => c)}
    </>
  ),
}));

describe('Notifiche Page', async () => {
  let result: RenderResult;
  let mock: MockAdapter;
  const original = window.matchMedia;
  const notificationsPath = `/bff/v1/notifications/received?startDate=${encodeURIComponent(
    formatToTimezoneString(tenYearsAgo)
  )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=10`;

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
    mock.onGet(notificationsPath).reply(200, notificationsDTO);

    await act(async () => {
      result = render(<Notifiche />);
    });
    expect(screen.getByRole('heading')).toHaveTextContent(/title/i);
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
    )}&endDate=${encodeURIComponent(formatToTimezoneString(getEndOfDay(tenYearsAgo)))}&size=10`;
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
    )}&endDate=${encodeURIComponent(formatToTimezoneString(today))}&size=20`;
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
    const notificationPathSecondPage =
      notificationsPath + '&nextPagesKey=' + notificationsDTO.nextPagesKey[0];
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
    )}&iunMatch=ABCD-EFGH-ILMN-123456-A-1&size=10`;
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
    window.matchMedia = createMatchMedia(800);
    mock.onGet(notificationsPath).reply(200, notificationsDTO);

    await act(async () => {
      result = render(<Notifiche />);
    });
    expect(screen.getByRole('heading')).toHaveTextContent(/title/i);
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
});
