import { NotificationStatus } from '../models';
import {
  LegalFactId,
  NotificationDetailRecipient,
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

/**
 * Minimal shape a timeline event must have to take part in the legal fact plan.
 * Both NotificationTimelineEvent and INotificationDetailTimeline satisfy it; they only
 * differ in the name of the hidden flag, which is supplied by the caller.
 */
type LegalFactCarrier = {
  elementId: string;
  category: TimelineCategory;
  legalFactsIds?: Array<LegalFactId>;
};

export type StatusLegalFact<T extends LegalFactCarrier> = { event: T; lf: LegalFactId };

export type StatusLegalFactPlan<T extends LegalFactCarrier> = {
  /** Legal fact to be rendered inline within the status description text, if any. */
  legalFacts: Array<StatusLegalFact<T>>;
  /** elementIds of the events that must not be rendered, as they are absorbed into the description. */
  hiddenEventIds: Set<string>;
};

const EMPTY_PLAN: StatusLegalFactPlan<never> = {
  legalFacts: [],
  hiddenEventIds: new Set<string>(),
};

export const emptyLegalFactPlan = <T extends LegalFactCarrier>(): StatusLegalFactPlan<T> =>
  EMPTY_PLAN as StatusLegalFactPlan<T>;

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

/**
 * Single source of truth for how the legal facts of a status must be displayed.
 *
 * - Zero or several candidates: nothing is inlined, each legal fact keeps being rendered
 *   in its own context (recipient group for statuses, list for events).
 * - Exactly one candidate: it is rendered inside the status description and its event is
 *   hidden, so that the same legal fact is not shown twice.
 *
 * `isHidden` tells how to read the hidden flag, which is `isHidden` on the new timeline
 * and `hidden` on the legacy one.
 */
export const getStatusLegalFactPlan = <T extends LegalFactCarrier>(
  status: { status: NotificationStatus; steps?: Array<T> } | undefined,
  isHidden: (event: T) => boolean | undefined
): StatusLegalFactPlan<T> => {
  const eventCategory = status && legalFactStatusMap.get(status.status);
  if (!status?.steps || !eventCategory) {
    return emptyLegalFactPlan<T>();
  }

  // All (event, legalFact) pairs of this status that are candidates for inlining.
  const legalFacts = status.steps
    .filter((event) => event.category === eventCategory && isHidden(event))
    .flatMap((event) => (event.legalFactsIds ?? []).map((lf) => ({ event, lf })));

  if (legalFacts.length === 0) {
    return emptyLegalFactPlan<T>();
  }

  return {
    legalFacts,
    hiddenEventIds: new Set([legalFacts[0].event.elementId]),
  };
};
