import React from 'react';

import { fireEvent, RenderResult, screen, waitFor, within } from '@testing-library/react';
import {
  formatToTimezoneString,
  getNextDay,
  tenYearsAgo,
  today
} from '@pagopa-pn/pn-commons';
import { doPrepareTestScenario } from './Notifiche.page.test-utils';

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
  let mockActionFn: jest.Mock;

  beforeEach(async () => {
    const scenario = await doPrepareTestScenario();
    result = scenario.result;
    mockDispatchFn = scenario.mockDispatchFn;
    mockActionFn = scenario.mockActionFn;
  });

  afterEach(() => {
    result = undefined;
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('renders notifiche page', () => {
    expect(screen.getAllByRole('heading')[0]).toHaveTextContent(/title/i);
    expect(screen.getAllByRole('heading')[0]).not.toHaveTextContent(
      /title-delegated-notifications/i
    );
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
      isDelegatedPage: false,
      recipientId: '',
      status: '',
      subjectRegExp: '',
      size: 10,
      group: undefined,
      nextPagesKey: undefined,
    });
  });

  it('changes items per page', async () => {
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
});


describe('Notifiche Delegate Page - with delegated notifications', () => {
  let result: RenderResult | undefined;
  let mockDispatchFn: jest.Mock;
  let mockActionFn: jest.Mock;

  beforeEach(async () => {
    const scenario = await doPrepareTestScenario(true);
    result = scenario.result;
    mockDispatchFn = scenario.mockDispatchFn;
    mockActionFn = scenario.mockActionFn;
  });

  afterEach(() => {
    result = undefined;
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('renders notifiche page', () => {
    expect(screen.getAllByRole('heading')[0]).toHaveTextContent(/title-delegated-notifications/i);
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
      isDelegatedPage: true,
      recipientId: '',
      status: '',
      subjectRegExp: '',
      size: 10,
      group: undefined,
      nextPagesKey: undefined,
    });
  });
});
