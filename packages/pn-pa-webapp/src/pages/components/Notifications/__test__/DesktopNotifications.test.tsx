import { fireEvent, waitFor } from '@testing-library/react';

import { render } from '../../../../__test__/test-utils';
import { notificationsToFe } from '../../../../redux/dashboard/__test__/test-utils';
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

jest.mock('../FilterNotifications', () => {
  const { forwardRef, useImperativeHandle } = jest.requireActual('react');
  return forwardRef(({ showFilters }: { showFilters: boolean }, ref: any) => {
    useImperativeHandle(ref, () => ({
      filtersApplied: false
    }));
    if (!showFilters) {
      return <></>;
    }
    return <div>Filters</div>;
  });
});

describe('DesktopNotifications Component', () => {
  it('renders DesktopNotifications', () => {
    // render component
    const result = render(
      <DesktopNotifications
        notifications={[]}
        sort={{ orderBy: '', order: 'asc' }}
        onManualSend={() => {}}
        onApiKeys={() => {}}
      />
    );
    expect(result.container).not.toHaveTextContent(/Filters/i);
    expect(result.container).toHaveTextContent(
      /empty-state.message menu.api-key empty-state.secondary-message empty-state.secondary-action/i
    );
  });

  it('clicks on row', async () => {
    const result = render(
      <DesktopNotifications
        notifications={notificationsToFe.resultsPage}
        sort={{ orderBy: '', order: 'asc' }}
        onManualSend={() => {}}
        onApiKeys={() => {}}
      />
    );
    const notificationsTableCell = result.container.querySelector(
      'table tr:first-child td:nth-child(2)'
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
