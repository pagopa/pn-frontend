import React from 'react';

import { render } from '@testing-library/react';

import { NotificationDetail, NotificationStatus, TimelineCategory } from '../../types';
import { parsedNotification } from '../../utils/__test__/test-utils';
import { useIsCancelled } from '../useIsCancelled';

interface Props {
  notification: NotificationDetail;
}
const Component: React.FC<Props> = ({ notification }) => {
  const { cancellationInProgress, cancellationInTimeline, cancelled } = useIsCancelled({
    notification,
  });
  return (
    <div>
      <p data-testid="cancellationInProgress">{`${cancellationInProgress}`}</p>
      <p data-testid="cancellationInTimeline">{`${cancellationInTimeline}`}</p>
      <p data-testid="cancelled">{`${cancelled}`}</p>
    </div>
  );
};

describe('useIsCancelled test', () => {
  it("notification isn't cancelled", () => {
    const { getByTestId } = render(<Component notification={parsedNotification} />);

    expect(getByTestId('cancellationInProgress')).toHaveTextContent('false');
    expect(getByTestId('cancellationInTimeline')).toHaveTextContent('false');
    expect(getByTestId('cancelled')).toHaveTextContent('false');
  });
  it('notification is cancelled', () => {
    const { getByTestId } = render(
      <Component
        notification={{ ...parsedNotification, notificationStatus: NotificationStatus.CANCELLED }}
      />
    );

    expect(getByTestId('cancellationInProgress')).toHaveTextContent('false');
    expect(getByTestId('cancellationInTimeline')).toHaveTextContent('false');
    expect(getByTestId('cancelled')).toHaveTextContent('true');
  });
  it('notification is cancelled', () => {
    const { getByTestId } = render(
      <Component
        notification={{
          ...parsedNotification,
          notificationStatus: NotificationStatus.CANCELLATION_IN_PROGRESS,
        }}
      />
    );

    expect(getByTestId('cancellationInProgress')).toHaveTextContent('true');
    expect(getByTestId('cancellationInTimeline')).toHaveTextContent('false');
    expect(getByTestId('cancelled')).toHaveTextContent('false');
  });
  it('notification is cancelled', () => {
    const { getByTestId } = render(
      <Component
        notification={{
          ...parsedNotification,
          timeline: [
            ...parsedNotification.timeline,
            {
              elementId: 'NOTIFICATION_CANCELLATION_REQUEST.HYTD-ERPH-WDUE-202308-H-1',
              timestamp: '2033-08-14T13:42:54.17675939Z',
              legalFactsIds: [],
              category: TimelineCategory.NOTIFICATION_CANCELLATION_REQUEST,
              details: {},
            },
          ],
        }}
      />
    );

    expect(getByTestId('cancellationInProgress')).toHaveTextContent('false');
    expect(getByTestId('cancellationInTimeline')).toHaveTextContent('true');
    expect(getByTestId('cancelled')).toHaveTextContent('false');
  });
});
