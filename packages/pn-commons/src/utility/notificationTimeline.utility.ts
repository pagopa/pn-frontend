import { NotificationStatusHistory } from '../models';
import {
  NotificationTimelineEvent,
  NotificationTimelineGroupStep,
  NotificationTimelineStatusHistory,
  NotificationTimelineStep,
  NotificationTimelineStepType,
} from '../models/NotificationTimeline';
import { formatDay, formatMonthString, formatTime } from './date.utility';

export const isTimelineGroupStep = (
  step: NotificationTimelineStep
): step is NotificationTimelineGroupStep => step.stepType === NotificationTimelineStepType.GROUP;

export const flattenTimelineSteps = (
  steps: Array<NotificationTimelineStep>
): Array<NotificationTimelineEvent> =>
  steps.flatMap((step) => (isTimelineGroupStep(step) ? step.group.events : [step.event]));

/**
 * Adatta il formato a gruppi al modello legacy che getNotificationStatusInfos pretende.
 * - steps appiattiti: per DELIVERED lato PA, getNotificationDeliveredInfosForPA cerca i
 *   deliveryDetailCode di giacenza scorrendo statusObject.steps e deliveringStatus.steps
 *   come liste piatte;
 */
export const toLegacyStatusHistory = (
  statusHistory: Array<NotificationTimelineStatusHistory>
): Array<NotificationStatusHistory> =>
  statusHistory.map((status) => ({
    status: status.status,
    activeFrom: status.activeFrom,
    relatedTimelineElements: [],
    deliveryMode: status.deliveryMode,
    reworkedStatus: status.reworkedStatus,
    recipient: status.viewedByMandate,
    steps: flattenTimelineSteps(status.steps ?? []),
  }));

export const formatTimelineDate = (date: string, language: string): string =>
  `${formatDay(date)} ${formatMonthString(date, language)}, ${formatTime(date)}`;

export const getStepRecIndex = (step: NotificationTimelineStep): number | undefined =>
  isTimelineGroupStep(step) ? step.group.recIndex : step.event.details.recIndex;
