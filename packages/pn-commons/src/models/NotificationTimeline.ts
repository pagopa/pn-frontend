import {
  INotificationDetailTimeline,
  NotificationDeliveryMode,
  NotificationDetailRecipient,
  NotificationStatusHistory,
  ReworkedStatus,
} from './NotificationDetail';
import { NotificationStatus } from './NotificationStatus';

export const TimelineEventsChannel = {
  AR_REGISTERED_LETTER: 'AR_REGISTERED_LETTER',
  REGISTERED_LETTER_890: 'REGISTERED_LETTER_890',
  SIMPLE_REGISTERED_LETTER: 'SIMPLE_REGISTERED_LETTER',
  PEC: 'PEC',
  SERCQ: 'SERCQ',
  COURTESY: 'COURTESY',
} as const;

export type TimelineEventsChannel =
  (typeof TimelineEventsChannel)[keyof typeof TimelineEventsChannel];

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
  channel: TimelineEventsChannel;
  attempt?: number;
  registeredLetterCode?: string;
  hasReworkedEvents: boolean;
  events: Array<NotificationTimelineEvent>;
}

export interface NotificationTimelineEvent
  extends Omit<INotificationDetailTimeline, 'hidden' | 'index'> {
  isHidden: boolean;
}

export type NotificationTimelineLegacyStatusHistory = Omit<NotificationStatusHistory, 'steps'> & {
  steps: Array<NotificationTimelineEvent>;
};

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
