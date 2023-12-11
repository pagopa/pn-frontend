import React, { ReactNode } from 'react';

import { formatToTimezoneString, tenYearsAgo, today } from '@pagopa-pn/pn-commons';
import { createMatchMedia } from '@pagopa-pn/pn-commons/src/test-utils';

import { notificationsToFe } from '../../../__mocks__/Notifications.mock';
import { RenderResult, act, fireEvent, render, waitFor } from '../../../__test__/test-utils';
import * as routes from '../../../navigation/routes.const';
import MobileNotifications from '../MobileNotifications';

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
    i18n: { language: 'it' },
  }),
  Trans: (props: { i18nKey: string; components?: Array<ReactNode> }) => (
    <>
      {props.i18nKey} {props.components && props.components!.map((c) => c)}
    </>
  ),
}));

describe('MobileNotifications Component', () => {
  let result: RenderResult;
  const original = window.matchMedia;

  beforeAll(() => {
    window.matchMedia = createMatchMedia(800);
  });

  afterAll(() => {
    window.matchMedia = original;
  });

  it('renders MobileNotifications - no notifications', async () => {
    // render component
    await act(async () => {
      result = render(<MobileNotifications notifications={[]} />);
    });
    const filters = result!.queryByTestId('dialogToggle');
    expect(filters).not.toBeInTheDocument();
    const norificationCards = result!.queryAllByTestId('mobileNotificationsCards');
    expect(norificationCards).toHaveLength(0);
    expect(result!.container).toHaveTextContent(/empty-state.no-notifications/i);
    // clicks on empty state action
    const button = result.getByTestId('link-route-contacts');
    fireEvent.click(button);
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(routes.RECAPITI);
  });

  it('renders MobileNotifications - notifications', async () => {
    // render component
    await act(async () => {
      result = render(<MobileNotifications notifications={notificationsToFe.resultsPage} />);
    });
    const filters = result!.queryByTestId('dialogToggle');
    expect(filters).toBeInTheDocument();
    const norificationCards = result!.queryAllByTestId('mobileNotificationsCards');
    expect(norificationCards).toHaveLength(notificationsToFe.resultsPage.length);
  });

  it('renders component - no notification after filter', async () => {
    // render component
    await act(async () => {
      result = render(<MobileNotifications notifications={[]} />, {
        preloadedState: {
          dashboardState: {
            filters: {
              startDate: formatToTimezoneString(tenYearsAgo),
              endDate: formatToTimezoneString(today),
              iunMatch: 'ABCD-EFGH-ILMN-123456-A-1',
            },
          },
        },
      });
    });
    // the rerendering must be done to take the useRef updates
    result!.rerender(<MobileNotifications notifications={[]} />);
    const filters = await waitFor(() => result!.queryByTestId('dialogToggle'));
    expect(filters).toBeInTheDocument();
    expect(result!.container).toHaveTextContent(/empty-state.filtered/i);
  });

  it('clicks on go to detail action', async () => {
    // render component
    await act(async () => {
      result = render(<MobileNotifications notifications={notificationsToFe.resultsPage} />);
    });
    const norificationCards = result!.getAllByTestId('mobileNotificationsCards');
    const notificationsCardButton = norificationCards[0].querySelector('button');
    fireEvent.click(notificationsCardButton!);
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
      expect(mockNavigateFn).toBeCalledWith(
        routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationsToFe.resultsPage[0].iun)
      );
    });
  });
});
