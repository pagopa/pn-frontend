import { vi } from 'vitest';

import { notificationsToFe } from '../../../__mocks__/Notifications.mock';
import {
  RenderResult,
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import {
  GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH,
  GET_DETTAGLIO_NOTIFICA_PATH,
} from '../../../navigation/routes.const';
import DesktopNotifications from '../DesktopNotifications';

describe('DesktopNotifications Component', () => {
  let result: RenderResult;
  const onCleanFilters = vi.fn();

  const original = globalThis.ResizeObserver;

  beforeAll(() => {
    globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    globalThis.ResizeObserver = original;
  });

  it('renders component - no notification', async () => {
    // render component
    await act(async () => {
      result = render(
        <DesktopNotifications
          notifications={[]}
          filtersApplied={false}
          onCleanFilters={onCleanFilters}
        />
      );
    });
    const notificationTable = result!.queryByTestId('notificationsTable');
    expect(notificationTable).not.toBeInTheDocument();
    expect(result.container).toHaveTextContent(/empty-state.title/i);
    expect(result.container).toHaveTextContent(/empty-state.description/i);
  });

  it('renders component - no notification - delegate access', async () => {
    // render component
    await act(async () => {
      result = render(
        <DesktopNotifications
          notifications={[]}
          filtersApplied={false}
          onCleanFilters={onCleanFilters}
          isDelegatedPage
        />
      );
    });
    const notificationTable = result!.queryByTestId('notificationsTable');
    expect(notificationTable).not.toBeInTheDocument();
    expect(result.container).toHaveTextContent(/empty-state.delegate/i);
  });

  it('renders component - notification', async () => {
    // render component
    await act(async () => {
      result = render(
        <DesktopNotifications
          notifications={notificationsToFe.resultsPage}
          filtersApplied={false}
          onCleanFilters={onCleanFilters}
        />
      );
    });
    const notificationTable = result!.queryByTestId('notificationsTable');
    expect(notificationTable).not.toHaveTextContent('table.destinatario');
    const notificationTableRows = result!.getAllByTestId('notificationsTable.body.row');
    expect(notificationTableRows).toHaveLength(notificationsToFe.resultsPage.length);
  });

  it('renders component - notification - delegate access', async () => {
    // render component
    await act(async () => {
      result = render(
        <DesktopNotifications
          notifications={notificationsToFe.resultsPage}
          filtersApplied={false}
          onCleanFilters={onCleanFilters}
          isDelegatedPage
        />
      );
    });
    const notificationTable = result!.queryByTestId('notificationsTable');
    expect(notificationTable).toHaveTextContent('table.destinatario');
    const notificationTableRows = result!.getAllByTestId('notificationsTable.body.row');
    expect(notificationTableRows).toHaveLength(notificationsToFe.resultsPage.length);
  });

  it('renders component - no notification after filter', async () => {
    // render component
    await act(async () => {
      result = render(
        <DesktopNotifications notifications={[]} filtersApplied onCleanFilters={onCleanFilters} />
      );
    });

    const notificationTable = result.queryByTestId('notificationsTable');
    expect(notificationTable).not.toBeInTheDocument();
    expect(result.container).toHaveTextContent(/empty-state.filtered/i);

    const button = result.getByTestId('link-remove-filters');
    fireEvent.click(button);

    expect(onCleanFilters).toHaveBeenCalledTimes(1);
  });

  it('go to notification detail', async () => {
    await act(async () => {
      result = render(
        <DesktopNotifications
          notifications={notificationsToFe.resultsPage}
          filtersApplied={false}
          onCleanFilters={onCleanFilters}
        />
      );
    });
    const rows = result!.getAllByTestId('notificationsTable.body.row');
    const notificationsTableCellArrow = within(rows[0]).getByTestId('goToNotificationDetail');
    fireEvent.click(notificationsTableCellArrow);
    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(
        GET_DETTAGLIO_NOTIFICA_PATH(notificationsToFe.resultsPage[0].iun)
      );
    });
  });

  it('go to notification detail - delegate access', async () => {
    await act(async () => {
      result = render(
        <DesktopNotifications
          notifications={[
            ...notificationsToFe.resultsPage.map((n) => ({ ...n, mandateId: 'mocked-mandate-id' })),
          ]}
          filtersApplied={false}
          onCleanFilters={onCleanFilters}
          isDelegatedPage
        />
      );
    });
    const rows = result!.getAllByTestId('notificationsTable.body.row');
    const notificationsTableCellArrow = within(rows[0]).getByTestId('goToNotificationDetail');
    fireEvent.click(notificationsTableCellArrow);
    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(
        GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH(
          notificationsToFe.resultsPage[0].iun,
          'mocked-mandate-id'
        )
      );
    });
  });
});
