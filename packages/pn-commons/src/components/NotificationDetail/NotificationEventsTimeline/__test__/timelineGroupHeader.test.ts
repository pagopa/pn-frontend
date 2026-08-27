import { NotificationStatus } from '../../../../models';
import {
  NotificationTimelineGroup,
  NotificationTimelineStatusHistory,
  TimelineEventsChannel,
} from '../../../../models/NotificationTimeline';
import { getMultiAttemptGroupIds, getTimelineGroupHeader } from '../timelineGroupHeader.config';

const analogGroup = (
  groupId: string,
  attempt: number,
  channel: TimelineEventsChannel = TimelineEventsChannel.AR_REGISTERED_LETTER
): NotificationTimelineGroup => ({
  groupId,
  denomination: 'Utente Test Uno',
  taxId: 'TSTUTN00A07A001G',
  recIndex: 0,
  category: 'ANALOG',
  channel: channel,
  attempt,
  hasReworkedEvents: false,
  events: [],
});

const statusHistoryWithGroups = (
  groups: Array<NotificationTimelineGroup>
): Array<NotificationTimelineStatusHistory> => [
  {
    status: NotificationStatus.DELIVERING,
    activeFrom: '2026-08-06T09:14:58.508308Z',
    steps: groups.map((group) => ({ stepType: 'GROUP', group })),
  },
];

describe('timelineGroupHeader config', () => {
  it('getMultiAttemptGroupIds - returns no group when the channel has a single attempt', () => {
    const statusHistory = statusHistoryWithGroups([analogGroup('first-attempt', 1)]);

    expect(getMultiAttemptGroupIds(statusHistory)).toStrictEqual(new Set());
  });

  it('getMultiAttemptGroupIds - returns every group of a channel with more than one attempt', () => {
    const statusHistory = statusHistoryWithGroups([
      analogGroup('second-attempt', 2),
      analogGroup('first-attempt', 1),
      analogGroup('single-890-attempt', 1, TimelineEventsChannel.REGISTERED_LETTER_890),
    ]);

    expect(getMultiAttemptGroupIds(statusHistory)).toStrictEqual(
      new Set(['second-attempt', 'first-attempt'])
    );
  });

  it('getTimelineGroupHeader - shows the generic label when the channel has a single attempt', () => {
    expect(getTimelineGroupHeader(analogGroup('single-attempt', 1)).channel).toBe(
      'detail.timeline.send-analog-domicile-ar-group-label'
    );
    expect(
      getTimelineGroupHeader(
        analogGroup('single-attempt', 1, TimelineEventsChannel.REGISTERED_LETTER_890)
      ).channel
    ).toBe('detail.timeline.send-analog-domicile-890-group-label');
  });

  it('getTimelineGroupHeader - shows the attempt label when the channel has multiple attempts', () => {
    expect(getTimelineGroupHeader(analogGroup('first-attempt', 1), true).channel).toBe(
      'detail.timeline.send-analog-domicile-ar-first-attempt-group-label'
    );
    expect(getTimelineGroupHeader(analogGroup('second-attempt', 2), true).channel).toBe(
      'detail.timeline.send-analog-domicile-ar-second-attempt-group-label'
    );
    expect(
      getTimelineGroupHeader(
        analogGroup('second-890-attempt', 2, TimelineEventsChannel.REGISTERED_LETTER_890),
        true
      ).channel
    ).toBe('detail.timeline.send-analog-domicile-890-second-attempt-group-label');
  });

  it('getTimelineGroupHeader - digital channels ignore the attempt, analog ones expose the registered letter code', () => {
    const pecGroup: NotificationTimelineGroup = {
      ...analogGroup('pec-group', 2, TimelineEventsChannel.PEC),
      category: 'DIGITAL',
    };

    expect(getTimelineGroupHeader(pecGroup, true).channel).toBe(
      'detail.timeline.send-digital-domicile-PEC-group-label'
    );
    expect(getTimelineGroupHeader(pecGroup, true).detail).toBeUndefined();
    expect(
      getTimelineGroupHeader({ ...analogGroup('analog-group', 1), registeredLetterCode: 'abc123' })
        .detail
    ).toBe('abc123');
  });

  it('getTimelineGroupHeader - returns an icon for every channel, mapped or not', () => {
    const channels = [
      TimelineEventsChannel.AR_REGISTERED_LETTER,
      TimelineEventsChannel.REGISTERED_LETTER_890,
      TimelineEventsChannel.SIMPLE_REGISTERED_LETTER,
      TimelineEventsChannel.PEC,
      TimelineEventsChannel.SERCQ,
      TimelineEventsChannel.COURTESY,
    ];

    channels.forEach((channel) => {
      expect(
        getTimelineGroupHeader(analogGroup(`${channel}-group`, 1, channel)).icon
      ).toBeDefined();
    });
  });

  it('getTimelineGroupHeader - changes the icon with the attempt, as the label does', () => {
    const genericIcon = getTimelineGroupHeader(analogGroup('single-attempt', 1)).icon;
    const firstAttemptIcon = getTimelineGroupHeader(analogGroup('first-attempt', 1), true).icon;
    const secondAttemptIcon = getTimelineGroupHeader(analogGroup('second-attempt', 2), true).icon;

    expect(firstAttemptIcon).not.toBe(genericIcon);
    expect(secondAttemptIcon).not.toBe(genericIcon);
    expect(secondAttemptIcon).not.toBe(firstAttemptIcon);
  });
});
