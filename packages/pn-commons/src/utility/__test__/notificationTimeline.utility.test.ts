import { notificationTimelineDTO } from '../../__mocks__/NotificationTimeline.mock';
import { NotificationStatus } from '../../models';
import {
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
  getLegacyStatusLegalFacts,
  getRecipientPerStep,
  getStatusLegalFacts,
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

  describe('getStatusLegalFacts', () => {
    it('returns the single hidden legal fact matching the status category', () => {
      const event = createEvent('VIEWED_LEGAL_FACT', {
        category: TimelineCategory.NOTIFICATION_VIEWED,
        isHidden: true,
        legalFactsIds: [legalFact],
      });

      const status = {
        status: NotificationStatus.VIEWED,
        activeFrom: '2026-01-01T00:00:00Z',
        relatedTimelineElements: [],
        steps: [event],
      };

      expect(getStatusLegalFacts(status)).toStrictEqual([{ event, lf: legalFact }]);
    });

    it('ignores legal facts whose event category does not belong to the status', () => {
      const event = createEvent('UNRELATED_LEGAL_FACT', {
        category: TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
        isHidden: true,
        legalFactsIds: [legalFact],
      });

      const status = {
        status: NotificationStatus.VIEWED,
        activeFrom: '2026-01-01T00:00:00Z',
        relatedTimelineElements: [],
        steps: [event],
      };

      expect(getStatusLegalFacts(status)).toStrictEqual([]);
    });

    it('does not embed multiple legal facts in the status description', () => {
      const event = createEvent('MULTIPLE_VIEWED_LEGAL_FACTS', {
        category: TimelineCategory.NOTIFICATION_VIEWED,
        isHidden: true,
        legalFactsIds: [
          legalFact,
          {
            ...legalFact,
            key: 'safestorage://fictional-second-legal-fact.pdf',
          },
        ],
      });

      const status = {
        status: NotificationStatus.VIEWED,
        activeFrom: '2026-01-01T00:00:00Z',
        relatedTimelineElements: [],
        steps: [event],
      };

      expect(getStatusLegalFacts(status)).toStrictEqual([]);
    });
  });

  describe('getLegacyStatusLegalFacts', () => {
    it('returns the single hidden legal fact matching the status category', () => {
      const event = createEvent('VIEWED_LEGAL_FACT', {
        category: TimelineCategory.NOTIFICATION_VIEWED,
        isHidden: true,
        legalFactsIds: [legalFact],
      });

      const status = {
        status: NotificationStatus.VIEWED,
        activeFrom: '2026-01-01T00:00:00Z',
        relatedTimelineElements: [],
        steps: [event],
      };

      expect(getLegacyStatusLegalFacts(status)).toStrictEqual([{ event, lf: legalFact }]);
    });

    it('ignores legal facts whose event category does not belong to the status', () => {
      const event = createEvent('UNRELATED_LEGAL_FACT', {
        category: TimelineCategory.DIGITAL_SUCCESS_WORKFLOW,
        isHidden: true,
        legalFactsIds: [legalFact],
      });

      const status = {
        status: NotificationStatus.VIEWED,
        activeFrom: '2026-01-01T00:00:00Z',
        relatedTimelineElements: [],
        steps: [event],
      };

      expect(getLegacyStatusLegalFacts(status)).toStrictEqual([]);
    });

    it('does not embed multiple legal facts in the status description', () => {
      const event = createEvent('MULTIPLE_VIEWED_LEGAL_FACTS', {
        category: TimelineCategory.NOTIFICATION_VIEWED,
        isHidden: true,
        legalFactsIds: [
          legalFact,
          {
            ...legalFact,
            key: 'safestorage://fictional-second-legal-fact.pdf',
          },
        ],
      });

      const status = {
        status: NotificationStatus.VIEWED,
        activeFrom: '2026-01-01T00:00:00Z',
        relatedTimelineElements: [],
        steps: [event],
      };

      expect(getLegacyStatusLegalFacts(status)).toStrictEqual([]);
    });
  });
});
