import { NotificationStatus } from '../../../../models/NotificationStatus';
import { getTimelineItemPresentation } from '../notificationTimelineStatus.config';

describe('notificationTimelineStatus config', () => {
  it('keeps the variant of a status only when it is the first of the timeline', () => {
    const asFirst = getTimelineItemPresentation(NotificationStatus.PAID, true);
    const asFollowing = getTimelineItemPresentation(NotificationStatus.PAID, false);

    expect(asFirst.variant).toBe('success');
    expect(asFollowing.variant).toBe('normal');
    expect(asFollowing.icon).toBe(asFirst.icon);
  });

  it('keeps the warning variant of the reworked status wherever it is in the timeline', () => {
    expect(
      getTimelineItemPresentation(NotificationStatus.NOTIFICATION_TIMELINE_REWORKED, false).variant
    ).toBe('warning');
  });

  it('falls back to the default presentation for a status without configuration', () => {
    const unmappedStatus = getTimelineItemPresentation(NotificationStatus.REFUSED, true);

    expect(unmappedStatus.variant).toBe('normal');
    expect(unmappedStatus.icon).toBeDefined();
  });
});
