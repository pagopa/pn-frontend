import { act, fireEvent, RenderResult, screen, waitFor, within } from '@testing-library/react';
import * as redux from 'react-redux';
import { formatToTimezoneString, getNextDay, apiOutcomeTestHelper, tenYearsAgo, today, ResponseEventDispatcher, AppResponseMessage } from '@pagopa-pn/pn-commons';

import { axe, render } from '../../__test__/test-utils';
import * as actions from '../../redux/dashboard/actions';
import * as hooks from '../../redux/hooks';
import { notificationsToFe } from '../../redux/dashboard/__test__/test-utils';
import Notifiche from '../Notifiche.page';
import { NotificationsApi } from '../../api/notifications/Notifications.api';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));


/**
 * Vedi commenti nella definizione di simpleMockForApiErrorWrapper
 */
 jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    useIsMobile: () => false,
    ApiErrorWrapper: original.simpleMockForApiErrorWrapper,
  };
});


describe('Notifiche Page - with notifications', () => {
  let result: RenderResult | undefined;
  let mockDispatchFn: jest.Mock;

  const mockActionFn = jest.fn();

  beforeEach(async () => {
    mockDispatchFn = jest.fn(() => ({
      then: () => Promise.resolve(),
    }));
    // mock app selector
    const spy = jest.spyOn(hooks, 'useAppSelector');
    spy
      .mockReturnValueOnce({
        notifications: notificationsToFe.resultsPage,
        filters: {
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(today),
          recipientId: '',
          status: '',
          subjectRegExp: '',
        },
        sort: {
          orderBy: '',
          order: 'asc',
        },
        pagination: {
          nextPagesKey: ['mocked-page-key-1', 'mocked-page-key-2', 'mocked-page-key-3'],
          size: 10,
          page: 0,
          moreResult: true,
        },
      })
      .mockReturnValueOnce({ delegators: [] })
      .mockReturnValueOnce({ legalDomicile: [] });
    // mock action
    const actionSpy = jest.spyOn(actions, 'getReceivedNotifications');
    actionSpy.mockImplementation(mockActionFn);
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    // render component
    await act(async () => {
      result = render(<Notifiche />);
    });
  });

  afterEach(() => {
    result = undefined;
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('renders notifiche page', () => {
    expect(screen.getAllByRole('heading')[0]).toHaveTextContent(/title/i);
    const filterForm = result?.container.querySelector('form');
    expect(filterForm).toBeInTheDocument();
    const notificationsTable = result?.container.querySelector('table');
    expect(notificationsTable).toBeInTheDocument();
    const itemsPerPageSelector = result?.queryByTestId('itemsPerPageSelector');
    expect(itemsPerPageSelector).toBeInTheDocument();
    const pageSelector = result?.queryByTestId('pageSelector');
    expect(pageSelector).toBeInTheDocument();
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({
      startDate: formatToTimezoneString(tenYearsAgo),
      endDate: formatToTimezoneString(getNextDay(today)),
      recipientId: '',
      status: '',
      subjectRegExp: '',
      size: 10,
    });
  });

  it('changes items per page', async () => {
    const itemsPerPageSelectorBtn = result?.container.querySelector(
      '[data-testid="itemsPerPageSelector"] > button'
    );
    fireEvent.click(itemsPerPageSelectorBtn!);
    const itemsPerPageDropdown = await waitFor(() => screen.queryByRole('presentation'));
    expect(itemsPerPageDropdown).toBeInTheDocument();
    const itemsPerPageItem = within(itemsPerPageDropdown!).queryByText('100');
    // reset mock dispatch function
    mockDispatchFn.mockReset();
    mockDispatchFn.mockClear();
    fireEvent.click(itemsPerPageItem!);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockDispatchFn).toBeCalledWith({
        payload: { size: 100, page: 0 },
        type: 'dashboardSlice/setPagination',
      });
    });
  });

  it('changes page', async () => {
    const pageSelectorBtn = result?.container.querySelector(
      '[data-testid="pageSelector"] li:nth-child(3) > button'
    );
    // reset mock dispatch function
    mockDispatchFn.mockReset();
    mockDispatchFn.mockClear();
    fireEvent.click(pageSelectorBtn!);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockDispatchFn).toBeCalledWith({
        payload: { size: 10, page: 1 },
        type: 'dashboardSlice/setPagination',
      });
    });
  });

  it.skip('does not have basic accessibility issues', async () => {
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail("render() returned undefined!");
    }
  }, 15000);
});


describe('Notifiche Page - query for notification API outcome', () => {
  beforeEach(() => {
    apiOutcomeTestHelper.setStandardMock();
  });

  afterEach(() => {
    apiOutcomeTestHelper.clearMock();
  });

  it('API error', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getReceivedNotifications');
    apiSpy.mockRejectedValue({ response: { status: 500 } });
    await act(async () => void render(<>
      <ResponseEventDispatcher />
      <AppResponseMessage />
      <Notifiche />
    </>));
    apiOutcomeTestHelper.expectApiErrorComponent(screen);
  });

  it('API OK', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getReceivedNotifications');
    apiSpy.mockResolvedValue({ resultsPage: [], moreResult: false, nextPagesKey: [] });
    await act(async () => void render(<>
      <ResponseEventDispatcher />
      <AppResponseMessage />
      <Notifiche />
    </>));
    apiOutcomeTestHelper.expectApiOKComponent(screen);
  });
});
