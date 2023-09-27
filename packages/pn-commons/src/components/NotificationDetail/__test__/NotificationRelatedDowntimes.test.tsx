import _ from 'lodash';
import React from 'react';

import { exampleDowntimeLogPage } from '../../../__mocks__/AppStatus.mock';
import { notificationToFe } from '../../../__mocks__/NotificationDetail.mock';
import { Downtime, DowntimeStatus, KnownFunctionality } from '../../../models';
import { RenderResult, initLocalizationForTest, render, screen, within } from '../../../test-utils';
import { IAppMessage, NotificationStatus, NotificationStatusHistory } from '../../../types';
import { formatDate, isToday } from '../../../utils';
import NotificationRelatedDowntimes from '../NotificationRelatedDowntimes';

const fakePalette = {
  success: { main: '#00FF00' },
  error: { main: '#FF0000' },
  text: { primary: '#AAAAAA', secondary: '#BBBBBB' },
};

jest.mock('@mui/material', () => {
  const original = jest.requireActual('@mui/material');
  return {
    ...original,
    useTheme: () => ({ ...original.useTheme(), palette: fakePalette }),
  };
});

const fetchDowntimeEventsMock = jest.fn();

const errors: Array<IAppMessage> = [
  {
    id: 'getDowntimeEvents',
    blocking: false,
    message: 'Mocked message',
    title: 'Mocked title',
    toNotify: true,
    alreadyShown: false,
  },
];

const mockErrorState = {
  preloadedState: {
    appState: {
      messages: {
        errors,
        success: [],
      },
    },
  },
};

function renderComponent(
  downtimes: Array<Downtime>,
  history: NotificationStatusHistory[],
  setApiError?: boolean
): RenderResult {
  return render(
    <NotificationRelatedDowntimes
      downtimeEvents={downtimes}
      fetchDowntimeEvents={fetchDowntimeEventsMock}
      notificationStatusHistory={history}
      apiId="getDowntimeEvents"
      clearDowntimeLegalFactData={() => {}}
      downtimeLegalFactUrl="mock-url"
      fetchDowntimeLegalFactDocumentDetails={() => {}}
    />,
    setApiError ? mockErrorState : undefined
  );
}

function testLogRendering(currentLog: Downtime, elem: HTMLElement) {
  if (currentLog.endDate) {
    expect(elem).toHaveTextContent(
      `notifiche - detail.downtimes.textWithEndDate - ${JSON.stringify({
        startDate: `${
          isToday(new Date(currentLog.startDate)) ? '' : 'notifiche - detail.downtimes.datePrefix'
        } ${formatDate(currentLog.startDate)}`,
        endDate: `${
          isToday(new Date(currentLog.endDate)) ? '' : 'notifiche - detail.downtimes.datePrefix'
        } ${formatDate(currentLog.endDate)}`,
      })}`
    );
  } else {
    expect(elem).toHaveTextContent(
      `notifiche - detail.downtimes.textWithoutEndDate - ${JSON.stringify({
        startDate: `${
          isToday(new Date(currentLog.startDate)) ? '' : 'notifiche - detail.downtimes.datePrefix'
        } ${formatDate(currentLog.startDate)}`,
      })}`
    );
  }
  if (currentLog.knownFunctionality) {
    expect(elem).toHaveTextContent(
      `appStatus - legends.knownFunctionality.${currentLog.knownFunctionality}`
    );
  } else {
    expect(elem).toHaveTextContent(
      `appStatus - legends.unknownFunctionality - ${JSON.stringify({
        functionality: currentLog.rawFunctionality,
      })}`
    );
  }
  const legalFactBtn = within(elem).queryByRole('button');
  if (currentLog.fileAvailable) {
    expect(legalFactBtn).toBeInTheDocument();
    expect(legalFactBtn).toHaveTextContent(`notifiche - detail.downtimes.legalFactDownload`);
  } else {
    expect(legalFactBtn).not.toBeInTheDocument();
    expect(elem).toHaveTextContent(
      `appStatus - legends.noFileAvailableByStatus.${currentLog.status}`
    );
    const fileNotAvailableLegend = within(elem).getByText(
      `appStatus - legends.noFileAvailableByStatus.${currentLog.status}`
    );
    expect(fileNotAvailableLegend).toHaveStyle({ color: fakePalette.text.secondary });
  }
}

