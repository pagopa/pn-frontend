import React from 'react';

import { exampleDowntimeLogPage } from '../../../__mocks__/AppStatus.mock';
import { KnownFunctionality } from '../../../models';
import {
  RenderResult,
  act,
  createMatchMedia,
  fireEvent,
  initLocalizationForTest,
  render,
  screen,
  waitFor,
} from '../../../test-utils';
import { AppStatusData } from '../../../types';
import { formatDateTime } from '../../../utils/date.utility';
import { apiOutcomeTestHelper } from '../../../utils/test.utility';
import { AppStatusRender } from '../AppStatusRender';

const mockActionIds = {
  GET_CURRENT_STATUS: 'mock-get-current-status',
  GET_DOWNTIME_LOG_PAGE: 'mock-get-downtime-log-page',
};

const mockAppStatus: AppStatusData = {
  pagination: { page: 0, size: 10, resultPages: ['0', '1', '3'] },
  currentStatus: {
    appIsFullyOperative: true,
    lastCheckTimestamp: '2022-12-28T15:43:19.190Z',
    statusByFunctionality: [],
  },
  downtimeLogPage: {
    downtimes: [],
  },
};

describe('AppStatusRender component', () => {
  let result: RenderResult;
  const original = window.matchMedia;
  const clearLegalFactDocument = jest.fn();
  const clearPagination = jest.fn();
  const fetchCurrentStatus = jest.fn();
  const fetchDowntimeLegalFactDocumentDetails = jest.fn();
  const fetchDowntimeLogPage = jest.fn();
  const setPagination = jest.fn();

  beforeAll(() => {
    initLocalizationForTest();
  });

  afterEach(() => {
    window.matchMedia = original;
    jest.clearAllMocks();
  });

  it('empty downtime list', async () => {
    // render component
    await act(async () => {
      result = render(
        <AppStatusRender
          actionIds={mockActionIds}
          appStatus={{ ...mockAppStatus, downtimeLogPage: { downtimes: [] } }}
          clearLegalFactDocument={clearLegalFactDocument}
          clearPagination={clearPagination}
          fetchCurrentStatus={fetchCurrentStatus}
          fetchDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
          fetchDowntimeLogPage={fetchDowntimeLogPage}
          setPagination={setPagination}
        />
      );
    });
    // test layout
    expect(result.container).toHaveTextContent('appStatus - appStatus.title');
    expect(result.container).toHaveTextContent('appStatus - appStatus.subtitle');
    expect(result.container).toHaveTextContent('appStatus - downtimeList.title');
    const appStatusBarComponent = result.getByTestId('app-status-bar');
    const appStatusLastCheck = result.getByTestId('appStatus-lastCheck');
    const desktopDonwtimeLogComponent = result.queryByTestId('tableDowntimeLog');
    const mobileDonwtimeLogComponent = result.queryByTestId('mobileTableDowntimeLog');
    const customPagination = result.queryByTestId('customPagination');
    const emptyStateComponent = result.getByTestId('emptyState');
    expect(appStatusBarComponent).toBeInTheDocument();
    expect(appStatusLastCheck).toBeInTheDocument();
    const lastCheckTimestampFormatted = formatDateTime(
      mockAppStatus.currentStatus!.lastCheckTimestamp
    );
    expect(appStatusLastCheck).toHaveTextContent(
      `appStatus - appStatus.lastCheckLegend - ${JSON.stringify({
        lastCheckTimestamp: lastCheckTimestampFormatted,
      })}`
    );
    expect(desktopDonwtimeLogComponent).not.toBeInTheDocument();
    expect(mobileDonwtimeLogComponent).not.toBeInTheDocument();
    expect(customPagination).not.toBeInTheDocument();
    expect(emptyStateComponent).toBeInTheDocument();
    expect(emptyStateComponent).toHaveTextContent(/downtimeList.emptyMessage/i);
    // test calls
    expect(clearPagination).toBeCalledTimes(1);
    expect(fetchCurrentStatus).toBeCalledTimes(1);
    expect(fetchDowntimeLogPage).toBeCalledTimes(1);
    expect(fetchDowntimeLogPage).toBeCalledWith({
      startDate: '1900-01-01T00:00:00Z',
      endDate: expect.stringMatching(
        /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+(?:[+-][0-2]\d:[0-5]\d|Z)/
      ),
      functionality: [
        KnownFunctionality.NotificationCreate,
        KnownFunctionality.NotificationVisualization,
        KnownFunctionality.NotificationWorkflow,
      ],
      size: '10',
      page: '0',
    });
    expect(setPagination).toBeCalledTimes(0);
    expect(fetchDowntimeLegalFactDocumentDetails).toBeCalledTimes(0);
    expect(clearLegalFactDocument).toBeCalledTimes(0);
  });

  it('with downtime - desktop', async () => {
    // render component
    await act(async () => {
      result = render(
        <AppStatusRender
          actionIds={mockActionIds}
          appStatus={{
            ...mockAppStatus,
            downtimeLogPage: { downtimes: exampleDowntimeLogPage.downtimes },
          }}
          clearLegalFactDocument={clearLegalFactDocument}
          clearPagination={clearPagination}
          fetchCurrentStatus={fetchCurrentStatus}
          fetchDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
          fetchDowntimeLogPage={fetchDowntimeLogPage}
          setPagination={setPagination}
        />
      );
    });
    const appStatusBarComponent = result.getByTestId('app-status-bar');
    const desktopDonwtimeLogComponent = result.getByTestId('tableDowntimeLog');
    const mobileDonwtimeLogComponent = result.queryByTestId('mobileTableDowntimeLog');
    const emptyStateComponent = result.queryByTestId('emptyState');
    expect(appStatusBarComponent).toBeInTheDocument();
    expect(desktopDonwtimeLogComponent).toBeInTheDocument();
    expect(mobileDonwtimeLogComponent).not.toBeInTheDocument();
    expect(emptyStateComponent).not.toBeInTheDocument();
  });

  it('with downtime - mobile', async () => {
    window.matchMedia = createMatchMedia(800);
    // render component
    await act(async () => {
      result = render(
        <AppStatusRender
          actionIds={mockActionIds}
          appStatus={{
            ...mockAppStatus,
            downtimeLogPage: { downtimes: exampleDowntimeLogPage.downtimes },
          }}
          clearLegalFactDocument={clearLegalFactDocument}
          clearPagination={clearPagination}
          fetchCurrentStatus={fetchCurrentStatus}
          fetchDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
          fetchDowntimeLogPage={fetchDowntimeLogPage}
          setPagination={setPagination}
        />
      );
    });
    const appStatusBarComponent = result.getByTestId('app-status-bar');
    const desktopDonwtimeLogComponent = result.queryByTestId('tableDowntimeLog');
    const mobileDonwtimeLogComponent = result.getByTestId('mobileTableDowntimeLog');
    const emptyStateComponent = result.queryByTestId('emptyState');
    expect(appStatusBarComponent).toBeInTheDocument();
    expect(desktopDonwtimeLogComponent).not.toBeInTheDocument();
    expect(mobileDonwtimeLogComponent).toBeInTheDocument();
    expect(emptyStateComponent).not.toBeInTheDocument();
  });

  it('change pagination', async () => {
    // render component
    await act(async () => {
      result = render(
        <AppStatusRender
          actionIds={mockActionIds}
          appStatus={{
            ...mockAppStatus,
            downtimeLogPage: { downtimes: [exampleDowntimeLogPage.downtimes[0]] },
          }}
          clearLegalFactDocument={clearLegalFactDocument}
          clearPagination={clearPagination}
          fetchCurrentStatus={fetchCurrentStatus}
          fetchDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
          fetchDowntimeLogPage={fetchDowntimeLogPage}
          setPagination={setPagination}
        />
      );
    });
    let rows = result.getAllByTestId('tableDowntimeLog.row');
    expect(rows).toHaveLength(1);
    // change size
    const itemsPerPageSelector = result.getByTestId('itemsPerPageSelector');
    const itemsPerPageSelectorBtn = itemsPerPageSelector?.querySelector('button');
    fireEvent.click(itemsPerPageSelectorBtn!);
    const itemsPerPageList = screen.getAllByRole('menuitem');
    fireEvent.click(itemsPerPageList[1]!);
    await waitFor(() => {
      expect(setPagination).toBeCalledTimes(1);
      expect(setPagination).toBeCalledWith({ size: 20, page: 0, totalElements: 30 });
    });
    // simulate rerendering due to page size changing
    result.rerender(
      <AppStatusRender
        actionIds={mockActionIds}
        appStatus={{
          ...mockAppStatus,
          pagination: { page: 0, size: 20, resultPages: ['0', '1', '3'] },
          downtimeLogPage: { downtimes: [exampleDowntimeLogPage.downtimes[0]] },
        }}
        clearLegalFactDocument={clearLegalFactDocument}
        clearPagination={clearPagination}
        fetchCurrentStatus={fetchCurrentStatus}
        fetchDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
        fetchDowntimeLogPage={fetchDowntimeLogPage}
        setPagination={setPagination}
      />
    );
    expect(fetchCurrentStatus).toBeCalledTimes(2);
    expect(fetchDowntimeLogPage).toBeCalledTimes(2);
    expect(fetchDowntimeLogPage).toBeCalledWith({
      startDate: '1900-01-01T00:00:00Z',
      endDate: expect.stringMatching(
        /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+(?:[+-][0-2]\d:[0-5]\d|Z)/
      ),
      functionality: [
        KnownFunctionality.NotificationCreate,
        KnownFunctionality.NotificationVisualization,
        KnownFunctionality.NotificationWorkflow,
      ],
      size: '20',
      page: '0',
    });
    // simulate rerendering due to page size changing
    result.rerender(
      <AppStatusRender
        actionIds={mockActionIds}
        appStatus={{
          ...mockAppStatus,
          pagination: { page: 0, size: 20, resultPages: ['0', '1'] },
          downtimeLogPage: { downtimes: exampleDowntimeLogPage.downtimes.slice(1) },
        }}
        clearLegalFactDocument={clearLegalFactDocument}
        clearPagination={clearPagination}
        fetchCurrentStatus={fetchCurrentStatus}
        fetchDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
        fetchDowntimeLogPage={fetchDowntimeLogPage}
        setPagination={setPagination}
      />
    );
    rows = result.getAllByTestId('tableDowntimeLog.row');
    expect(rows).toHaveLength(exampleDowntimeLogPage.downtimes.length - 1);
    // check that no extra calls are done
    expect(fetchCurrentStatus).toBeCalledTimes(2);
    expect(fetchDowntimeLogPage).toBeCalledTimes(2);
  });

  it('changes page', async () => {
    // render component
    await act(async () => {
      result = render(
        <AppStatusRender
          actionIds={mockActionIds}
          appStatus={{
            ...mockAppStatus,
            downtimeLogPage: { downtimes: [exampleDowntimeLogPage.downtimes[0]] },
          }}
          clearLegalFactDocument={clearLegalFactDocument}
          clearPagination={clearPagination}
          fetchCurrentStatus={fetchCurrentStatus}
          fetchDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
          fetchDowntimeLogPage={fetchDowntimeLogPage}
          setPagination={setPagination}
        />
      );
    });
    let rows = result.getAllByTestId('tableDowntimeLog.row');
    expect(rows).toHaveLength(1);
    // change page
    const pageSelector = result.getByTestId('pageSelector');
    const pageButtons = pageSelector.querySelectorAll('button');
    // the buttons are < 1 >
    fireEvent.click(pageButtons[2]);
    await waitFor(() => {
      expect(setPagination).toBeCalledTimes(1);
      expect(setPagination).toBeCalledWith({ size: 10, page: 1, totalElements: 30 });
    });
    // simulate rerendering due to page size changing
    result.rerender(
      <AppStatusRender
        actionIds={mockActionIds}
        appStatus={{
          ...mockAppStatus,
          pagination: { page: 1, size: 10, resultPages: ['0', '1', '3'] },
          downtimeLogPage: { downtimes: [exampleDowntimeLogPage.downtimes[0]] },
        }}
        clearLegalFactDocument={clearLegalFactDocument}
        clearPagination={clearPagination}
        fetchCurrentStatus={fetchCurrentStatus}
        fetchDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
        fetchDowntimeLogPage={fetchDowntimeLogPage}
        setPagination={setPagination}
      />
    );
    expect(fetchCurrentStatus).toBeCalledTimes(2);
    expect(fetchDowntimeLogPage).toBeCalledTimes(2);
    expect(fetchDowntimeLogPage).toBeCalledWith({
      startDate: '1900-01-01T00:00:00Z',
      endDate: expect.stringMatching(
        /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+(?:[+-][0-2]\d:[0-5]\d|Z)/
      ),
      functionality: [
        KnownFunctionality.NotificationCreate,
        KnownFunctionality.NotificationVisualization,
        KnownFunctionality.NotificationWorkflow,
      ],
      size: '10',
      page: '1',
    });
    // simulate rerendering due to page size changing
    result.rerender(
      <AppStatusRender
        actionIds={mockActionIds}
        appStatus={{
          ...mockAppStatus,
          pagination: { page: 1, size: 10, resultPages: ['0', '1', '3'] },
          downtimeLogPage: { downtimes: exampleDowntimeLogPage.downtimes.slice(1) },
        }}
        clearLegalFactDocument={clearLegalFactDocument}
        clearPagination={clearPagination}
        fetchCurrentStatus={fetchCurrentStatus}
        fetchDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
        fetchDowntimeLogPage={fetchDowntimeLogPage}
        setPagination={setPagination}
      />
    );
    rows = result.getAllByTestId('tableDowntimeLog.row');
    expect(rows).toHaveLength(exampleDowntimeLogPage.downtimes.length - 1);
    // check that no extra calls are done
    expect(fetchCurrentStatus).toBeCalledTimes(2);
    expect(fetchDowntimeLogPage).toBeCalledTimes(2);
  });

  it('error in status API', async () => {
    // render component
    await act(async () => {
      result = render(
        <AppStatusRender
          actionIds={mockActionIds}
          appStatus={{
            ...mockAppStatus,
            downtimeLogPage: { downtimes: [exampleDowntimeLogPage.downtimes[0]] },
          }}
          clearLegalFactDocument={clearLegalFactDocument}
          clearPagination={clearPagination}
          fetchCurrentStatus={fetchCurrentStatus}
          fetchDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
          fetchDowntimeLogPage={fetchDowntimeLogPage}
          setPagination={setPagination}
        />,
        {
          preloadedState: {
            appState: apiOutcomeTestHelper.appStateWithMessageForAction(
              mockActionIds.GET_CURRENT_STATUS
            ),
          },
        }
      );
    });
    const appStatusBarComponent = result.queryByTestId('app-status-bar');
    const desktopDonwtimeLogComponent = result.getByTestId('tableDowntimeLog');
    const mobileDonwtimeLogComponent = result.queryByTestId('mobileTableDowntimeLog');
    const emptyStateComponent = result.queryByTestId('emptyState');
    const errorStatusComponent = result.getByTestId(
      `api-error-${mockActionIds.GET_CURRENT_STATUS}`
    );
    const errorDowntimeComponent = result.queryByTestId(
      `api-error-${mockActionIds.GET_DOWNTIME_LOG_PAGE}`
    );
    expect(appStatusBarComponent).not.toBeInTheDocument();
    expect(desktopDonwtimeLogComponent).toBeInTheDocument();
    expect(mobileDonwtimeLogComponent).not.toBeInTheDocument();
    expect(emptyStateComponent).not.toBeInTheDocument();
    expect(errorStatusComponent).toBeInTheDocument();
    expect(errorDowntimeComponent).not.toBeInTheDocument();
  });

  it('error in both status and downtime API', async () => {
    const mockAppState = apiOutcomeTestHelper.appStateWithMessageForAction(
      mockActionIds.GET_CURRENT_STATUS
    );
    mockAppState.messages.errors.push(
      apiOutcomeTestHelper.errorMessageForAction(mockActionIds.GET_DOWNTIME_LOG_PAGE)
    );
    // render component
    await act(async () => {
      result = render(
        <AppStatusRender
          actionIds={mockActionIds}
          appStatus={{
            ...mockAppStatus,
            downtimeLogPage: { downtimes: [exampleDowntimeLogPage.downtimes[0]] },
          }}
          clearLegalFactDocument={clearLegalFactDocument}
          clearPagination={clearPagination}
          fetchCurrentStatus={fetchCurrentStatus}
          fetchDowntimeLegalFactDocumentDetails={fetchDowntimeLegalFactDocumentDetails}
          fetchDowntimeLogPage={fetchDowntimeLogPage}
          setPagination={setPagination}
        />,
        {
          preloadedState: {
            appState: mockAppState,
          },
        }
      );
    });
    const appStatusBarComponent = result.queryByTestId('app-status-bar');
    const desktopDonwtimeLogComponent = result.queryByTestId('tableDowntimeLog');
    const mobileDonwtimeLogComponent = result.queryByTestId('mobileTableDowntimeLog');
    const emptyStateComponent = result.queryByTestId('emptyState');
    const errorStatusComponent = result.getByTestId(
      `api-error-${mockActionIds.GET_CURRENT_STATUS}`
    );
    const errorDowntimeComponent = result.getByTestId(
      `api-error-${mockActionIds.GET_DOWNTIME_LOG_PAGE}`
    );
    expect(appStatusBarComponent).not.toBeInTheDocument();
    expect(desktopDonwtimeLogComponent).not.toBeInTheDocument();
    expect(mobileDonwtimeLogComponent).not.toBeInTheDocument();
    expect(emptyStateComponent).not.toBeInTheDocument();
    expect(errorStatusComponent).toBeInTheDocument();
    expect(errorDowntimeComponent).toBeInTheDocument();
  });
});
