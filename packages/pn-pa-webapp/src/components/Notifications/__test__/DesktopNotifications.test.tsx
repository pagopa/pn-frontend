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
import { GET_DETTAGLIO_NOTIFICA_PATH } from '../../../navigation/routes.const';
import DesktopNotifications from '../DesktopNotifications';

const mockNavigateFn = vi.fn();

// mock imports
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

describe('DesktopNotifications Component', () => {
  let result: RenderResult;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component - no notification', async () => {
    // render component
    await act(async () => {
      result = render(
        <DesktopNotifications
          notifications={[]}
          onManualSend={() => {}}
          onApiKeys={() => {}}
          filtersApplied={false}
          onCleanFilters={() => {}}
        />
      );
    });
    const filters = result!.queryByTestId('filter-form');
    expect(filters).not.toBeInTheDocument();
    const norificationsTable = result!.queryByTestId('notificationsTable');
    expect(norificationsTable).not.toBeInTheDocument();
    expect(result!.container).toHaveTextContent(/empty-state.no-notifications/i);
  });

  it('renders component - notification', async () => {
    // render component
    await act(async () => {
      result = render(
        <DesktopNotifications
          notifications={notificationsToFe.resultsPage}
          onManualSend={() => {}}
          onApiKeys={() => {}}
          filtersApplied={false}
          onCleanFilters={() => {}}
        />
      );
    });
    const filters = result!.queryByTestId('filter-form');
    expect(filters).not.toBeInTheDocument();

    const norificationTableRows = result!.getAllByTestId('notificationsTable.body.row');
    expect(norificationTableRows).toHaveLength(notificationsToFe.resultsPage.length);
  });

  it('renders component - no notification after filter', async () => {
    // render component
    await act(async () => {
      result = render(
        <DesktopNotifications
          notifications={[]}
          sort={{ orderBy: '', order: 'asc' }}
          onManualSend={() => {}}
          onApiKeys={() => {}}
          filtersApplied={true} // <- simulate "filtered" empty state
          onCleanFilters={() => {}}
        />
      );
    });
    const filters = result!.queryByTestId('filter-form');
    expect(filters).not.toBeInTheDocument();
    expect(result!.container).toHaveTextContent(/empty-state.filtered/i);
  });

  it('go to notification detail', async () => {
    await act(async () => {
      result = render(
        <DesktopNotifications
          notifications={notificationsToFe.resultsPage}
          onManualSend={() => {}}
          onApiKeys={() => {}}
          filtersApplied={false}
          onCleanFilters={() => {}}
        />
      );
    });
    const rows = result!.getAllByTestId('notificationsTable.body.row');
    const notificationsTableCellArrow = within(rows[0]).getByTestId('goToNotificationDetail');
    fireEvent.click(notificationsTableCellArrow);
    await waitFor(() => {
      expect(mockNavigateFn).toHaveBeenCalledTimes(1);
      expect(mockNavigateFn).toHaveBeenCalledWith(
        GET_DETTAGLIO_NOTIFICA_PATH(notificationsToFe.resultsPage[0].iun)
      );
    });
  });
});
