import React from 'react';

import { formatToTimezoneString, tenYearsAgo, today } from '@pagopa-pn/pn-commons';

import { notificationsToFe } from '../../../../__mocks__/Notifications.mock';
import {
  RenderResult,
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from '../../../../__test__/test-utils';
import * as routes from '../../../../navigation/routes.const';
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
}));

describe('DesktopNotifications Component', () => {
  it('renders component - no notification', async () => {
    // render component
    let result: RenderResult;
    await act(async () => {
      result = render(
        <DesktopNotifications
          notifications={[]}
          sort={{ orderBy: '', order: 'asc' }}
          onManualSend={() => {}}
          onApiKeys={() => {}}
        />
      );
    });
    expect(result!.container).not.toHaveTextContent(/Filters/i);
    expect(result!.container).toHaveTextContent(
      /empty-state.message menu.api-key empty-state.secondary-message empty-state.secondary-action/i
    );
  });

  it('renders component - no notification after filter', async () => {
    // render component
    let result: RenderResult;
    await act(async () => {
      result = render(
        <DesktopNotifications
          notifications={[]}
          sort={{ orderBy: '', order: 'asc' }}
          onManualSend={() => {}}
          onApiKeys={() => {}}
        />,
        {
          preloadedState: {
            dashboardState: {
              filters: {
                startDate: formatToTimezoneString(tenYearsAgo),
                endDate: formatToTimezoneString(today),
                iunMatch: 'wrong-iun',
                mandateId: undefined,
              },
            },
          },
        }
      );
    });
    expect(result!.container).toHaveTextContent(/Filters/i);
    expect(result!.container).toHaveTextContent(
      /empty-state.message menu.api-key empty-state.secondary-message empty-state.secondary-action/i
    );
  });

  it('go to notification detail', async () => {
    let result: RenderResult;
    await act(async () => {
      result = render(
        <DesktopNotifications
          notifications={notificationsToFe.resultsPage}
          sort={{ orderBy: '', order: 'asc' }}
          onManualSend={() => {}}
          onApiKeys={() => {}}
        />
      );
    });
    const rows = result!.getAllByTestId('notificationsTable.row');
    expect(rows).toHaveLength(notificationsToFe.resultsPage.length);
    const notificationsTableCell = within(rows[0]).getAllByRole('cell');
    fireEvent.click(notificationsTableCell[0]);
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
      expect(mockNavigateFn).toBeCalledWith(
        routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationsToFe.resultsPage[0].iun)
      );
    });
  });
});
