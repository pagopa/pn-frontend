import { notificationTimelineDTO } from '../../__mocks__/NotificationTimeline.mock';
import { NotificationStatus } from '../../models';
import {
  INotificationDetailTimeline,
  LegalFactType,
  NotificationDetailRecipient,
  RecipientType,
  TimelineCategory,
} from '../../models/NotificationDetail';
import {
  NotificationTimelineEvent,
  NotificationTimelineStep,
} from '../../models/NotificationTimeline';
import { formatDay, formatMonthString } from '../date.utility';
import {
  flattenTimelineSteps,
  formatTimelineDate,
  getRecipientPerStep,
  getStatusLegalFactPlan,
  isTimelineGroupStep,
  toLegacyStatusHistory,
} from '../notificationTimeline.utility';

const [viewedStatus, deliveringStatus] = notificationTimelineDTO.notificationStatusHistory;

describe('notificationTimeline utility', () => {
  const legalFact = {
    key: 'safestorage://legal-fact.pdf',
    category: LegalFactType.DIGITAL_DELIVERY,
  };

  const createEvent = (
    elementId: string,
    overrides: Partial<NotificationTimelineEvent> = {}
  ): NotificationTimelineEvent => ({
    elementId,
    timestamp: '2026-01-01T00:00:00Z',
    category: TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
    details: {},
    legalFactsIds: [],
    isHidden: false,
    ...overrides,
  });

  const createLegacyEvent = (
    elementId: string,
    overrides: Partial<INotificationDetailTimeline> = {}
  ): INotificationDetailTimeline => ({
    elementId,
    timestamp: '2026-01-01T00:00:00Z',
    category: TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
    details: {},
    legalFactsIds: [],
    hidden: false,
    ...overrides,
  });

  it('isTimelineGroupStep - discriminates the steps by stepType', () => {
    const eventStep: NotificationTimelineStep = viewedStatus.steps[0];
    const groupStep: NotificationTimelineStep = deliveringStatus.steps[0];

    expect(isTimelineGroupStep(eventStep)).toBe(false);
    expect(isTimelineGroupStep(groupStep)).toBe(true);
  });

  it('flattenTimelineSteps - unwraps the events of both event and group steps', () => {
    expect(flattenTimelineSteps(viewedStatus.steps)).toStrictEqual([
      viewedStatus.steps[0].stepType === 'EVENT' ? viewedStatus.steps[0].event : undefined,
    ]);

    const groupedEvents = deliveringStatus.steps.flatMap((step) =>
      isTimelineGroupStep(step) ? step.group.events : []
    );
    expect(flattenTimelineSteps(deliveringStatus.steps)).toStrictEqual(groupedEvents);
  });

  it('toLegacyStatusHistory - maps every status to the legacy model with flattened steps', () => {
    const legacyStatusHistory = toLegacyStatusHistory(
      notificationTimelineDTO.notificationStatusHistory
    );

    expect(legacyStatusHistory).toHaveLength(
      notificationTimelineDTO.notificationStatusHistory.length
    );
    expect(legacyStatusHistory[1]).toStrictEqual({
      status: deliveringStatus.status,
      activeFrom: deliveringStatus.activeFrom,
      relatedTimelineElements: [],
      deliveryMode: undefined,
      reworkedStatus: undefined,
      recipient: undefined,
      steps: flattenTimelineSteps(deliveringStatus.steps),
    });
  });

  it('formatTimelineDate - composes day, month and time of the event', () => {
    const eventDate = deliveringStatus.activeFrom;
    const localDate = new Date(eventDate);
    const hours = localDate.getHours().toString().padStart(2, '0');
    const minutes = localDate.getMinutes().toString().padStart(2, '0');

    expect(formatTimelineDate(eventDate, 'it')).toBe(
      `${formatDay(eventDate)} ${formatMonthString(eventDate, 'it')}, ${hours}:${minutes}`
    );
  });

  describe('getRecipientPerStep', () => {
    const recipients: Array<NotificationDetailRecipient> = [
      {
        recipientType: RecipientType.PF,
        taxId: 'TAXID0',
        denomination: 'Recipient Zero',
        payments: [],
      },
      {
        recipientType: RecipientType.PF,
        taxId: 'TAXID1',
        denomination: 'Recipient One',
        payments: [],
      },
    ];

    const groupStepOfRecIndex = (recIndex: number, groupId: string): NotificationTimelineStep => ({
      stepType: 'GROUP',
      group: {
        groupId,
        denomination: recipients[recIndex].denomination,
        taxId: recipients[recIndex].taxId,
        recIndex,
        category: 'DIGITAL',
        channel: 'PEC',
        attempt: 1,
        hasReworkedEvents: false,
        events: [],
      },
    });

    const eventStepOfRecIndex = (recIndex?: number): NotificationTimelineStep => ({
      stepType: 'EVENT',
      event: {
        elementId: `EVENT_${recIndex ?? 'NONE'}`,
        timestamp: '2026-01-01T00:00:00Z',
        category: TimelineCategory.REQUEST_ACCEPTED,
        details: { recIndex },
        legalFactsIds: [],
        isHidden: true,
      },
    });

    it('flags the recipient the first time a recIndex is met and every time it changes, on events and groups alike', () => {
      const steps = [
        groupStepOfRecIndex(0, 'group0'),
        groupStepOfRecIndex(0, 'group0b'),
        eventStepOfRecIndex(1),
        groupStepOfRecIndex(1, 'group1'),
      ];

      expect(getRecipientPerStep(steps, recipients)).toStrictEqual([
        recipients[0],
        undefined,
        recipients[1],
        undefined,
      ]);
    });

    it('attaches the header to a leading event when it is the first occurrence of a recipient, not to the group after it', () => {
      const steps = [
        eventStepOfRecIndex(0),
        groupStepOfRecIndex(0, 'group0'),
        groupStepOfRecIndex(1, 'group1'),
      ];

      expect(getRecipientPerStep(steps, recipients)).toStrictEqual([
        recipients[0],
        undefined,
        recipients[1],
      ]);
    });

    it('still flags the first occurrence even when only a single recipient is involved, mixing events and groups', () => {
      const steps = [
        eventStepOfRecIndex(0),
        groupStepOfRecIndex(0, 'group0'),
        groupStepOfRecIndex(0, 'group0b'),
      ];

      expect(getRecipientPerStep(steps, recipients)).toStrictEqual([
        recipients[0],
        undefined,
        undefined,
      ]);
    });

    it('ignores steps with no recIndex and does not alter the tracked recIndex', () => {
      const steps = [
        groupStepOfRecIndex(0, 'group0'),
        eventStepOfRecIndex(undefined),
        groupStepOfRecIndex(0, 'group0b'),
        groupStepOfRecIndex(1, 'group1'),
      ];

      expect(getRecipientPerStep(steps, recipients)).toStrictEqual([
        recipients[0],
        undefined,
        undefined,
        recipients[1],
      ]);
    });
  });

  describe('getStatusLegalFactPlan', () => {
    it.each([
      [NotificationStatus.VIEWED, TimelineCategory.NOTIFICATION_VIEWED],
      [NotificationStatus.ACCEPTED, TimelineCategory.REQUEST_ACCEPTED],
    ])(
      'inlines the single hidden legal fact associated with status %s',
      (statusValue, category) => {
        const event = createEvent('MATCHING_LEGAL_FACT', {
          category,
          isHidden: true,
          legalFactsIds: [legalFact],
        });

        const plan = getStatusLegalFactPlan(
          {
            status: statusValue,
            steps: [event],
          },
          (timelineEvent) => timelineEvent.isHidden
        );

        expect(plan.inlineLegalFact).toStrictEqual({ event, lf: legalFact });
        expect(plan.hiddenEventIds).toStrictEqual(new Set([event.elementId]));
      }
    );

    it('does not inline a legal fact belonging to an unrelated event category', () => {
      const event = createEvent('UNRELATED_LEGAL_FACT', {
        category: TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
        isHidden: true,
        legalFactsIds: [legalFact],
      });

      const plan = getStatusLegalFactPlan(
        {
          status: NotificationStatus.VIEWED,
          steps: [event],
        },
        (timelineEvent) => timelineEvent.isHidden
      );

      expect(plan.inlineLegalFact).toBeUndefined();
      expect(plan.hiddenEventIds).toStrictEqual(new Set());
    });

    it('does not inline legal facts from a visible event', () => {
      const event = createEvent('VISIBLE_LEGAL_FACT', {
        category: TimelineCategory.NOTIFICATION_VIEWED,
        isHidden: false,
        legalFactsIds: [legalFact],
      });

      const plan = getStatusLegalFactPlan(
        {
          status: NotificationStatus.VIEWED,
          steps: [event],
        },
        (timelineEvent) => timelineEvent.isHidden
      );

      expect(plan.inlineLegalFact).toBeUndefined();
      expect(plan.hiddenEventIds).toStrictEqual(new Set());
    });

    it('does not inline when multiple legal facts match the status', () => {
      const secondLegalFact = {
        ...legalFact,
        key: 'safestorage://fictional-second-legal-fact.pdf',
      };
      const event = createEvent('MULTIPLE_LEGAL_FACTS', {
        category: TimelineCategory.NOTIFICATION_VIEWED,
        isHidden: true,
        legalFactsIds: [legalFact, secondLegalFact],
      });

      const plan = getStatusLegalFactPlan(
        {
          status: NotificationStatus.VIEWED,
          steps: [event],
        },
        (timelineEvent) => timelineEvent.isHidden
      );

      expect(plan.inlineLegalFact).toBeUndefined();
      expect(plan.hiddenEventIds).toStrictEqual(new Set());
    });

    it('supports the legacy hidden property', () => {
      const event = createLegacyEvent('LEGACY_VIEWED_LEGAL_FACT', {
        category: TimelineCategory.NOTIFICATION_VIEWED,
        hidden: true,
        legalFactsIds: [legalFact],
      });

      const plan = getStatusLegalFactPlan(
        {
          status: NotificationStatus.VIEWED,
          steps: [event],
        },
        (timelineEvent) => timelineEvent.hidden
      );

      expect(plan.inlineLegalFact).toStrictEqual({ event, lf: legalFact });
      expect(plan.hiddenEventIds).toStrictEqual(new Set([event.elementId]));
    });
  });
});
