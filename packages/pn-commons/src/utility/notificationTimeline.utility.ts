import { NotificationStatus } from '../models';
import {
  INotificationDetailTimeline,
  LegalFactId,
  NotificationDetailRecipient,
  NotificationStatusHistory,
  TimelineCategory,
} from '../models/NotificationDetail';
import {
  NotificationTimelineEvent,
  NotificationTimelineGroupStep,
  NotificationTimelineLegacyStatusHistory,
  NotificationTimelineStatusHistory,
  NotificationTimelineStep,
  NotificationTimelineStepType,
} from '../models/NotificationTimeline';
import { formatDay, formatMonthString, formatTime } from './date.utility';

const legalFactStatusMap = new Map<NotificationStatus, TimelineCategory>([
  [NotificationStatus.ACCEPTED, TimelineCategory.REQUEST_ACCEPTED],
  [NotificationStatus.VIEWED, TimelineCategory.NOTIFICATION_VIEWED],
]);

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
 * shown there. Flags a recipient the first time it's met and every time it changes, on event
 * steps and group steps alike. Callers are expected to only use this for multi-recipient
 * notifications, since every recipient encountered ends up flagged at least once.
 */
export const getRecipientPerStep = (
  steps: Array<NotificationTimelineStep>,
  recipients: Array<NotificationDetailRecipient>
): Array<NotificationDetailRecipient | undefined> => {
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

export const getStatusLegalFacts = (status: NotificationTimelineLegacyStatusHistory) => {
  const eventCategory = legalFactStatusMap.get(status.status);
  if (eventCategory) {
    const legalFactsIds = status.steps
      .filter((s) => s.category === eventCategory)
      .reduce((arr, s) => {
        if (s.legalFactsIds && s.isHidden) {
          return arr.concat(s.legalFactsIds.map((lf) => ({ event: s, lf })));
        }
        return arr;
      }, [] as Array<{ event: NotificationTimelineEvent; lf: LegalFactId }>);

    return legalFactsIds.length === 1 ? legalFactsIds : [];
  }
  return [];
};

export const eventMustBeShown = (
  status: NotificationTimelineStatusHistory,
  event: NotificationTimelineEvent
) => {
  const eventCategory = legalFactStatusMap.get(status.status);
  return event.category !== eventCategory;
};

export const getLegacyStatusLegalFacts = (status?: NotificationStatusHistory) => {
  if (!status) {
    return [];
  }
  const eventCategory = legalFactStatusMap.get(status.status);
  if (eventCategory && status.steps) {
    const legalFactsIds = status.steps
      .filter((s) => s.category === eventCategory)
      .reduce((arr, s) => {
        if (s.legalFactsIds && s.hidden) {
          return arr.concat(s.legalFactsIds.map((lf) => ({ event: s, lf })));
        }
        return arr;
      }, [] as Array<{ event: INotificationDetailTimeline; lf: LegalFactId }>);

    return legalFactsIds.length === 1 ? legalFactsIds : [];
  }
  return [];
};
