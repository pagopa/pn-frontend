import { ComponentType } from 'react';

import { InfoOutlined, MailOutlined } from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';

import {
  NotificationTimelineGroup,
  NotificationTimelineStatusHistory,
} from '../../../models/NotificationTimeline';
import { getLocalizedOrDefaultLabel } from '../../../utility/localization.utility';
import { isTimelineGroupStep } from '../../../utility/notificationTimeline.utility';
import FirstLetterOutlined from '../../Icons/FirstLetterOutlined';
import MobileOutlined from '../../Icons/MobileOutlined';
import SecondLetterOutlined from '../../Icons/SecondLetterOutlined';
import SendIcon from '../../Icons/SendIcon';

type ChannelPresentation = {
  labelKey: string;
  icon: ComponentType<SvgIconProps>;
};

const CHANNEL_PRESENTATION: Record<string, ChannelPresentation> = {
  AR_REGISTERED_LETTER: {
    labelKey: 'detail.timeline.send-analog-domicile-ar-group-label',
    icon: MailOutlined,
  },
  REGISTERED_LETTER_890: {
    labelKey: 'detail.timeline.send-analog-domicile-890-group-label',
    icon: MailOutlined,
  },
  SIMPLE_REGISTERED_LETTER: {
    labelKey: 'detail.timeline.send-simple-registered-letter',
    icon: MailOutlined,
  },
  PEC: {
    labelKey: 'detail.timeline.send-digital-domicile-PEC-group-label',
    icon: MailOutlined,
  },
  SERCQ: {
    labelKey: 'detail.timeline.send-digital-domicile-SERCQ-SEND-group-label',
    icon: SendIcon,
  },
  COURTESY: {
    labelKey: 'detail.timeline.courtesy-group-label',
    icon: MobileOutlined,
  },
};

const CHANNEL_ATTEMPT_PRESENTATION: Record<string, Record<number, ChannelPresentation>> = {
  AR_REGISTERED_LETTER: {
    1: {
      labelKey: 'detail.timeline.send-analog-domicile-ar-first-attempt-group-label',
      icon: FirstLetterOutlined,
    },
    2: {
      labelKey: 'detail.timeline.send-analog-domicile-ar-second-attempt-group-label',
      icon: SecondLetterOutlined,
    },
  },
  REGISTERED_LETTER_890: {
    1: {
      labelKey: 'detail.timeline.send-analog-domicile-890-first-attempt-group-label',
      icon: FirstLetterOutlined,
    },
    2: {
      labelKey: 'detail.timeline.send-analog-domicile-890-second-attempt-group-label',
      icon: SecondLetterOutlined,
    },
  },
};

const DEFAULT_CHANNEL_ICON: ComponentType<SvgIconProps> = InfoOutlined;

export type TimelineGroupHeader = {
  channel: string;
  icon: ComponentType<SvgIconProps>;
  detail?: string;
};

const getChannelPresentation = (
  { channel, attempt }: NotificationTimelineGroup,
  hasMultipleAttempts: boolean
): ChannelPresentation | undefined => {
  const attemptPresentation =
    hasMultipleAttempts && attempt ? CHANNEL_ATTEMPT_PRESENTATION[channel]?.[attempt] : undefined;

  return attemptPresentation ?? CHANNEL_PRESENTATION[channel];
};

export const getTimelineGroupHeader = (
  group: NotificationTimelineGroup,
  hasMultipleAttempts = false
): TimelineGroupHeader => {
  const presentation = getChannelPresentation(group, hasMultipleAttempts);

  return {
    channel: presentation
      ? getLocalizedOrDefaultLabel('notifications', presentation.labelKey)
      : group.channel,
    icon: presentation?.icon ?? DEFAULT_CHANNEL_ICON,
    detail:
      group.category === 'ANALOG' && group.registeredLetterCode
        ? group.registeredLetterCode
        : undefined,
  };
};

const getGroupChannelKey = (group: NotificationTimelineGroup): string =>
  `${group.recIndex}_${group.channel}`;

/**
 * Id dei gruppi che appartengono a un canale con più di un tentativo di invio
 */
export const getMultiAttemptGroupIds = (
  statusHistory: Array<NotificationTimelineStatusHistory>
): Set<string> => {
  const groups = statusHistory
    .flatMap((status) => status.steps ?? [])
    .filter(isTimelineGroupStep)
    .map((step) => step.group);

  const maxAttemptByChannel = groups.reduce<Record<string, number>>((acc, group) => {
    const key = getGroupChannelKey(group);
    return { ...acc, [key]: Math.max(acc[key] ?? 0, group.attempt ?? 1) };
  }, {});

  return new Set(
    groups
      .filter((group) => maxAttemptByChannel[getGroupChannelKey(group)] > 1)
      .map((group) => group.groupId)
  );
};
