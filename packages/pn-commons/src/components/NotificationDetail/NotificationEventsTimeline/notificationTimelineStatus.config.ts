import { ComponentType } from 'react';

import {
  Check,
  Drafts,
  Euro,
  Gavel,
  Info,
  Mail,
  MarkEmailRead,
  NoAccounts,
  PersonOff,
  Warning,
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';

import { NotificationStatus } from '../../../models/NotificationStatus';

export type TimelineStatusPresentation = {
  icon: ComponentType<SvgIconProps>;
  variant: 'warning' | 'error' | 'success' | 'info' | 'normal';
};

/**
 * Icona e variante del pallino con cui ogni macro-stato viene reso nella timeline.
 * Vive qui e non in getNotificationStatusInfos perché è una scelta presentazionale
 * usata solo da questo componente, mentre quella utility è condivisa da PA, PF e PG.
 */
const TIMELINE_STATUS_PRESENTATION: Partial<
  Record<NotificationStatus, TimelineStatusPresentation>
> = {
  [NotificationStatus.DELIVERED]: { variant: 'normal', icon: MarkEmailRead },
  // Questa icona è errata ma quella del figma non viene esportata da mui-icons
  [NotificationStatus.DELIVERING]: { variant: 'normal', icon: Mail },
  // Sul figma non c'è questo stato, quindi l'icona potrebbe cambiare
  [NotificationStatus.UNREACHABLE]: { variant: 'error', icon: PersonOff },
  [NotificationStatus.PAID]: { variant: 'success', icon: Euro },
  // Da rivedere
  [NotificationStatus.ACCEPTED]: { variant: 'normal', icon: Check },
  [NotificationStatus.EFFECTIVE_DATE]: { variant: 'info', icon: Gavel },
  [NotificationStatus.VIEWED]: { variant: 'success', icon: Drafts },
  [NotificationStatus.CANCELLED]: { variant: 'warning', icon: Warning },
  [NotificationStatus.CANCELLATION_IN_PROGRESS]: { variant: 'warning', icon: Warning },
  [NotificationStatus.RETURNED_TO_SENDER]: { variant: 'normal', icon: NoAccounts },
  [NotificationStatus.NOTIFICATION_TIMELINE_REWORKED]: { variant: 'warning', icon: Warning },
};

/**
 * IN_VALIDATION e REFUSED non hanno una presentazione dedicata e cadono qui,
 * come già facevano nel ramo default di getNotificationStatusInfos.
 */
export const DEFAULT_TIMELINE_STATUS_PRESENTATION: TimelineStatusPresentation = {
  variant: 'normal',
  icon: Info,
};

export const getTimelineStatusPresentation = (
  status: NotificationStatus
): TimelineStatusPresentation =>
  TIMELINE_STATUS_PRESENTATION[status] ?? DEFAULT_TIMELINE_STATUS_PRESENTATION;
