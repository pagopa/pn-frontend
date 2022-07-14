import { act, fireEvent, RenderResult, screen, waitFor, within } from '@testing-library/react';
import * as redux from 'react-redux';
import { formatToTimezoneString, getNextDay, tenYearsAgo, today } from '@pagopa-pn/pn-commons';

import * as actions from '../../redux/dashboard/actions';
import { render, axe } from '../../__test__/test-utils';
import * as hooks from '../../redux/hooks';
import { notificationsToFe } from '../../redux/dashboard/__test__/test-utils';
import Dashboard from '../Dashboard.page';

const mockNavigateFn = jest.fn();
type ComponentProps = {
  noNotifications?: boolean;
};

function Component({ noNotifications }: ComponentProps) {
  const spy = jest.spyOn(hooks, 'useAppSelector');
  spy
    .mockReturnValueOnce(noNotifications ? [] : notificationsToFe.resultsPage)
    .mockReturnValueOnce({
      startDate: formatToTimezoneString(tenYearsAgo),
      endDate: formatToTimezoneString(getNextDay(today)),
    })
    .mockReturnValueOnce({
      orderBy: '',
      order: 'asc',
    })
    .mockReturnValueOnce({
      nextPagesKey: ['mocked-page-key-1', 'mocked-page-key-2', 'mocked-page-key-3'],
      size: 10,
      page: 0,
      moreResult: true,
    });
  // render component
  return <Dashboard />;
}

// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
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
      result = render(<Component noNotifications={true} />);
    });
    const newNotificationBtn = result?.queryByTestId('callToActionSecond');
    fireEvent.click(newNotificationBtn!);
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
    });
  });

  it('Dashboard without notifications, clicks on API KEYS page inside DesktopNotifications component', async () => {
    await act(async () => {
      result = render(<Component noNotifications={true} />);
    });
    const apiKeysBtn = result?.queryByTestId('callToActionFirst');
    fireEvent.click(apiKeysBtn!);
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
    });
  });

  it('renders dashboard page', async () => {
    await act(async () => {
      result = render(<Component />);
    });
    expect(screen.getByRole('heading')).toHaveTextContent(/Notifiche/i);
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
      result = render(<Component />);
    });
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
        type: 'setPagination',
      });
    });
  });

  it('changes page', async () => {
    await act(async () => {
      result = render(<Component />);
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
        type: 'setPagination',
      });
    });
  });

  it('clicks on new notification', async () => {
    await act(async () => {
      result = render(<Component />);
    });
    const newNotificationBtn = result?.queryByTestId('newNotificationBtn');
    expect(newNotificationBtn).toHaveTextContent('Invia una nuova notifica');
    fireEvent.click(newNotificationBtn!);
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
    });
  });

  it('does not have basic accessibility issues rendering the page', async () => {
    await act(async () => {
      result = render(<Component />);
    });
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  }, 15000);
});
