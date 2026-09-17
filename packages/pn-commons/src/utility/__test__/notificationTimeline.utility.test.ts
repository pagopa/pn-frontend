import { notificationTimelineDTO } from '../../__mocks__/NotificationTimeline.mock';
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
  getLegacyStatusLegalFacts,
  getRecipientPerStep,
  getStatusLegalFacts,
  isTimelineGroupStep,
  statusHasStepsToShow,
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
    it('returns event/legal-fact pairs when every event is hidden', () => {
      const firstEvent = createEvent('FIRST_EVENT', {
        isHidden: true,
        legalFactsIds: [legalFact],
      });
      const secondLegalFact = {
        ...legalFact,
        key: 'safestorage://second-legal-fact.pdf',
      };
      const secondEvent = createEvent('SECOND_EVENT', {
        isHidden: true,
        legalFactsIds: [secondLegalFact],
      });

      expect(getStatusLegalFacts([firstEvent, secondEvent])).toStrictEqual([
        {
          event: firstEvent,
          lf: legalFact,
        },
        {
          event: secondEvent,
          lf: secondLegalFact,
        },
      ]);
    });

    it('returns an empty array when at least one event is visible', () => {
      const hiddenEvent = createEvent('HIDDEN_EVENT', {
        isHidden: true,
        legalFactsIds: [legalFact],
      });
      const visibleEvent = createEvent('VISIBLE_EVENT', {
        isHidden: false,
      });

      expect(getStatusLegalFacts([hiddenEvent, visibleEvent])).toStrictEqual([]);
    });

    it('returns every legal fact of the same hidden event', () => {
      const secondLegalFact = {
        ...legalFact,
        key: 'safestorage://second-legal-fact.pdf',
      };
      const event = createEvent('EVENT_WITH_MULTIPLE_LEGAL_FACTS', {
        isHidden: true,
        legalFactsIds: [legalFact, secondLegalFact],
      });

      expect(getStatusLegalFacts([event])).toStrictEqual([
        { event, lf: legalFact },
        { event, lf: secondLegalFact },
      ]);
    });

    it('ignores hidden events without legal facts', () => {
      const eventWithoutLegalFacts = createEvent('WITHOUT_LEGAL_FACTS', {
        isHidden: true,
        legalFactsIds: [],
      });
      const eventWithLegalFact = createEvent('WITH_LEGAL_FACT', {
        isHidden: true,
        legalFactsIds: [legalFact],
      });

      expect(getStatusLegalFacts([eventWithoutLegalFacts, eventWithLegalFact])).toStrictEqual([
        {
          event: eventWithLegalFact,
          lf: legalFact,
        },
      ]);
    });

    it('returns an empty array for an empty status', () => {
      expect(getStatusLegalFacts([])).toStrictEqual([]);
    });
  });

  describe('statusHasStepsToShow', () => {
    it('returns true when at least one event is visible', () => {
      const events = [
        createEvent('HIDDEN_EVENT', { isHidden: true }),
        createEvent('VISIBLE_EVENT', { isHidden: false }),
      ];

      expect(statusHasStepsToShow(events)).toBe(true);
    });

    it('returns false when every event is hidden', () => {
      const events = [
        createEvent('FIRST_HIDDEN_EVENT', { isHidden: true }),
        createEvent('SECOND_HIDDEN_EVENT', { isHidden: true }),
      ];

      expect(statusHasStepsToShow(events)).toBe(false);
    });

    it('returns false for an empty event list', () => {
      expect(statusHasStepsToShow([])).toBe(false);
    });
  });

  describe('getLegacyStatusLegalFacts', () => {
    const createLegacyEvent = (
      elementId: string,
      overrides: Partial<INotificationDetailTimeline> = {}
    ): INotificationDetailTimeline => ({
      elementId,
      timestamp: '2026-01-01T00:00:00Z',
      category: TimelineCategory.NOTIFICATION_VIEWED,
      details: {},
      legalFactsIds: [],
      hidden: true,
      ...overrides,
    });

    it('returns event/legal-fact pairs when every legacy event is hidden', () => {
      const event = createLegacyEvent('HIDDEN_EVENT', {
        legalFactsIds: [legalFact],
      });

      expect(getLegacyStatusLegalFacts([event])).toStrictEqual([
        {
          event,
          lf: legalFact,
        },
      ]);
    });

    it('returns an empty array when a legacy event is visible', () => {
      const hiddenEvent = createLegacyEvent('HIDDEN_EVENT', {
        hidden: true,
        legalFactsIds: [legalFact],
      });
      const visibleEvent = createLegacyEvent('VISIBLE_EVENT', {
        hidden: false,
      });

      expect(getLegacyStatusLegalFacts([hiddenEvent, visibleEvent])).toStrictEqual([]);
    });

    it('returns an empty array when steps are undefined', () => {
      expect(getLegacyStatusLegalFacts(undefined)).toStrictEqual([]);
    });

    it('returns all legal facts from a hidden legacy event', () => {
      const secondLegalFact = {
        ...legalFact,
        key: 'safestorage://second-legal-fact.pdf',
      };
      const event = createLegacyEvent('HIDDEN_EVENT', {
        legalFactsIds: [legalFact, secondLegalFact],
      });

      expect(getLegacyStatusLegalFacts([event])).toStrictEqual([
        { event, lf: legalFact },
        { event, lf: secondLegalFact },
      ]);
    });
  });
});
