import { EventAction, EventCategory, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

import {
  CourtesyChannelType,
  DigitalAddress,
  DigitalAddresses,
  IOAllowedValues,
} from '../../../models/contacts';

type SendYourContactDetails = {
  digitalAddresses: DigitalAddresses;
  contactIO: DigitalAddress | null;
};

type SendYourContactDetailsReturn = {
  PEC_exists: boolean;
  email_exists: boolean;
  telephone_exists: boolean;
  appIO_status: 'activated' | 'deactivated' | 'nd';
};

export class SendYourContactDetailsStrategy implements EventStrategy {
  performComputations({
    digitalAddresses,
    contactIO,
  }: SendYourContactDetails): TrackedEvent<SendYourContactDetailsReturn> {
    return {
      event_category: EventCategory.UX,
      event_type: EventAction.SCREEN_VIEW,
      PEC_exists: digitalAddresses.legal.length > 0,
      email_exists:
        digitalAddresses.courtesy.filter((c) => c.channelType === CourtesyChannelType.EMAIL)
          .length > 0,
      telephone_exists:
        digitalAddresses.courtesy.filter((c) => c.channelType === CourtesyChannelType.SMS).length >
        0,
      appIO_status: contactIO
        ? contactIO.value === IOAllowedValues.ENABLED
          ? 'activated'
          : 'deactivated'
        : 'nd',
    };
  }
}
