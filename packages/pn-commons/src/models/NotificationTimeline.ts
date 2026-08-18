import {
  INotificationDetailTimeline,
  NotificationDeliveryMode,
  NotificationDetailRecipient,
  ReworkedStatus,
} from './NotificationDetail';
import { NotificationStatus } from './NotificationStatus';

export interface NotificationTimelineResponse {
  iun: string;
  subject: string;
  recipients: Array<NotificationDetailRecipient>;
  notificationStatusHistory: Array<NotificationTimelineStatusHistory>;
}

export interface NotificationTimelineStatusHistory {
  status: NotificationStatus;
  activeFrom: string;
  viewedByMandate?: string;
  deliveryMode?: NotificationDeliveryMode;
  reworkedStatus?: ReworkedStatus;
  steps: Array<NotificationTimelineStep>;
}

/**
 * Ogni step della timeline è discriminato da stepType e contiene il payload
 * nella chiave corrispondente: event per gli eventi singoli, group per i gruppi.
 */
export type NotificationTimelineStep =
  | NotificationTimelineEventStep
  | NotificationTimelineGroupStep;

export interface NotificationTimelineEventStep {
  stepType: 'EVENT';
  event: NotificationTimelineEvent;
}

export interface NotificationTimelineGroupStep {
  stepType: 'GROUP';
  group: NotificationTimelineGroup;
}

export interface NotificationTimelineGroup {
  groupId: string;
  denomination: string;
  taxId: string;
  recIndex: number;
  category: NotificationTimelineGroupCategory;
  channel: string;
  attempt?: number;
  registeredLetterCode?: string;
  hasReworkedEvents: boolean;
  events: Array<NotificationTimelineEvent>;
}

export interface NotificationTimelineEvent
  extends Omit<INotificationDetailTimeline, 'hidden' | 'index'> {
  isHidden: boolean;
}

export const NotificationTimelineStepType = { EVENT: 'EVENT', GROUP: 'GROUP' } as const;

export type NotificationTimelineStepType =
  (typeof NotificationTimelineStepType)[keyof typeof NotificationTimelineStepType];

export const NotificationTimelineGroupCategory = {
  COURTESY: 'COURTESY',
  DIGITAL: 'DIGITAL',
  ANALOG: 'ANALOG',
} as const;

export type NotificationTimelineGroupCategory =
  (typeof NotificationTimelineGroupCategory)[keyof typeof NotificationTimelineGroupCategory];
