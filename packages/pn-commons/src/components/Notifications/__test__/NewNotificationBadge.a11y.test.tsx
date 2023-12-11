import { axe } from 'jest-axe';
import React from 'react';

import { NotificationStatus } from '@pagopa-pn/pn-commons';

import { render } from '../../../test-utils';
import NewNotificationBadge from '../NewNotificationBadge';

describe('NewNotificationBadge component - accessibility tests', () => {
  it('is accessible', async () => {
    const notificationStatus = NotificationStatus.ACCEPTED;
    const { container } = render(<NewNotificationBadge status={notificationStatus} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
