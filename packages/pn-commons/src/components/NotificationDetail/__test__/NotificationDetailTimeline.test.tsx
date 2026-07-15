import { notificationDTO } from '../../../__mocks__/NotificationDetail.mock';
import { NotificationStatus } from '../../../models';
import { ReworkedStatus } from '../../../models/NotificationDetail';
import { createMatchMedia, render } from '../../../test-utils';
import NotificationDetailTimeline from '../NotificationDetailTimeline';

describe('NotificationDetailTimeline', () => {
  // Define mock data for props
  const recipients = notificationDTO.recipients;
  const statusHistory = notificationDTO.notificationStatusHistory;
  const showMoreButtonLabel = 'Show More';
  const showLessButtonLabel = 'Show Less';

  it('renders component', () => {
    const { queryByTestId } = render(
      <NotificationDetailTimeline
        recipients={recipients}
        statusHistory={statusHistory}
        showMoreButtonLabel={showMoreButtonLabel}
        showLessButtonLabel={showLessButtonLabel}
        clickHandler={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(queryByTestId('NotificationDetailTimeline')).toBeInTheDocument();
  });

  it('renders macro step with tag reworked', () => {
    window.matchMedia = createMatchMedia(1920);
    const { container } = render(
      <NotificationDetailTimeline
        recipients={[]}
        statusHistory={[
          {
            status: NotificationStatus.NOTIFICATION_TIMELINE_REWORKED,
            activeFrom: '2023-01-03T00:00:00Z',
            relatedTimelineElements: [],
          },
          {
            status: NotificationStatus.DELIVERED,
            activeFrom: '2023-01-01T00:00:00Z',
            relatedTimelineElements: [],
            reworkedStatus: ReworkedStatus.VALID,
          },
          {
            status: NotificationStatus.EFFECTIVE_DATE,
            activeFrom: '2023-01-02T00:00:00Z',
            relatedTimelineElements: [],
            reworkedStatus: ReworkedStatus.NOT_VALID,
          },
        ]}
        showMoreButtonLabel={''}
        showLessButtonLabel={''}
        clickHandler={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(container).toHaveTextContent('status.notification-timeline-reworked');
    expect(container).toHaveTextContent('status.reworked-status-valid');
    expect(container).toHaveTextContent('status.reworked-status-not-valid');
  });
});
