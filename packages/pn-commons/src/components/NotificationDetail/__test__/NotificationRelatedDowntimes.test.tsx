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
      "status": NotificationStatus.VIEWED_AFTER_DEADLINE,
      "activeFrom": "2023-01-27T12:14:23Z",
      "relatedTimelineElements": [],
      "steps": []
  },
  {
      "status": NotificationStatus.EFFECTIVE_DATE,
      "activeFrom": "2022-10-30T13:59:23Z",
      "relatedTimelineElements": [],
      "steps": []
  },
  {
      "status": NotificationStatus.DELIVERED,
      "activeFrom": "2022-10-04T13:56:16Z",
      "relatedTimelineElements": [],
      "steps": []
  },
  {
      "status": NotificationStatus.DELIVERING,
      "activeFrom": "2022-10-04T13:55:52Z",
      "relatedTimelineElements": [],
      "steps": []
  },
  {
      "status": NotificationStatus.ACCEPTED,
      "activeFrom": "2022-10-04T13:54:47Z",
      "relatedTimelineElements": [],
      "steps": []
  }
]



describe('NotificationRelatedDowntimes component', () => {
  it('appear - with two downtimes', async () => {
    await act(
      async () =>
        void render(
          <NotificationRelatedDowntimes
            downtimeEvents={mockDowntimes}
            fetchDowntimeEvents={() => {}}  // qui va un mock, chiedi aiuto ai colleghi
            notificationStatusHistory={mockHistory}
          />
        )
    );
    
    // testare che il mock è stato chiamato esattamente una volta con ("2022-10-04T13:54:47Z", "2022-10-30T13:59:23Z")

    const mainComponent = screen.queryByTestId('notification-related-downtimes-main');
    const detailComponents = screen.queryAllByTestId('notification-related-downtime-detail');
    expect(mainComponent).toBeInTheDocument();
    expect(detailComponents).toHaveLength(2);

    // testare che dentro detailComponents[0] ci sia "28/10/2022" oppure mockDowntimes[0].startDate formattato 
    // testare che dentro detailComponents[1] ci sia "23/10/2022" oppure mockDowntimes[1].startDate formattato 
  });

  // altri test
  // - se togli il ACCEPTED: non ci deve essere "notification-related-downtimes-main"  ... .not.toBeInTheDocument();
  // - se modifichi VIEWED_AFTER_DEADLINE con VIEWED e togli il EFFECTIVE_DATE: il mock va chiamato con ("2022-10-04T13:54:47Z", "2023-01-27T12:14:23Z") e ci sono i due 'notification-related-downtime-detail'
  // - se modifichi VIEWED_AFTER_DEADLINE con CANCELLED: non ci deve essere "notification-related-downtimes-main"
});

