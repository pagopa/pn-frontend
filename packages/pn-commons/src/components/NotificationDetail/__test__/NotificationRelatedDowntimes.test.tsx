import React from 'react';

import { mockDowntimes, mockHistory } from '../../../__mocks__/NotificationDetail.mock';
import { Downtime, DowntimeStatus, KnownFunctionality } from '../../../models';
import { RenderResult, act, render, screen, within } from '../../../test-utils';
import { IAppMessage, NotificationStatus, NotificationStatusHistory } from '../../../types';
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

describe('NotificationRelatedDowntimes component', () => {
  let fetchDowntimeEventsMock: jest.Mock<any, any>;

  beforeEach(async () => {
    fetchDowntimeEventsMock = jest.fn();
  });

  async function renderComponent(
    downtimes: Array<Downtime>,
    history: NotificationStatusHistory[],
    setApiError?: boolean
  ) {
    await act(async () => {
      void render(
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
    });
  }

  it('normal history - with two downtimes', async () => {
    await renderComponent(mockDowntimes, mockHistory);

    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(1);
    expect(fetchDowntimeEventsMock).toHaveBeenCalledWith(
      mockHistory[3].activeFrom,
      mockHistory[0].activeFrom
    );

    const mainComponent = screen.getByTestId('notification-related-downtimes-main');
    const detailComponents = screen.getAllByTestId('notification-related-downtime-detail');
    expect(mainComponent).toBeInTheDocument();
    expect(detailComponents).toHaveLength(2);

    const startDate0 = within(detailComponents[0]).getByText(
      new RegExp(mockDowntimes[0].startDate)
    );
    const endDate0 = within(detailComponents[0]).getByText(
      new RegExp(mockDowntimes[0].endDate as string)
    );
    const funct0 = within(detailComponents[0]).getByText(
      new RegExp(mockDowntimes[0].knownFunctionality as string)
    );
    const startDate1 = within(detailComponents[0]).queryByText(
      new RegExp(mockDowntimes[1].startDate)
    );
    expect(startDate0).toBeInTheDocument();
    expect(endDate0).toBeInTheDocument();
    expect(funct0).toBeInTheDocument();
    expect(startDate1).not.toBeInTheDocument();
    expect(startDate0).toEqual(endDate0);
    expect(startDate0).not.toEqual(funct0);

    expect(detailComponents[1]).toHaveTextContent(mockDowntimes[1].startDate);
    expect(detailComponents[1]).toHaveTextContent(mockDowntimes[1].endDate as string);
    expect(detailComponents[1]).toHaveTextContent(mockDowntimes[1].knownFunctionality as string);

    const apiErrorComponent = screen.queryByTestId('api-error-mock-api-id');
    expect(apiErrorComponent).not.toBeInTheDocument();
  });

  it('normal history - one complete downtime, one not finished, one finished but yet without link', async () => {
    const newDowntimes = [...mockDowntimes];
    // downtime #0 - not finished
    newDowntimes[0].status = DowntimeStatus.KO;
    delete newDowntimes[0].endDate;
    newDowntimes[0].fileAvailable = false;

    // downtime #1 - finished, file not available
    newDowntimes[1].fileAvailable = false;

    // downtime #2 - finished, file available
    newDowntimes.push({
      rawFunctionality: KnownFunctionality.NotificationWorkflow,
      knownFunctionality: KnownFunctionality.NotificationWorkflow,
      status: DowntimeStatus.OK,
      startDate: '2022-09-28T10:11:09Z',
      endDate: '2022-09-28T10:18:14Z',
      fileAvailable: true,
    });

    await renderComponent(newDowntimes, mockHistory);

    const mainComponent = screen.getByTestId('notification-related-downtimes-main');
    const detailComponents = screen.getAllByTestId('notification-related-downtime-detail');
    expect(mainComponent).toBeInTheDocument();
    expect(detailComponents).toHaveLength(3);

    // downtime #0 - message with just start date, no link
    // check also the startDate since this case is not covered in the previous test
    expect(detailComponents[0]).toHaveTextContent('Disservizio iniziato il');
    expect(detailComponents[0]).toHaveTextContent(mockDowntimes[0].startDate);
    const fileNotAvailableLegend0 = within(detailComponents[0]).getByText('File non disponibile');
    const button0 = within(detailComponents[0]).queryByRole('button');
    expect(fileNotAvailableLegend0).toBeInTheDocument();
    expect(fileNotAvailableLegend0).toHaveStyle({ color: fakePalette.text.secondary });
    expect(button0).not.toBeInTheDocument();

    // downtime #1 - message with start and end dates, no link
    expect(detailComponents[1]).toHaveTextContent('Disservizio dal');
    const fileNotAvailableLegend1 = within(detailComponents[1]).getByText('File non disponibile');
    const button1 = within(detailComponents[1]).queryByRole('button');
    expect(fileNotAvailableLegend1).toBeInTheDocument();
    expect(button1).not.toBeInTheDocument();

    // downtime #2 - message with start and end dates, link
    expect(detailComponents[2]).toHaveTextContent('Disservizio dal');
    const fileNotAvailableLegend2 = within(detailComponents[2]).queryByText('File non disponibile');
    const button2 = within(detailComponents[2]).getByRole('button');
    expect(fileNotAvailableLegend2).not.toBeInTheDocument();
    expect(button2).toBeInTheDocument();
  });

  it('normal history - no downtimes', async () => {
    await renderComponent([], mockHistory);

    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(1);
    expect(fetchDowntimeEventsMock).toHaveBeenCalledWith(
      mockHistory[3].activeFrom,
      mockHistory[0].activeFrom
    );

    const mainComponent = screen.queryByTestId('notification-related-downtimes-main');
    expect(mainComponent).not.toBeInTheDocument();
  });

  it('notification history does not include ACCEPTED status', async () => {
    const mockHistoryWithoutAcceptedStatus = mockHistory.filter(
      (el) => el.status !== NotificationStatus.ACCEPTED
    );
    await renderComponent(mockDowntimes, mockHistoryWithoutAcceptedStatus);

    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(0);
    const mainComponent = screen.queryByTestId('notification-related-downtimes-main');
    expect(mainComponent).not.toBeInTheDocument();
  });

  it('cancelled modification', async () => {
    const newMockHistory = [...mockHistory];
    newMockHistory[0].status = NotificationStatus.CANCELLED;
    await renderComponent(mockDowntimes, newMockHistory);

    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(0);
    const mainComponent = screen.queryByTestId('notification-related-downtimes-main');
    expect(mainComponent).not.toBeInTheDocument();
  });

  it('history with VIEWED status', async () => {
    const newMockHistory = mockHistory.filter(
      (el) => el.status != NotificationStatus.EFFECTIVE_DATE
    );
    newMockHistory[0].status = NotificationStatus.VIEWED;
    await renderComponent(mockDowntimes, newMockHistory);

    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(1);
    expect(fetchDowntimeEventsMock).toHaveBeenCalledWith(
      mockHistory[3].activeFrom,
      mockHistory[0].activeFrom
    );
    const mainComponent = screen.getByTestId('notification-related-downtimes-main');
    expect(mainComponent).toBeInTheDocument();
    const detailComponents = screen.getAllByTestId('notification-related-downtime-detail');
    expect(detailComponents).toHaveLength(2);
  });

  it('history with UNREACHABLE status', async () => {
    const newMockHistory = [...mockHistory];
    newMockHistory[2].status = NotificationStatus.UNREACHABLE;
    await renderComponent(mockDowntimes, newMockHistory);

    expect(fetchDowntimeEventsMock).toHaveBeenCalledTimes(1);
    expect(fetchDowntimeEventsMock).toHaveBeenCalledWith(
      mockHistory[3].activeFrom,
      mockHistory[2].activeFrom
    );
    const mainComponent = screen.getByTestId('notification-related-downtimes-main');
    expect(mainComponent).toBeInTheDocument();
  });
});
