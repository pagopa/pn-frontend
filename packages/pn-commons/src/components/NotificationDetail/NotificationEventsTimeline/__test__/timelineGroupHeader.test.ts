import { InfoOutlined, MailOutlineRounded } from '@mui/icons-material';

import { NotificationStatus } from '../../../../models';
import {
  NotificationTimelineGroup,
  NotificationTimelineStatusHistory,
  TimelineEventsChannel,
} from '../../../../models/NotificationTimeline';
import MobileRounded from '../../../Icons/MobileRounded';
import SendIcon from '../../../Icons/SendIcon';
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

  it('getTimelineGroupHeader - show the attempt on icon when PEC has multiple attempts', () => {
    const pecGroup: NotificationTimelineGroup = {
      ...analogGroup('pec-group', 2, TimelineEventsChannel.PEC),
      category: 'DIGITAL',
    };

    const genericIcon = getTimelineGroupHeader(pecGroup).icon;
    const secondAttemptIcon = getTimelineGroupHeader(pecGroup, true).icon;

    expect(secondAttemptIcon).not.toBe(genericIcon);
  });

  it('getTimelineGroupHeader - digital channels without an attempt mapping ignore the attempt, analog ones expose the registered letter code', () => {
    const sercqGroup: NotificationTimelineGroup = {
      ...analogGroup('sercq-group', 2, TimelineEventsChannel.SERCQ),
      category: 'DIGITAL',
    };

    expect(getTimelineGroupHeader(sercqGroup, true).channel).toBe(
      'detail.timeline.send-digital-domicile-SERCQ-SEND-group-label'
    );
    expect(getTimelineGroupHeader(sercqGroup, true).detail).toBeUndefined();
    expect(
      getTimelineGroupHeader({ ...analogGroup('analog-group', 1), registeredLetterCode: 'abc123' })
        .detail
    ).toBe('abc123');
  });

  it('getTimelineGroupHeader - falls back to a category-based presentation when the channel is missing', () => {
    const analogFailureGroup: NotificationTimelineGroup = {
      ...analogGroup('analog-failure-group', 1),
      category: 'ANALOG_FAILURE',
      channel: undefined,
    };
    const digitalGroup: NotificationTimelineGroup = {
      ...analogGroup('digital-fallback-group', 1),
      category: 'DIGITAL',
      channel: undefined,
    };

    expect(getTimelineGroupHeader(analogFailureGroup).channel).toBe(
      'detail.timeline.registered-letter'
    );
    expect(getTimelineGroupHeader(analogFailureGroup).icon).toBe(MailOutlineRounded);
    expect(getTimelineGroupHeader(digitalGroup).channel).toBe(
      'detail.timeline.digital-send-fallback'
    );
  });

  it('getTimelineGroupHeader - falls back to a generic presentation when neither the channel nor the category are mapped', () => {
    const courtesyGroup: NotificationTimelineGroup = {
      ...analogGroup('courtesy-group', 1),
      category: 'COURTESY',
      channel: undefined,
    };

    const header = getTimelineGroupHeader(courtesyGroup);
    expect(header.channel).toBe('detail.timeline.unknown-status');
    expect(header.icon).toBe(InfoOutlined);
  });

  it.each([
    {
      channel: TimelineEventsChannel.AR_REGISTERED_LETTER,
      labelKey: 'detail.timeline.send-analog-domicile-ar-group-label',
      icon: MailOutlineRounded,
    },
    {
      channel: TimelineEventsChannel.REGISTERED_LETTER_890,
      labelKey: 'detail.timeline.send-analog-domicile-890-group-label',
      icon: MailOutlineRounded,
    },
    {
      channel: TimelineEventsChannel.SIMPLE_REGISTERED_LETTER,
      labelKey: 'detail.timeline.send-simple-registered-letter',
      icon: MailOutlineRounded,
    },
    {
      channel: TimelineEventsChannel.PEC,
      labelKey: 'detail.timeline.send-digital-domicile-PEC-group-label',
      icon: MailOutlineRounded,
    },
    {
      channel: TimelineEventsChannel.SERCQ,
      labelKey: 'detail.timeline.send-digital-domicile-SERCQ-SEND-group-label',
      icon: SendIcon,
    },
    {
      channel: TimelineEventsChannel.COURTESY,
      labelKey: 'detail.timeline.courtesy-group-label',
      icon: MobileRounded,
    },
  ])(
    'getTimelineGroupHeader - maps $channel to its own label and icon',
    ({ channel, labelKey, icon }) => {
      const header = getTimelineGroupHeader(analogGroup(`${channel}-group`, 1, channel));
      expect(header.channel).toBe(labelKey);
      expect(header.icon).toBe(icon);
    }
  );

  it('getTimelineGroupHeader - changes the icon with the attempt, as the label does', () => {
    const genericIcon = getTimelineGroupHeader(analogGroup('single-attempt', 1)).icon;
    const firstAttemptIcon = getTimelineGroupHeader(analogGroup('first-attempt', 1), true).icon;
    const secondAttemptIcon = getTimelineGroupHeader(analogGroup('second-attempt', 2), true).icon;

    expect(firstAttemptIcon).not.toBe(genericIcon);
    expect(secondAttemptIcon).not.toBe(genericIcon);
    expect(secondAttemptIcon).not.toBe(firstAttemptIcon);
  });
});
