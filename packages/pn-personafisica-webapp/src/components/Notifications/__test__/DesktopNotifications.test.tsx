import { vi } from 'vitest';

import { formatToTimezoneString, tenYearsAgo, today } from '@pagopa-pn/pn-commons';

import { digitalAddressesSercq } from '../../../__mocks__/Contacts.mock';
import { mandatesByDelegate } from '../../../__mocks__/Delegations.mock';
import { notificationsToFe } from '../../../__mocks__/Notifications.mock';
import {
  RenderResult,
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import * as routes from '../../../navigation/routes.const';
import { GET_DETTAGLIO_NOTIFICA_PATH } from '../../../navigation/routes.const';
import DesktopNotifications from '../DesktopNotifications';

describe('DesktopNotifications Component', () => {
  let result: RenderResult;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders component - no notification - no contacts', async () => {
    // render component
    await act(async () => {
      result = render(<DesktopNotifications notifications={[]} />, {
        preloadedState: {
          contactsState: {
            digitalAddresses: [],
          },
        },
      });
    });
    const filters = result.queryByTestId('filter-form');
    expect(filters).not.toBeInTheDocument();
    const norificationTable = result.queryByTestId('notificationsTable');
    expect(norificationTable).not.toBeInTheDocument();
    expect(result.container).toHaveTextContent(/empty-state.title/i);
    expect(result.container).toHaveTextContent(/empty-state.description-onboarding/i);
    // clicks on empty state action
    const button = result.getByTestId('button-route-onboarding');
    fireEvent.click(button);
    expect(result.router.state.location.pathname).toBe(routes.ONBOARDING);
  });

  it('renders component - no notification - with contacts', async () => {
    // render component
    await act(async () => {
      result = render(<DesktopNotifications notifications={[]} />, {
        preloadedState: {
          contactsState: {
            digitalAddresses: digitalAddressesSercq,
          },
        },
      });
    });
    const filters = result.queryByTestId('filter-form');
    expect(filters).not.toBeInTheDocument();
    const norificationTable = result.queryByTestId('notificationsTable');
    expect(norificationTable).not.toBeInTheDocument();
    expect(result.container).toHaveTextContent(/empty-state.title/i);
    expect(result.container).toHaveTextContent(/empty-state.description/i);
    // clicks on empty state action
    const button = result.getByTestId('link-route-contacts');
    fireEvent.click(button);
    expect(result.router.state.location.pathname).toBe(routes.RECAPITI);
  });

  it('renders component - no notification - delegate access', async () => {
    // render component
    await act(async () => {
      result = render(
        <DesktopNotifications notifications={[]} currentDelegator={mandatesByDelegate[0]} />
      );
    });
    const filters = result.queryByTestId('filter-form');
    expect(filters).not.toBeInTheDocument();
    const norificationTable = result.queryByTestId('notificationsTable');
    expect(norificationTable).not.toBeInTheDocument();
    expect(result.container).toHaveTextContent(/empty-state.delegate/i);
  });

  it('renders component - notification', async () => {
    // render component
    await act(async () => {
      result = render(<DesktopNotifications notifications={notificationsToFe.resultsPage} />);
    });
    const filters = result.getByTestId('filter-form');
    expect(filters).toBeInTheDocument();
    const norificationTableRows = result.getAllByTestId('notificationsTable.body.row');
    expect(norificationTableRows).toHaveLength(notificationsToFe.resultsPage.length);
  });

  it('renders component - no notification after filter', async () => {
    // render component
    await act(async () => {
      result = render(<DesktopNotifications notifications={[]} />, {
        preloadedState: {
          dashboardState: {
            filters: {
              startDate: formatToTimezoneString(tenYearsAgo),
              endDate: formatToTimezoneString(today),
              iunMatch: 'ABCD-EFGH-ILMN-123456-A-1',
              mandateId: undefined,
            },
          },
        },
      });
    });
    // the rerendering must be done to take the useRef updates
    result.rerender(<DesktopNotifications notifications={[]} />);
    const filters = await waitFor(() => result.queryByTestId('filter-form'));
    expect(filters).toBeInTheDocument();
    expect(result.container).toHaveTextContent(/empty-state.filtered/i);
  });

  it('go to notification detail', async () => {
    await act(async () => {
      result = render(<DesktopNotifications notifications={notificationsToFe.resultsPage} />);
    });
    const rows = result.getAllByTestId('notificationsTable.body.row');
    const notificationsTableCellArrow = within(rows[0]).getByTestId('goToNotificationDetail');
    fireEvent.click(notificationsTableCellArrow);
    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(
        GET_DETTAGLIO_NOTIFICA_PATH(notificationsToFe.resultsPage[0].iun)
      );
    });
  });
});
