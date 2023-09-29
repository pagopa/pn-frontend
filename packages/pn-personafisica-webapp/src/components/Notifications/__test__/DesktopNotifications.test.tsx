import React from 'react';

import { formatToTimezoneString, tenYearsAgo, today } from '@pagopa-pn/pn-commons';

import { arrayOfDelegators } from '../../../__mocks__/Delegations.mock';
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
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('DesktopNotifications Component', () => {
  let result: RenderResult;

  it('renders component - no notification', async () => {
    // render component
    await act(async () => {
      result = render(<DesktopNotifications notifications={[]} />);
    });
    const filters = result!.queryByTestId('filter-form');
    expect(filters).not.toBeInTheDocument();
    const norificationTable = result!.queryByTestId('notificationsTable');
    expect(norificationTable).not.toBeInTheDocument();
    expect(result.container).toHaveTextContent(/empty-state.no-notifications/i);
  });

  it('renders component - no notification - delegate access', async () => {
    // render component
    await act(async () => {
      result = render(
        <DesktopNotifications notifications={[]} currentDelegator={arrayOfDelegators[0]} />
      );
    });
    const filters = result!.queryByTestId('filter-form');
    expect(filters).not.toBeInTheDocument();
    const norificationTable = result!.queryByTestId('notificationsTable');
    expect(norificationTable).not.toBeInTheDocument();
    expect(result.container).toHaveTextContent(/empty-state.delegate/i);
  });

  it('renders component - notification', async () => {
    // render component
    await act(async () => {
      result = render(<DesktopNotifications notifications={notificationsToFe.resultsPage} />);
    });
    const filters = result!.getByTestId('filter-form');
    expect(filters).toBeInTheDocument();
    const norificationTableRows = result!.getAllByTestId('notificationsTable.row');
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
    result!.rerender(<DesktopNotifications notifications={[]} />);
    const filters = await waitFor(() => result!.queryByTestId('filter-form'));
    expect(filters).toBeInTheDocument();
    expect(result!.container).toHaveTextContent(/empty-state.filtered/i);
  });

  it('go to notification detail', async () => {
    await act(async () => {
      result = render(<DesktopNotifications notifications={notificationsToFe.resultsPage} />);
    });
    const rows = result!.getAllByTestId('notificationsTable.row');
    const notificationsTableCell = within(rows[0]).getAllByRole('cell');
    fireEvent.click(notificationsTableCell[0]);
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
      expect(mockNavigateFn).toBeCalledWith(
        GET_DETTAGLIO_NOTIFICA_PATH(notificationsToFe.resultsPage[0].iun)
      );
    });
  });
});
