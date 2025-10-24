import _ from 'lodash';
import { vi } from 'vitest';

import { beDowntimeHistoryWithIncidents } from '../../../__mocks__/AppStatus.mock';
import { notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { IAppMessage } from '../../../models/AppMessage';
import { Downtime } from '../../../models/AppStatus';
import { NotificationStatusHistory } from '../../../models/NotificationDetail';
import { NotificationStatus } from '../../../models/NotificationStatus';
import { RenderResult, initLocalizationForTest, render, within } from '../../../test-utils';
import { formatDate, isToday } from '../../../utility/date.utility';
import { LANGUAGE_SESSION_KEY } from '../../../utility/multilanguage.utility';
import NotificationRelatedDowntimes from '../NotificationRelatedDowntimes';

const fakePalette = {
  success: { main: '#00FF00' },
  error: { main: '#FF0000' },
  text: { primary: '#AAAAAA', secondary: '#BBBBBB' },
};

vi.mock('@mui/material', async () => {
  const original = await vi.importActual<any>('@mui/material');
  return {
    ...original,
    useTheme: () => ({ ...original.useTheme(), palette: fakePalette }),
  };
});

const fetchDowntimeEventsMock = vi.fn();

const errors: Array<IAppMessage> = [
  {
    id: 'getNotificationDowntimeHistory',
    blocking: false,
    message: 'Mocked message',
    title: 'Mocked title',
    showTechnicalData: false,
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
      apiId="getNotificationDowntimeHistory"
      fetchDowntimeLegalFactDocumentDetails={() => {}}
      downtimeExampleLink=""
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
  if (currentLog.functionality) {
    expect(elem).toHaveTextContent(
      `appStatus - legends.knownFunctionality.${currentLog.functionality}`
    );
  } else {
    expect(elem).toHaveTextContent(
      `appStatus - legends.unknownFunctionality - ${JSON.stringify({
        functionality: currentLog.functionality,
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
    vi.clearAllMocks();
  });

  it('normal history - one complete downtime, one not finished, one finished but yet without link', () => {
    const { getByTestId, getAllByTestId, queryByTestId } = renderComponent(
      beDowntimeHistoryWithIncidents.result,
      notificationDTO.notificationStatusHistory
    );
    const accepted = notificationDTO.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.ACCEPTED
    );
    const effectiveDate = notificationDTO.notificationStatusHistory.find(
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
    expect(detailComponents).toHaveLength(beDowntimeHistoryWithIncidents.result.length);
    detailComponents.forEach((detail, index) => {
      const currentLog = beDowntimeHistoryWithIncidents.result[index];
      testLogRendering(currentLog, detail);
    });
    const apiErrorComponent = queryByTestId('api-error-mock-api-id');
    expect(apiErrorComponent).not.toBeInTheDocument();
  });

  it('normal history - no downtimes', () => {
    const { queryByTestId } = renderComponent([], notificationDTO.notificationStatusHistory);
    const accepted = notificationDTO.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.ACCEPTED
    );
    const effectiveDate = notificationDTO.notificationStatusHistory.find(
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
    const newMockHistory = notificationDTO.notificationStatusHistory.map((el) =>
      el.status !== NotificationStatus.EFFECTIVE_DATE
        ? el
        : { ...el, status: NotificationStatus.VIEWED }
    );
    const { getByTestId, getAllByTestId } = renderComponent(
      beDowntimeHistoryWithIncidents.result,
      newMockHistory
    );
    const accepted = newMockHistory.find((s) => s.status === NotificationStatus.ACCEPTED);
    const viewed = newMockHistory.find((s) => s.status === NotificationStatus.VIEWED);
    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(1);
    expect(fetchDowntimeEventsMock).toHaveBeenCalledWith(accepted?.activeFrom, viewed?.activeFrom);
    const mainComponent = getByTestId('notification-related-downtimes-main');
    expect(mainComponent).toBeInTheDocument();
    const detailComponents = getAllByTestId('notification-related-downtime-detail');
    expect(detailComponents).toHaveLength(beDowntimeHistoryWithIncidents.result.length);
  });

  it('history with VIEWED and EFFECTIVE_DATE statuses - EFFECTIVE_DATE earlier than VIEWED', () => {
    const accepted = notificationDTO.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.ACCEPTED
    );
    const effectiveDate = notificationDTO.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.EFFECTIVE_DATE
    );
    const viewedDate = new Date(effectiveDate?.activeFrom!);
    // add one second
    viewedDate.setSeconds(viewedDate.getSeconds() + 1);
    const newMockHistory = [
      ...notificationDTO.notificationStatusHistory,
      {
        status: NotificationStatus.VIEWED,
        activeFrom: viewedDate.toISOString(),
        relatedTimelineElements: [],
      },
    ];
    const { getByTestId, getAllByTestId } = renderComponent(
      beDowntimeHistoryWithIncidents.result,
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
    expect(detailComponents).toHaveLength(beDowntimeHistoryWithIncidents.result.length);
  });

  it('history with VIEWED and EFFECTIVE_DATE statuses - EFFECTIVE_DATE later than VIEWED', () => {
    const accepted = notificationDTO.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.ACCEPTED
    );
    const effectiveDate = notificationDTO.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.EFFECTIVE_DATE
    );
    const viewedDate = new Date(effectiveDate?.activeFrom!);
    // remove one second
    viewedDate.setSeconds(viewedDate.getSeconds() - 1);
    const newMockHistory = [
      ...notificationDTO.notificationStatusHistory,
      {
        status: NotificationStatus.VIEWED,
        activeFrom: viewedDate.toISOString(),
        relatedTimelineElements: [],
      },
    ];
    const viewed = newMockHistory.find((s) => s.status === NotificationStatus.VIEWED);
    const { getByTestId, getAllByTestId } = renderComponent(
      beDowntimeHistoryWithIncidents.result,
      newMockHistory
    );
    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(1);
    expect(fetchDowntimeEventsMock).toHaveBeenCalledWith(accepted?.activeFrom, viewed?.activeFrom);
    const mainComponent = getByTestId('notification-related-downtimes-main');
    expect(mainComponent).toBeInTheDocument();
    const detailComponents = getAllByTestId('notification-related-downtime-detail');
    expect(detailComponents).toHaveLength(beDowntimeHistoryWithIncidents.result.length);
  });

  it('history with UNREACHABLE status and without EFFECTIVE_DATE and VIEWED', async () => {
    const newMockHistory = notificationDTO.notificationStatusHistory
      .filter((el) => el.status !== NotificationStatus.VIEWED)
      .map((el) =>
        el.status !== NotificationStatus.EFFECTIVE_DATE
          ? el
          : { ...el, status: NotificationStatus.UNREACHABLE }
      );
    const { getByTestId, getAllByTestId } = renderComponent(
      beDowntimeHistoryWithIncidents.result,
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
    expect(detailComponents).toHaveLength(beDowntimeHistoryWithIncidents.result.length);
  });

  it('history with UNREACHABLE and EFFECTIVE_DATE statuses - EFFECTIVE_DATE earlier than UNREACHABLE', () => {
    const accepted = notificationDTO.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.ACCEPTED
    );
    const effectiveDate = notificationDTO.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.EFFECTIVE_DATE
    );
    const unreachableDate = new Date(effectiveDate?.activeFrom!);
    // add one second
    unreachableDate.setSeconds(unreachableDate.getSeconds() + 1);
    const newMockHistory = [
      ...notificationDTO.notificationStatusHistory,
      {
        status: NotificationStatus.UNREACHABLE,
        activeFrom: unreachableDate.toISOString(),
        relatedTimelineElements: [],
      },
    ];
    const { getByTestId, getAllByTestId } = renderComponent(
      beDowntimeHistoryWithIncidents.result,
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
    expect(detailComponents).toHaveLength(beDowntimeHistoryWithIncidents.result.length);
  });

  it('history with UNREACHABLE and EFFECTIVE_DATE statuses - EFFECTIVE_DATE later than UNREACHABLE', () => {
    const accepted = notificationDTO.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.ACCEPTED
    );
    const effectiveDate = notificationDTO.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.EFFECTIVE_DATE
    );
    const unreachableDate = new Date(effectiveDate?.activeFrom!);
    // remove one second
    unreachableDate.setSeconds(unreachableDate.getSeconds() - 1);
    const newMockHistory = [
      ...notificationDTO.notificationStatusHistory,
      {
        status: NotificationStatus.UNREACHABLE,
        activeFrom: unreachableDate.toISOString(),
        relatedTimelineElements: [],
      },
    ];
    const unreachable = newMockHistory.find((s) => s.status === NotificationStatus.UNREACHABLE);
    const { getByTestId, getAllByTestId } = renderComponent(
      beDowntimeHistoryWithIncidents.result,
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
    expect(detailComponents).toHaveLength(beDowntimeHistoryWithIncidents.result.length);
  });

  it('history does not include ACCEPTED status', () => {
    const newMockHistory = notificationDTO.notificationStatusHistory.filter(
      (el) => el.status !== NotificationStatus.ACCEPTED
    );
    const { queryByTestId } = renderComponent(
      beDowntimeHistoryWithIncidents.result,
      newMockHistory
    );
    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(0);
    const mainComponent = queryByTestId('notification-related-downtimes-main');
    expect(mainComponent).not.toBeInTheDocument();
  });

  it('cancelled modification', async () => {
    const newMockHistory = _.cloneDeep(notificationDTO.notificationStatusHistory);
    newMockHistory[0].status = NotificationStatus.CANCELLED;
    const { queryByTestId } = renderComponent(
      beDowntimeHistoryWithIncidents.result,
      newMockHistory
    );
    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(0);
    const mainComponent = queryByTestId('notification-related-downtimes-main');
    expect(mainComponent).not.toBeInTheDocument();
  });

  it('history with ACCEPTED status later than EFFECTIVE_DATE', () => {
    const effectiveDate = notificationDTO.notificationStatusHistory.find(
      (s) => s.status === NotificationStatus.EFFECTIVE_DATE
    );
    const acceptedDate = new Date(effectiveDate?.activeFrom!);
    // add one second
    acceptedDate.setSeconds(acceptedDate.getSeconds() + 1);
    const newMockHistory = notificationDTO.notificationStatusHistory.map((el) =>
      el.status !== NotificationStatus.ACCEPTED
        ? el
        : { ...el, activeFrom: acceptedDate.toISOString() }
    );
    const { queryByTestId } = renderComponent(
      beDowntimeHistoryWithIncidents.result,
      newMockHistory
    );
    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(0);
    const mainComponent = queryByTestId('notification-related-downtimes-main');
    expect(mainComponent).not.toBeInTheDocument();
  });

  it('should show downtime language banner if language is not italian', () => {
    sessionStorage.setItem(LANGUAGE_SESSION_KEY, 'en');
    const { getByTestId } = renderComponent(
      beDowntimeHistoryWithIncidents.result,
      notificationDTO.notificationStatusHistory
    );
    const languageBanner = getByTestId('downtimeLanguageBanner');
    expect(languageBanner).toBeInTheDocument();
  });

  it('should not show downtime language banner if language is italian', () => {
    sessionStorage.setItem(LANGUAGE_SESSION_KEY, 'it');
    const { queryByTestId } = renderComponent(
      beDowntimeHistoryWithIncidents.result,
      notificationDTO.notificationStatusHistory
    );
    const languageBanner = queryByTestId('downtimeLanguageBanner');
    expect(languageBanner).not.toBeInTheDocument();
  });
});
