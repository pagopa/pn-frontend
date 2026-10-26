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
 * Groups PEC events by address and source within a single digital delivery attempt.
 * Events with the same address but different sources belong to separate sections.
 * Events without a known source are grouped separately from those with a known source.
 *
 * General workflow events remain outside PEC address sections.
 * Input events are not modified, and their relative order within each section is preserved.
 */
/* eslint-disable functional/immutable-data -- Local mutations are used to build PEC sections in a single pass without mutating input events. */
export const buildPecTimelineSections = (
  events: Array<NotificationTimelineEvent>
): Array<PecTimelineSection> => {
  const sections: Array<PecTimelineSection> = [];
  const addressSections = new Map<string, Extract<PecTimelineSection, { kind: 'address' }>>();

  for (const event of events) {
    const address = getPecEventAddress(event);

    if (!address) {
      sections.push({ kind: 'general', event });
      continue;
    }

    const source = resolveTimelineDigitalAddressSource({
      digitalAddressSource: getPecEventDetails(event)?.digitalAddressSource,
      elementId: event.elementId,
    });

    const groupKey = JSON.stringify([address, source]);
    const existingSection = addressSections.get(groupKey);

    if (existingSection) {
      existingSection.events.push(event);
      continue;
    }

    const section: Extract<PecTimelineSection, { kind: 'address' }> = {
      kind: 'address',
      address,
      source,
      events: [event],
    };

    sections.push(section);
    addressSections.set(groupKey, section);
  }

  return sections;
};
/* eslint-enable functional/immutable-data */
