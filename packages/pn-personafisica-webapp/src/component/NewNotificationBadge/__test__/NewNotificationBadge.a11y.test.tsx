import { NotificationStatus } from '@pagopa-pn/pn-commons';
import { axe, render } from '../../../__test__/test-utils';
import { getNewNotificationBadge } from '../NewNotificationBadge';

describe('NewNotificationBadge component - accessibility tests', () => {
  it('is accessible', async()=>{
    const notificationStatus = NotificationStatus.ACCEPTED;
    const result = render(<>{getNewNotificationBadge(notificationStatus)}</>);
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
