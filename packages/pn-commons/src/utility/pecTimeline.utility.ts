import { TimelineCategory } from '../models';
import { NotificationTimelineEvent } from '../models/NotificationTimeline';
import { DigitalSource } from './StatusHistory';
import { resolveTimelineDigitalAddressSource } from './contacts.utility';

const PEC_EVENT_CATEGORIES = new Set<TimelineCategory>([
  TimelineCategory.SEND_DIGITAL_DOMICILE,
  TimelineCategory.SEND_DIGITAL_PROGRESS,
  TimelineCategory.SEND_DIGITAL_FEEDBACK,
]);

type PecEventDetails = {
  digitalAddress?: {
    address?: string;
  } | null;
  digitalAddressSource?: unknown;
};

export type PecTimelineSection =
  | {
      kind: 'address';
      address: string;
      source: DigitalSource | null;
      events: Array<NotificationTimelineEvent>;
    }
  | {
      kind: 'general';
      event: NotificationTimelineEvent;
    };

const getPecEventDetails = (event: NotificationTimelineEvent): PecEventDetails | null => {
  const details: unknown = event.details;

  return details && typeof details === 'object' ? (details as PecEventDetails) : null;
};

const getPecEventAddress = (event: NotificationTimelineEvent): string | null => {
  if (!PEC_EVENT_CATEGORIES.has(event.category)) {
    return null;
  }

  return getPecEventDetails(event)?.digitalAddress?.address || null;
};

/**
 * Resolves the source associated with a PEC address.
 * If events for the same address report different valid sources,
 * the first valid source in timeline order takes precedence.
 */
const resolvePecAddressSource = (
  events: Array<NotificationTimelineEvent>,
  address: string
): DigitalSource | null =>
  events
    .filter((event) => getPecEventAddress(event) === address)
    .map((event) =>
      resolveTimelineDigitalAddressSource({
        digitalAddressSource: getPecEventDetails(event)?.digitalAddressSource,
        elementId: event.elementId,
      })
    )
    .find((source) => source !== null) ?? null;

/**
 * Groups PEC events by digital address within a single delivery attempt.
 * General workflow events remain outside address sections.
 *
 * The original event objects and their relative order within each address
 * are preserved.
 */
export const buildPecTimelineSections = (
  events: Array<NotificationTimelineEvent>
): Array<PecTimelineSection> =>
  events.reduce<Array<PecTimelineSection>>((sections, event) => {
    const address = getPecEventAddress(event);

    if (!address) {
      return [...sections, { kind: 'general', event }];
    }

    const existingIndex = sections.findIndex(
      (section) => section.kind === 'address' && section.address === address
    );

    if (existingIndex === -1) {
      return [
        ...sections,
        {
          kind: 'address',
          address,
          source: resolvePecAddressSource(events, address),
          events: [event],
        },
      ];
    }

    return sections.map((section, index) =>
      index === existingIndex && section.kind === 'address'
        ? { ...section, events: [...section.events, event] }
        : section
    );
  }, []);
