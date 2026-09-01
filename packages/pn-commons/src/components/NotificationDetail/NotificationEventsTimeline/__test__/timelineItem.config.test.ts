import { NotificationStatus } from '../../../../models';
import { RecipientType, TimelineCategory } from '../../../../models/NotificationDetail';
import {
  NotificationTimelineEvent,
  NotificationTimelineStatusHistory,
} from '../../../../models/NotificationTimeline';
import { toLegacyStatusHistory } from '../../../../utility/notificationTimeline.utility';
import { getTimelineItems } from '../timelineItem.config';

const recipients = [
  { recipientType: RecipientType.PF, taxId: 'TSTUTN00A07A001G', denomination: 'Utente Uno' },
  { recipientType: RecipientType.PF, taxId: 'TSTUTN00A07A002H', denomination: 'Utente Due' },
];

const eventOfRecipient = (elementId: string, recIndex: number): NotificationTimelineEvent => ({
  elementId,
  timestamp: '2026-08-06T09:14:58.508308Z',
  category: TimelineCategory.SEND_DIGITAL_DOMICILE,
  details: { recIndex },
  isHidden: false,
});

const statusWithEvents = (
  status: NotificationStatus,
  steps: Array<NotificationTimelineStatusHistory['steps'][number]>
): NotificationTimelineStatusHistory => ({
  status,
  activeFrom: '2026-08-06T09:14:58.508308Z',
  steps,
});

describe('getTimelineItems', () => {
  it('returns one item per status, in the same order', () => {
    const statusHistory = [
      statusWithEvents(NotificationStatus.ACCEPTED, []),
      statusWithEvents(NotificationStatus.DELIVERING, []),
    ];
    const legacyStatusHistory = toLegacyStatusHistory(statusHistory);

    const items = getTimelineItems(statusHistory, legacyStatusHistory, [recipients[0]]);

    expect(items.map((item) => item.status)).toStrictEqual(statusHistory);
  });

  it('exposes hasGroupedEvents based on whether the status has a group step', () => {
    const statusHistory = [
      statusWithEvents(NotificationStatus.ACCEPTED, [
        { stepType: 'EVENT', event: eventOfRecipient('event-1', 0) },
      ]),
      statusWithEvents(NotificationStatus.DELIVERING, [
        {
          stepType: 'GROUP',
          group: {
            groupId: 'group-1',
            denomination: recipients[0].denomination,
            taxId: recipients[0].taxId,
            recIndex: 0,
            category: 'ANALOG',
            channel: 'AR_REGISTERED_LETTER',
            hasReworkedEvents: false,
            events: [],
          },
        },
      ]),
    ];
    const legacyStatusHistory = toLegacyStatusHistory(statusHistory);

    const items = getTimelineItems(statusHistory, legacyStatusHistory, [recipients[0]]);

    expect(items[0].hasGroupedEvents).toBe(false);
    expect(items[1].hasGroupedEvents).toBe(true);
  });

  it('reuses the legacy status steps as allEvents, without flattening them again', () => {
    const statusHistory = [
      statusWithEvents(NotificationStatus.ACCEPTED, [
        { stepType: 'EVENT', event: eventOfRecipient('event-1', 0) },
      ]),
    ];
    const legacyStatusHistory = toLegacyStatusHistory(statusHistory);

    const items = getTimelineItems(statusHistory, legacyStatusHistory, [recipients[0]]);

    expect(items[0].allEvents).toBe(legacyStatusHistory[0].steps);
  });

  it('computes recipientPerStep only when there are multiple recipients on the sender timeline', () => {
    const statusHistory = [
      statusWithEvents(NotificationStatus.ACCEPTED, [
        { stepType: 'EVENT', event: eventOfRecipient('event-1', 0) },
        { stepType: 'EVENT', event: eventOfRecipient('event-2', 1) },
      ]),
    ];
    const legacyStatusHistory = toLegacyStatusHistory(statusHistory);

    expect(
      getTimelineItems(statusHistory, legacyStatusHistory, [recipients[0]], true)[0]
        .recipientPerStep
    ).toStrictEqual([]);
    expect(
      getTimelineItems(statusHistory, legacyStatusHistory, recipients, false)[0].recipientPerStep
    ).toStrictEqual([]);

    const recipientPerStep = getTimelineItems(statusHistory, legacyStatusHistory, recipients, true)[0]
      .recipientPerStep;
    expect(recipientPerStep).toStrictEqual([recipients[0], recipients[1]]);
  });

  it('resolves label/description and icon/variant through the shared status presentation config', () => {
    const statusHistory = [statusWithEvents(NotificationStatus.ACCEPTED, [])];
    const legacyStatusHistory = toLegacyStatusHistory(statusHistory);

    const item = getTimelineItems(statusHistory, legacyStatusHistory, [recipients[0]])[0];

    expect(item.label).toBeTruthy();
    expect(item.description).toBeTruthy();
    expect(item.icon).toBeTruthy();
    expect(item.variant).toBeTruthy();
  });
});
