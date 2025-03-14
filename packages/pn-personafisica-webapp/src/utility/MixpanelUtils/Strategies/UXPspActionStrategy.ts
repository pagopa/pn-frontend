import { EventAction, EventCategory, EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

export class UXPspActionStrategy implements EventStrategy {
  performComputations({ psp }: { psp: 'pagopa' | string }): TrackedEvent<{ psp: 'pagopa' | string }> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        psp,
      },
    };
  }
}
