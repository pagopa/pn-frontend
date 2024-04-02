import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

type SendEnableIO = {
  SEND_APPIO_STATUS: 'activated';
};

export class SendEnableIOStrategy implements EventStrategy {
  performComputations(): TrackedEvent<SendEnableIO> {
    return {
      [EventPropertyType.PROFILE]: {
        SEND_APPIO_STATUS: 'activated',
      },
    };
  }
}
