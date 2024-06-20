import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import {
  AddressType,
  CourtesyChannelType,
  DigitalAddress,
  IOAllowedValues,
} from '../../../models/contacts';

type SendYourContactDetails = {
  digitalAddresses: Array<DigitalAddress>;
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
    const legalAddresses = digitalAddresses.filter(
      (address) => address.addressType === AddressType.LEGAL
    );
    const courtesyAddresses = digitalAddresses.filter(
      (address) => address.addressType === AddressType.COURTESY
    );

    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
        PEC_exists: legalAddresses.length > 0,
        email_exists:
          courtesyAddresses.filter((c) => c.channelType === CourtesyChannelType.EMAIL).length > 0,
        telephone_exists:
          courtesyAddresses.filter((c) => c.channelType === CourtesyChannelType.SMS).length > 0,
        appIO_status: contactIO
          ? contactIO.value === IOAllowedValues.ENABLED
            ? 'activated'
            : 'deactivated'
          : 'nd',
      },
    };
  }
}
