import React from 'react';

import { render, fireEvent, waitFor } from '../../../__test__/test-utils';
import { notificationsToFe } from '../../../redux/dashboard/__test__/test-utils';
import * as routes from '../../../navigation/routes.const';
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

jest.mock('../FilterNotifications', () => {
  const { forwardRef, useImperativeHandle } = jest.requireActual('react');
  return forwardRef(({ showFilters }: { showFilters: boolean }, ref: any) => {
    useImperativeHandle(ref, () => ({
      filtersApplied: false,
    }));
    if (!showFilters) {
      return <></>;
    }
    return <div>Filters</div>;
  });
});

describe('DesktopNotifications Component', () => {
  it('renders DesktopNotifications - empty case - recipient access', () => {
    // render component
    const result = render(
      <DesktopNotifications notifications={[]} sort={{ orderBy: '', order: 'asc' }} />
    );
    expect(result.container).not.toHaveTextContent(/Filters/i);
    expect(result.container).toHaveTextContent(
      /empty-state.first-message empty-state.action empty-state.second-message/i
    );
  });

  it('renders DesktopNotifications - empty case - delegate access', () => {
    // render component
    const result = render(
      <DesktopNotifications notifications={[]} sort={{ orderBy: '', order: 'asc' }} currentDelegator={{
        mandateId: 'mandate-id-1', 
        delegator: { displayName: 'mandate-display-name-1', fiscalCode: 'tax-id-1', person: true },
        status: 'active',
        visibilityIds: [],
        datefrom: '2023-04-08',
        dateto: '2028-04-07',
        verificationCode: '33334'
      }}/>
    );
    expect(result.container).not.toHaveTextContent(/Filters/i);
    expect(result.container).toHaveTextContent(
      /empty-state.delegate/i
    );
  });

  it('clicks on row', async () => {
    // render component
    const result = render(
      <DesktopNotifications
        notifications={notificationsToFe.resultsPage}
        sort={{ orderBy: '', order: 'asc' }}
      />
    );
    const notificationsTableCell = result?.container.querySelector(
      'table tr:first-child td:nth-child(2) button'
    );
    fireEvent.click(notificationsTableCell!);
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
      expect(mockNavigateFn).toBeCalledWith(
        routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationsToFe.resultsPage[0].iun)
      );
    });
  });
});
