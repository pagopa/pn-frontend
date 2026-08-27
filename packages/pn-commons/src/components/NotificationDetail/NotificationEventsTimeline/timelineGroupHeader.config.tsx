import { ComponentType } from 'react';

import { MailOutlineRounded } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';

import { PhysicalCommunicationType } from '../../../models';
import {
  NotificationTimelineGroup,
  NotificationTimelineStatusHistory,
  TimelineEventsChannel,
} from '../../../models/NotificationTimeline';
import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';
import {
  isPhysicalCommunicationType,
  isTimelineGroupStep,
} from '../../../utility/notificationTimeline.utility';
import LetterIcon from '../../Icons/LetterIcon';
import MobileRounded from '../../Icons/MobileRounded';
import SendIcon from '../../Icons/SendIcon';

type ChannelPresentation = {
  labelKey: string;
  icon: ComponentType<SvgIconProps>;
};

const CHANNEL_PRESENTATION: Record<TimelineEventsChannel, ChannelPresentation> = {
  AR_REGISTERED_LETTER: {
    labelKey: 'detail.timeline.send-analog-domicile-ar-group-label',
    icon: MailOutlineRounded,
  },
  REGISTERED_LETTER_890: {
    labelKey: 'detail.timeline.send-analog-domicile-890-group-label',
    icon: MailOutlineRounded,
  },
  SIMPLE_REGISTERED_LETTER: {
    labelKey: 'detail.timeline.send-simple-registered-letter',
    icon: MailOutlineRounded,
  },
  PEC: {
    labelKey: 'detail.timeline.send-digital-domicile-PEC-group-label',
    icon: MailOutlineRounded,
  },
  SERCQ: {
    labelKey: 'detail.timeline.send-digital-domicile-SERCQ-SEND-group-label',
    icon: SendIcon,
  },
  COURTESY: {
    labelKey: 'detail.timeline.courtesy-group-label',
    icon: MobileRounded,
  },
};

const CHANNEL_ATTEMPT_PRESENTATION: Record<
  PhysicalCommunicationType,
  Record<number, ChannelPresentation>
> = {
  AR_REGISTERED_LETTER: {
    1: {
      labelKey: 'detail.timeline.send-analog-domicile-ar-first-attempt-group-label',
      icon: () => <LetterIcon number={1} />,
    },
    2: {
      labelKey: 'detail.timeline.send-analog-domicile-ar-second-attempt-group-label',
      icon: () => <LetterIcon number={2} />,
    },
  },
  REGISTERED_LETTER_890: {
    1: {
      labelKey: 'detail.timeline.send-analog-domicile-890-first-attempt-group-label',
      icon: () => <LetterIcon number={1} />,
    },
    2: {
      labelKey: 'detail.timeline.send-analog-domicile-890-second-attempt-group-label',
      icon: () => <LetterIcon number={2} />,
    },
  },
};

export type TimelineGroupHeader = {
  channel: string;
  icon: ComponentType<SvgIconProps>;
  detail?: string;
};

const getChannelPresentation = (
  { channel, attempt }: NotificationTimelineGroup,
  hasMultipleAttempts: boolean
): ChannelPresentation => {
  const attemptPresentation =
    hasMultipleAttempts && attempt && isPhysicalCommunicationType(channel)
      ? CHANNEL_ATTEMPT_PRESENTATION[channel]?.[attempt]
      : undefined;

  return attemptPresentation ?? CHANNEL_PRESENTATION[channel];
};

export const getTimelineGroupHeader = (
  group: NotificationTimelineGroup,
  hasMultipleAttempts = false
): TimelineGroupHeader => {
  const presentation = getChannelPresentation(group, hasMultipleAttempts);

  return {
    channel: getLocalizedOrDefaultLabel('notifications', presentation.labelKey),
    icon: presentation.icon,
    detail:
      group.category === 'ANALOG' && group.registeredLetterCode
        ? group.registeredLetterCode
        : undefined,
  };
};

const getGroupChannelKey = (group: NotificationTimelineGroup): string =>
  `${group.recIndex}_${group.channel}`;

/**
 * Ids of the groups belonging to a channel with more than one delivery attempt, so that
 * callers can show the attempt-specific label/icon (see CHANNEL_ATTEMPT_PRESENTATION) only for those.
 */
export const getMultiAttemptGroupIds = (
  statusHistory: Array<NotificationTimelineStatusHistory>
): Set<string> => {
  const groups = statusHistory
    .flatMap((status) => status.steps ?? [])
    .filter(isTimelineGroupStep)
    .map((step) => step.group);

  const maxAttemptByChannel = groups.reduce((acc, group) => {
    const key = getGroupChannelKey(group);
    acc.set(key, Math.max(acc.get(key) ?? 0, group.attempt ?? 1));
    return acc;
  }, new Map<string, number>());

  return new Set(
    groups
      .filter((group) => (maxAttemptByChannel.get(getGroupChannelKey(group)) ?? 0) > 1)
      .map((group) => group.groupId)
  );
};
