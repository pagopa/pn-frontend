import { NotificationStatus } from '@pagopa-pn/pn-commons';
import { render } from '../../../__test__/test-utils';
import { getNewNotificationBadge } from '../NewNotificationBadge';

describe('NewNotificationBadge component', () => {
  it('returns the component if notification status is accepted', () => {
    const notificationStatus = NotificationStatus.ACCEPTED;

    const result = render(<>{getNewNotificationBadge(notificationStatus)}</>);

    const badge = result.getByRole('status');
    expect(badge).toBeInTheDocument();
  });

  it('does not return the component if notification status is viewed', () => {
    const notificationStatus = NotificationStatus.VIEWED;

    const result = render(<>{getNewNotificationBadge(notificationStatus)}</>);

    const badge = result.queryByRole('status');
    expect(badge).not.toBeInTheDocument();
  });
});
