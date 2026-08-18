import { ComponentType } from 'react';

import {
  EuroOutlined,
  GavelOutlined,
  InfoOutlined,
  MarkEmailReadOutlined,
  NoAccountsOutlined,
  TroubleshootOutlined,
  WarningOutlined,
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';

import { NotificationStatus } from '../../../models/NotificationStatus';
import OutgoingEmailOutlined from '../../Icons/OutgoingEmailOutlined';
import SearchCheckOutlined from '../../Icons/SearchCheckOutlined';

type TimelineStatusPresentation = {
  icon: ComponentType<SvgIconProps>;
  variant: 'warning' | 'error' | 'success' | 'info' | 'normal';
};

const TIMELINE_STATUS_PRESENTATION: Partial<
  Record<NotificationStatus, TimelineStatusPresentation>
> = {
  [NotificationStatus.PAID]: { variant: 'success', icon: EuroOutlined },
  [NotificationStatus.UNREACHABLE]: { variant: 'error', icon: NoAccountsOutlined },
  [NotificationStatus.CANCELLED]: { variant: 'warning', icon: WarningOutlined },
  [NotificationStatus.CANCELLATION_IN_PROGRESS]: { variant: 'warning', icon: WarningOutlined },
  [NotificationStatus.NOTIFICATION_TIMELINE_REWORKED]: {
    variant: 'warning',
    icon: WarningOutlined,
  },
  [NotificationStatus.EFFECTIVE_DATE]: { variant: 'info', icon: GavelOutlined },
  [NotificationStatus.VIEWED]: { variant: 'info', icon: GavelOutlined },
  [NotificationStatus.DELIVERED]: { variant: 'normal', icon: MarkEmailReadOutlined },
  [NotificationStatus.DELIVERING]: { variant: 'normal', icon: OutgoingEmailOutlined },
  [NotificationStatus.ACCEPTED]: { variant: 'normal', icon: SearchCheckOutlined },
  [NotificationStatus.IN_VALIDATION]: { variant: 'normal', icon: TroubleshootOutlined },
  [NotificationStatus.RETURNED_TO_SENDER]: { variant: 'normal', icon: NoAccountsOutlined }, // <- Manca sul figma, icona da rivedere
};

const DEFAULT_TIMELINE_STATUS_PRESENTATION: TimelineStatusPresentation = {
  variant: 'normal',
  icon: InfoOutlined,
};

export const getTimelineItemPresentation = (
  status: NotificationStatus,
  isFirst: boolean
): TimelineStatusPresentation => {
  const { icon, variant } =
    TIMELINE_STATUS_PRESENTATION[status] ?? DEFAULT_TIMELINE_STATUS_PRESENTATION;

  return {
    icon,
    variant:
      isFirst || status === NotificationStatus.NOTIFICATION_TIMELINE_REWORKED ? variant : 'normal',
  };
};
