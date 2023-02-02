import React from 'react';
import { act, screen } from '@testing-library/react';
import { render } from '../../../test-utils';
import NotificationRelatedDowntimes from '../NotificationRelatedDowntimes';
import { Downtime, DowntimeStatus, KnownFunctionality } from '../../../models';
import { NotificationStatus, NotificationStatusHistory } from '../../../types';

const mockDowntimes: Array<Downtime> = [
  {
    rawFunctionality: KnownFunctionality.NotificationWorkflow,
    knownFunctionality: KnownFunctionality.NotificationWorkflow,
    status: DowntimeStatus.OK,
    startDate: '2022-10-28T10:11:09Z',
    endDate: '2022-10-28T10:18:14Z',
    fileAvailable: false,
  },
  {
    rawFunctionality: KnownFunctionality.NotificationCreate,
    knownFunctionality: KnownFunctionality.NotificationCreate,
    status: DowntimeStatus.OK,
    startDate: '2022-10-23T15:50:04Z',
    endDate: '2022-10-23T15:51:12Z',
    legalFactId: 'some-legal-fact-id',
    fileAvailable: true,
  },
];

const mockHistory: NotificationStatusHistory[] = [
  {
    status: NotificationStatus.VIEWED_AFTER_DEADLINE,
    activeFrom: '2023-01-27T12:14:23Z',
    relatedTimelineElements: [],
    steps: [],
  },
  {
    status: NotificationStatus.EFFECTIVE_DATE,
    activeFrom: '2022-10-30T13:59:23Z',
    relatedTimelineElements: [],
    steps: [],
  },
  {
    status: NotificationStatus.DELIVERED,
    activeFrom: '2022-10-04T13:56:16Z',
    relatedTimelineElements: [],
    steps: [],
  },
  {
    status: NotificationStatus.DELIVERING,
    activeFrom: '2022-10-04T13:55:52Z',
    relatedTimelineElements: [],
    steps: [],
  },
  {
    status: NotificationStatus.ACCEPTED,
    activeFrom: '2022-10-04T13:54:47Z',
    relatedTimelineElements: [],
    steps: [],
  },
];

describe('NotificationRelatedDowntimes component', () => {
  it('appear - with two downtimes', async () => {
    await act(
      async () =>
        void render(
          <NotificationRelatedDowntimes
            downtimeEvents={mockDowntimes}
            fetchDowntimeEvents={() => {}} // qui va un mock, chiedi aiuto ai colleghi
            notificationStatusHistory={mockHistory}
          />
        )
    );

    // testare che il mock è stato chiamato esattamente una volta con ("2022-10-04T13:54:47Z", "2022-10-30T13:59:23Z")

    const mainComponent = screen.queryByTestId('notification-related-downtimes-main');
    const detailComponents = screen.queryAllByTestId('notification-related-downtime-detail');
    expect(mainComponent).toBeInTheDocument();
    expect(detailComponents).toHaveLength(2);
    expect(detailComponents[0]).toHaveTextContent(mockDowntimes[0].startDate);
    expect(detailComponents[1]).toHaveTextContent(mockDowntimes[1].startDate);
  });

  it('test with deleted accepted', async () => {
    const mockHistoryWithoutAcceptedStatus = mockHistory.filter(
      (el) => el.status != NotificationStatus.ACCEPTED
    );
    await act(
      async () =>
        void render(
          <NotificationRelatedDowntimes
            downtimeEvents={mockDowntimes}
            fetchDowntimeEvents={() => {}} // qui va un mock, chiedi aiuto ai colleghi
            notificationStatusHistory={mockHistoryWithoutAcceptedStatus}
          />
        )
    );
    const mainComponent = screen.queryByTestId('notification-related-downtimes-main');
    expect(mainComponent).not.toBeInTheDocument();
  });

  it('test with CANCELLED status', async () => {
    const newMockHistory = [...mockHistory];
    newMockHistory[0].status = NotificationStatus.CANCELLED;
    await act(
      async () =>
        void render(
          <NotificationRelatedDowntimes
            downtimeEvents={mockDowntimes}
            fetchDowntimeEvents={() => {}} // qui va un mock, chiedi aiuto ai colleghi
            notificationStatusHistory={newMockHistory}
          />
        )
    );
    const mainComponent = screen.queryByTestId('notification-related-downtimes-main');
    expect(mainComponent).not.toBeInTheDocument();
  });
  // altri test
  it('test with VIEWED status and double notification related', async () => {
    mockHistory[0].status = NotificationStatus.VIEWED;
    const newMockHistory = mockHistory.filter(
      (el) => el.status != NotificationStatus.EFFECTIVE_DATE
    );
    await act(
      async () =>
        void render(
          <NotificationRelatedDowntimes
            downtimeEvents={mockDowntimes}
            fetchDowntimeEvents={() => {}} // qui va un mock, chiedi aiuto ai colleghi
            notificationStatusHistory={newMockHistory}
          />
        )
    );
    const detailComponents = screen.queryAllByTestId('notification-related-downtime-detail');
    expect(detailComponents).toHaveLength(2);
  });
});
