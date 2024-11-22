import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

type SendDisableIO = {
  SEND_APPIO_STATUS: 'deactivated';
};

export class SendDisableIOStrategy implements EventStrategy {
  performComputations(): TrackedEvent<SendDisableIO> {
    return {
      [EventPropertyType.PROFILE]: {
        SEND_APPIO_STATUS: 'deactivated',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_APPIO_STATUS: 'deactivated',
      },
    };
  }
}