describe('NotificationRelatedDowntimes component', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('normal history - one complete downtime, one not finished, one finished but yet without link', () => {
    const { getByTestId, getAllByTestId, queryByTestId } = renderComponent(
      exampleDowntimeLogPage.downtimes,
      notificationToFe.notificationStatusHistory
    );
    const accepted = notificationToFe.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.ACCEPTED
    );
    const effectiveDate = notificationToFe.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.EFFECTIVE_DATE
    );
    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(1);
    expect(fetchDowntimeEventsMock).toHaveBeenCalledWith(
      accepted?.activeFrom,
      effectiveDate?.activeFrom
    );
    const mainComponent = getByTestId('notification-related-downtimes-main');
    const detailComponents = getAllByTestId('notification-related-downtime-detail');
    expect(mainComponent).toBeInTheDocument();
    expect(detailComponents).toHaveLength(exampleDowntimeLogPage.downtimes.length);
    detailComponents.forEach((detail, index) => {
      const currentLog = exampleDowntimeLogPage.downtimes[index];
      testLogRendering(currentLog, detail);
    });
    const apiErrorComponent = queryByTestId('api-error-mock-api-id');
    expect(apiErrorComponent).not.toBeInTheDocument();
  });

  it('normal history - no downtimes', () => {
    const { queryByTestId } = renderComponent([], notificationToFe.notificationStatusHistory);
    const accepted = notificationToFe.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.ACCEPTED
    );
    const effectiveDate = notificationToFe.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.EFFECTIVE_DATE
    );
    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(1);
    expect(fetchDowntimeEventsMock).toHaveBeenCalledWith(
      accepted?.activeFrom,
      effectiveDate?.activeFrom
    );
    const mainComponent = queryByTestId('notification-related-downtimes-main');
    expect(mainComponent).not.toBeInTheDocument();
  });

  it('history with VIEWED status and without EFFECTIVE_DATE status', () => {
    const newMockHistory = notificationToFe.notificationStatusHistory.map((el) =>
      el.status !== NotificationStatus.EFFECTIVE_DATE
        ? el
        : { ...el, status: NotificationStatus.VIEWED }
    );
    const { getByTestId, getAllByTestId } = renderComponent(
      exampleDowntimeLogPage.downtimes,
      newMockHistory
    );
    const accepted = newMockHistory.find((s) => s.status === NotificationStatus.ACCEPTED);
    const viewed = newMockHistory.find((s) => s.status === NotificationStatus.VIEWED);
    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(1);
    expect(fetchDowntimeEventsMock).toHaveBeenCalledWith(accepted?.activeFrom, viewed?.activeFrom);
    const mainComponent = getByTestId('notification-related-downtimes-main');
    expect(mainComponent).toBeInTheDocument();
    const detailComponents = getAllByTestId('notification-related-downtime-detail');
    expect(detailComponents).toHaveLength(exampleDowntimeLogPage.downtimes.length);
  });

  it('history with VIEWED and EFFECTIVE_DATE statuses - EFFECTIVE_DATE earlier than VIEWED', () => {
    const accepted = notificationToFe.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.ACCEPTED
    );
    const effectiveDate = notificationToFe.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.EFFECTIVE_DATE
    );
    const viewedDate = new Date(effectiveDate?.activeFrom!);
    // add one second
    viewedDate.setSeconds(viewedDate.getSeconds() + 1);
    const newMockHistory = [
      ...notificationToFe.notificationStatusHistory,
      {
        status: NotificationStatus.VIEWED,
        activeFrom: viewedDate.toISOString(),
        relatedTimelineElements: [],
      },
    ];
    const { getByTestId, getAllByTestId } = renderComponent(
      exampleDowntimeLogPage.downtimes,
      newMockHistory
    );
    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(1);
    expect(fetchDowntimeEventsMock).toHaveBeenCalledWith(
      accepted?.activeFrom,
      effectiveDate?.activeFrom
    );
    const mainComponent = getByTestId('notification-related-downtimes-main');
    expect(mainComponent).toBeInTheDocument();
    const detailComponents = getAllByTestId('notification-related-downtime-detail');
    expect(detailComponents).toHaveLength(exampleDowntimeLogPage.downtimes.length);
  });

  it('history with VIEWED and EFFECTIVE_DATE statuses - EFFECTIVE_DATE later than VIEWED', () => {
    const accepted = notificationToFe.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.ACCEPTED
    );
    const effectiveDate = notificationToFe.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.EFFECTIVE_DATE
    );
    const viewedDate = new Date(effectiveDate?.activeFrom!);
    // remove one second
    viewedDate.setSeconds(viewedDate.getSeconds() - 1);
    const newMockHistory = [
      ...notificationToFe.notificationStatusHistory,
      {
        status: NotificationStatus.VIEWED,
        activeFrom: viewedDate.toISOString(),
        relatedTimelineElements: [],
      },
    ];
    const viewed = newMockHistory.find((s) => s.status === NotificationStatus.VIEWED);
    const { getByTestId, getAllByTestId } = renderComponent(
      exampleDowntimeLogPage.downtimes,
      newMockHistory
    );
    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(1);
    expect(fetchDowntimeEventsMock).toHaveBeenCalledWith(accepted?.activeFrom, viewed?.activeFrom);
    const mainComponent = getByTestId('notification-related-downtimes-main');
    expect(mainComponent).toBeInTheDocument();
    const detailComponents = getAllByTestId('notification-related-downtime-detail');
    expect(detailComponents).toHaveLength(exampleDowntimeLogPage.downtimes.length);
  });

  it('history with UNREACHABLE status and without EFFECTIVE_DATE and VIEWED', async () => {
    const newMockHistory = notificationToFe.notificationStatusHistory
      .filter((el) => el.status !== NotificationStatus.VIEWED)
      .map((el) =>
        el.status !== NotificationStatus.EFFECTIVE_DATE
          ? el
          : { ...el, status: NotificationStatus.UNREACHABLE }
      );
    const { getByTestId, getAllByTestId } = renderComponent(
      exampleDowntimeLogPage.downtimes,
      newMockHistory
    );
    const accepted = newMockHistory.find((s) => s.status === NotificationStatus.ACCEPTED);
    const unreachable = newMockHistory.find((s) => s.status === NotificationStatus.UNREACHABLE);
    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(1);
    expect(fetchDowntimeEventsMock).toHaveBeenCalledWith(
      accepted?.activeFrom,
      unreachable?.activeFrom
    );
    const mainComponent = getByTestId('notification-related-downtimes-main');
    expect(mainComponent).toBeInTheDocument();
    const detailComponents = getAllByTestId('notification-related-downtime-detail');
    expect(detailComponents).toHaveLength(exampleDowntimeLogPage.downtimes.length);
  });

  it('history with UNREACHABLE and EFFECTIVE_DATE statuses - EFFECTIVE_DATE earlier than UNREACHABLE', () => {
    const accepted = notificationToFe.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.ACCEPTED
    );
    const effectiveDate = notificationToFe.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.EFFECTIVE_DATE
    );
    const unreachableDate = new Date(effectiveDate?.activeFrom!);
    // add one second
    unreachableDate.setSeconds(unreachableDate.getSeconds() + 1);
    const newMockHistory = [
      ...notificationToFe.notificationStatusHistory,
      {
        status: NotificationStatus.UNREACHABLE,
        activeFrom: unreachableDate.toISOString(),
        relatedTimelineElements: [],
      },
    ];
    const { getByTestId, getAllByTestId } = renderComponent(
      exampleDowntimeLogPage.downtimes,
      newMockHistory
    );
    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(1);
    expect(fetchDowntimeEventsMock).toHaveBeenCalledWith(
      accepted?.activeFrom,
      effectiveDate?.activeFrom
    );
    const mainComponent = getByTestId('notification-related-downtimes-main');
    expect(mainComponent).toBeInTheDocument();
    const detailComponents = getAllByTestId('notification-related-downtime-detail');
    expect(detailComponents).toHaveLength(exampleDowntimeLogPage.downtimes.length);
  });

  it('history with UNREACHABLE and EFFECTIVE_DATE statuses - EFFECTIVE_DATE later than UNREACHABLE', () => {
    const accepted = notificationToFe.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.ACCEPTED
    );
    const effectiveDate = notificationToFe.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.EFFECTIVE_DATE
    );
    const unreachableDate = new Date(effectiveDate?.activeFrom!);
    // remove one second
    unreachableDate.setSeconds(unreachableDate.getSeconds() - 1);
    const newMockHistory = [
      ...notificationToFe.notificationStatusHistory,
      {
        status: NotificationStatus.UNREACHABLE,
        activeFrom: unreachableDate.toISOString(),
        relatedTimelineElements: [],
      },
    ];
    const unreachable = newMockHistory.find((s) => s.status === NotificationStatus.UNREACHABLE);
    const { getByTestId, getAllByTestId } = renderComponent(
      exampleDowntimeLogPage.downtimes,
      newMockHistory
    );
    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(1);
    expect(fetchDowntimeEventsMock).toHaveBeenCalledWith(
      accepted?.activeFrom,
      unreachable?.activeFrom
    );
    const mainComponent = getByTestId('notification-related-downtimes-main');
    expect(mainComponent).toBeInTheDocument();
    const detailComponents = getAllByTestId('notification-related-downtime-detail');
    expect(detailComponents).toHaveLength(exampleDowntimeLogPage.downtimes.length);
  });

  it('history does not include ACCEPTED status', () => {
    const newMockHistory = notificationToFe.notificationStatusHistory.filter(
      (el) => el.status !== NotificationStatus.ACCEPTED
    );
    const { queryByTestId } = renderComponent(exampleDowntimeLogPage.downtimes, newMockHistory);
    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(0);
    const mainComponent = queryByTestId('notification-related-downtimes-main');
    expect(mainComponent).not.toBeInTheDocument();
  });

  it('cancelled modification', async () => {
    const newMockHistory = _.cloneDeep(notificationToFe.notificationStatusHistory);
    newMockHistory[0].status = NotificationStatus.CANCELLED;
    const { queryByTestId } = renderComponent(exampleDowntimeLogPage.downtimes, newMockHistory);
    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(0);
    const mainComponent = queryByTestId('notification-related-downtimes-main');
    expect(mainComponent).not.toBeInTheDocument();
  });

  it('history with ACCEPTED status later than EFFECTIVE_DATE', () => {
    const effectiveDate = notificationToFe.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.EFFECTIVE_DATE
    );
    const acceptedDate = new Date(effectiveDate?.activeFrom!);
    // add one second
    acceptedDate.setSeconds(acceptedDate.getSeconds() + 1);
    const newMockHistory = notificationToFe.notificationStatusHistory.map((el) =>
      el.status !== NotificationStatus.ACCEPTED
        ? el
        : { ...el, activeFrom: acceptedDate.toISOString() }
    );
    const { queryByTestId } = renderComponent(exampleDowntimeLogPage.downtimes, newMockHistory);
    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(0);
    const mainComponent = queryByTestId('notification-related-downtimes-main');
    expect(mainComponent).not.toBeInTheDocument();
  });
});
