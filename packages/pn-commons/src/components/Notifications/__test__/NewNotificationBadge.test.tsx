import React from 'react';

import { NotificationStatus } from '@pagopa-pn/pn-commons';

import { render } from '../../../test-utils';
import NewNotificationBadge from '../NewNotificationBadge';

describe('NewNotificationBadge component', () => {
  it('returns the component if notification status is accepted', () => {
    const notificationStatus = NotificationStatus.ACCEPTED;
    const { getByTestId } = render(<NewNotificationBadge status={notificationStatus} />);
    const badge = getByTestId('new-notification-badge');
    expect(badge).toBeInTheDocument();
  });

  it('does not return the component if notification status is viewed', () => {
    const notificationStatus = NotificationStatus.VIEWED;
    const { queryByTestId } = render(<NewNotificationBadge status={notificationStatus} />);
    const badge = queryByTestId('new-notification-badge');
    expect(badge).not.toBeInTheDocument();
  });
});
