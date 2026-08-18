import { NotificationTimelineGroup } from '../../../models/NotificationTimeline';
import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';

const CHANNEL_LABEL_KEY: Record<string, string> = {
  AR_REGISTERED_LETTER: 'detail.timeline.send-analog-domicile-ar',
  REGISTERED_LETTER_890: 'detail.timeline.send-analog-domicile-890',
  SIMPLE_REGISTERED_LETTER: 'detail.timeline.send-simple-registered-letter',
  PEC: 'detail.timeline.send-digital-domicile-PEC',
  SERCQ: 'detail.timeline.send-digital-domicile-SERCQ-SEND',
  SERCQ_SEND: 'detail.timeline.send-digital-domicile-SERCQ-SEND',
  EMAIL: 'detail.timeline.group.channel.EMAIL',
  SMS: 'detail.timeline.group.channel.SMS',
  APPIO: 'detail.timeline.group.channel.APPIO',
};

export type TimelineGroupHeader = {
  channel: string;
  detail?: string;
};

export const getTimelineGroupHeader = (group: NotificationTimelineGroup): TimelineGroupHeader => {
  const channelKey = CHANNEL_LABEL_KEY[group.channel];

  return {
    channel: channelKey ? getLocalizedOrDefaultLabel('notifications', channelKey) : group.channel,
    detail:
      group.category === 'ANALOG' && group.registeredLetterCode
        ? group.registeredLetterCode
        : undefined,
  };
};
