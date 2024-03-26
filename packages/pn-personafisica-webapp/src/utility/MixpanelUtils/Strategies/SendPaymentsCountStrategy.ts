import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

export class SendPaymentsCountStrategy implements EventStrategy {
  performComputations(): TrackedEvent {
    return {
      [EventPropertyType.INCREMENTAL]: false,
    };
  }
}
