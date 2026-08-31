import { NotificationDetailRecipient } from '../models/NotificationDetail';
import {
  NotificationTimelineEvent,
  NotificationTimelineGroupStep,
  NotificationTimelineLegacyStatusHistory,
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
 * Adapts the group-based format to the legacy model expected by getNotificationStatusInfos.
 * - flattened steps: for DELIVERED on the PA side, getNotificationDeliveredInfosForPA looks for
 *   the holding-period deliveryDetailCode by scanning statusObject.steps and
 *   deliveringStatus.steps as flat lists;
 */
export const toLegacyStatusHistory = (
  statusHistory: Array<NotificationTimelineStatusHistory>
): Array<NotificationTimelineLegacyStatusHistory> =>
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

const getStepRecIndex = (step: NotificationTimelineStep): number | undefined =>
  isTimelineGroupStep(step) ? step.group.recIndex : step.event.details.recIndex;

/**
 * For each step, the recipient to display as a header above it, or undefined if none should be
 * shown there. Returns all undefined when the steps involve a single recipient; otherwise flags
 * a recipient the first time it's met and every time it changes, on event steps and group steps
 * alike.
 */
export const getRecipientPerStep = (
  steps: Array<NotificationTimelineStep>,
  recipients: Array<NotificationDetailRecipient>
): Array<NotificationDetailRecipient | undefined> => {
  const distinctRecIndexes = new Set(
    steps.map(getStepRecIndex).filter((recIndex): recIndex is number => recIndex !== undefined)
  );

  // If there is only one recipient involved in the steps, we don't need to show any recipient headers.
  if (distinctRecIndexes.size < 2) {
    return steps.map(() => undefined);
  }

  // eslint-disable-next-line functional/no-let
  let lastRecIndex: number | undefined;

  return steps.map((step) => {
    const recIndex = getStepRecIndex(step);
    if (recIndex === undefined) {
      return undefined;
    }

    const isRecipientChanged = recIndex !== lastRecIndex;
    lastRecIndex = recIndex;
    return isRecipientChanged ? recipients[recIndex] : undefined;
  });
};
