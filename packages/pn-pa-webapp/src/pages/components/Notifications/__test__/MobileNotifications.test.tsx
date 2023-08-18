import { fireEvent, waitFor } from '@testing-library/react';

import { render } from '../../../../__test__/test-utils';
import { notificationsToFe } from '../../../../__mocks__/Notifications.mock';
import * as routes from '../../../../navigation/routes.const';
import MobileNotifications from '../MobileNotifications';
import React from 'react';

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

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    NotificationsCard: () => <div>Cards</div>,
    MobileNotificationsSort: () => <div>Sort</div>,
  };
});

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

describe('MobileNotifications Component', () => {
  it('renders MobileNotifications', () => {
    // render component
    const result = render(
      <MobileNotifications
        notifications={[]}
        sort={{ orderBy: 'recipients', order: 'asc' }}
        onChangeSorting={() => {}}
        onManualSend={() => {}}
        onApiKeys={() => {}}
      />
    );
    expect(result.container).not.toHaveTextContent(/Filters/i);
    expect(result.container).not.toHaveTextContent(/Sort/i);
    expect(result.container).toHaveTextContent(
      /empty-state.message menu.api-key empty-state.secondary-message empty-state.secondary-action/i
    );
  });

  it('clicks on go to detail action', async () => {
    // render component
    const result = render(
      <MobileNotifications
        notifications={notificationsToFe.resultsPage}
        sort={{ orderBy: '', order: 'asc' }}
        onManualSend={() => {}}
        onApiKeys={() => {}}
      />
    );
    const notificationsCardButton = result?.container.querySelector('button');
    fireEvent.click(notificationsCardButton!);
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
      expect(mockNavigateFn).toBeCalledWith(
        routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationsToFe.resultsPage[0].iun)
      );
    });
  });
});
