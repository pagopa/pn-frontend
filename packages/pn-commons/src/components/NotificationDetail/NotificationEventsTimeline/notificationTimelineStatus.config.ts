import { ComponentType } from 'react';

import {
  DraftsOutlined,
  EuroRounded,
  GavelRounded,
  InfoOutlined,
  MarkEmailReadOutlined,
  NoAccountsOutlined,
  TaskAltRounded,
  TroubleshootRounded,
  WarningRounded,
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';

import { NotificationStatus } from '../../../models/NotificationStatus';
import OutgoingEmailRounded from '../../Icons/OutgoingEmailRounded';

type TimelineStatusPresentation = {
  icon: ComponentType<SvgIconProps>;
  variant: 'warning' | 'error' | 'success' | 'info' | 'normal';
};

const TIMELINE_STATUS_PRESENTATION: Partial<
  Record<NotificationStatus, TimelineStatusPresentation>
> = {
  [NotificationStatus.PAID]: { variant: 'success', icon: EuroRounded },
  [NotificationStatus.RETURNED_TO_SENDER]: { variant: 'warning', icon: NoAccountsOutlined },
  [NotificationStatus.CANCELLED]: { variant: 'warning', icon: WarningRounded },
  [NotificationStatus.CANCELLATION_IN_PROGRESS]: { variant: 'warning', icon: WarningRounded },
  [NotificationStatus.NOTIFICATION_TIMELINE_REWORKED]: {
    variant: 'warning',
    icon: WarningRounded,
  },
  [NotificationStatus.EFFECTIVE_DATE]: { variant: 'info', icon: GavelRounded },
  [NotificationStatus.VIEWED]: { variant: 'info', icon: GavelRounded },
  [NotificationStatus.DELIVERED]: { variant: 'normal', icon: MarkEmailReadOutlined },
  [NotificationStatus.DELIVERING]: { variant: 'normal', icon: OutgoingEmailRounded },
  [NotificationStatus.ACCEPTED]: { variant: 'normal', icon: TaskAltRounded },
  [NotificationStatus.IN_VALIDATION]: { variant: 'normal', icon: TroubleshootRounded },
  [NotificationStatus.UNREACHABLE]: { variant: 'normal', icon: NoAccountsOutlined },
};

const DEFAULT_TIMELINE_STATUS_PRESENTATION: TimelineStatusPresentation = {
  variant: 'normal',
  icon: InfoOutlined,
};

export const getTimelineItemPresentation = (
  status: NotificationStatus,
  isFirst: boolean,
  hasEffectiveDate = false
): TimelineStatusPresentation => {
  const { icon: statusIcon, variant } =
    TIMELINE_STATUS_PRESENTATION[status] ?? DEFAULT_TIMELINE_STATUS_PRESENTATION;
  // the viewed status shows the DraftsOutlined icon when the timeline also contains the effective date status
  const icon =
    status === NotificationStatus.VIEWED && hasEffectiveDate ? DraftsOutlined : statusIcon;

  return {
    icon,
    variant:
      isFirst || status === NotificationStatus.NOTIFICATION_TIMELINE_REWORKED ? variant : 'normal',
  };
};
