import React from 'react';

import { act, fireEvent, RenderResult, screen, waitFor, within } from '@testing-library/react';
import * as redux from 'react-redux';
import {
  formatToTimezoneString,
  getNextDay,
  tenYearsAgo,
  today,
  Notification,
} from '@pagopa-pn/pn-commons';

import { render } from '../../__test__/test-utils';
import * as actions from '../../redux/dashboard/actions';
import { notificationsToFe } from '../../redux/dashboard/__test__/test-utils';
import Dashboard from '../Dashboard.page';

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
    useIsMobile: () => false,
  };
});

describe('Dashboard Page', () => {
  // eslint-disable-next-line functional/no-let
  let result: RenderResult | undefined;

  const mockDispatchFn = jest.fn();
  const mockActionFn = jest.fn();

  const initialState = (notifications: Array<Notification>) => ({
    preloadedState: {
      dashboardState: {
        notifications,
        filters: {
          startDate: formatToTimezoneString(tenYearsAgo),
          endDate: formatToTimezoneString(today),
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
      },
    },
  });

  beforeEach(async () => {
    // mock action
    const actionSpy = jest.spyOn(actions, 'getSentNotifications');
    actionSpy.mockImplementation(mockActionFn);
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    result = undefined;
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('Dashboard without notifications, clicks on new notification inside DesktopNotifications component', async () => {
    await act(async () => {
      result = render(<Dashboard />, initialState([]));
    });
    const newNotificationBtn = result?.queryByTestId('callToActionSecond');
    fireEvent.click(newNotificationBtn!);
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
    });
  });

  it('Dashboard without notifications, clicks on API KEYS page inside DesktopNotifications component', async () => {
    await act(async () => {
      result = render(<Dashboard />, initialState([]));
    });
    const apiKeysBtn = result?.queryByTestId('callToActionFirst');
    fireEvent.click(apiKeysBtn!);
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
    });
  });

  it('renders dashboard page', async () => {
    await act(async () => {
      result = render(<Dashboard />, initialState(notificationsToFe.resultsPage));
    });
    expect(screen.getByRole('heading')).toHaveTextContent(/title/i);
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
      size: 10,
    });
  });

  it('changes items per page', async () => {
    await act(async () => {
      result = render(<Dashboard />, initialState(notificationsToFe.resultsPage));
    });
    const itemsPerPageSelectorBtn = result?.container.querySelector(
      '[data-testid="itemsPerPageSelector"] > button'
    );
    fireEvent.click(itemsPerPageSelectorBtn!);
    const itemsPerPageDropdown = await waitFor(() => screen.queryByRole('presentation'));
    expect(itemsPerPageDropdown).toBeInTheDocument();
    const itemsPerPageItem = within(itemsPerPageDropdown!).queryByText('50');
    // reset mock dispatch function
    mockDispatchFn.mockReset();
    mockDispatchFn.mockClear();
    fireEvent.click(itemsPerPageItem!);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockDispatchFn).toBeCalledWith({
        payload: { size: 50, page: 0 },
        type: 'dashboardSlice/setPagination',
      });
    });
  });

  it('changes page', async () => {
    await act(async () => {
      result = render(<Dashboard />, initialState(notificationsToFe.resultsPage));
    });
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

  it('clicks on new notification', async () => {
    await act(async () => {
      result = render(<Dashboard />, initialState(notificationsToFe.resultsPage));
    });
    const newNotificationBtn = result?.queryByTestId('newNotificationBtn');
    expect(newNotificationBtn).toHaveTextContent('new-notification-button');
    fireEvent.click(newNotificationBtn!);
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
    });
  });

});
