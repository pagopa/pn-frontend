import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import { AddressType, ContactSource, DigitalAddress } from '../../../models/contacts';
import { MixpanelDigitalDomicileState, getDigitalDomicileState } from '../../mixpanel';

type Props = {
  event_type: EventAction.ACTION | EventAction.SCREEN_VIEW;
  addresses: Array<DigitalAddress>;
  source: ContactSource;
};

type Return = {
  digital_domicile_state: MixpanelDigitalDomicileState;
  source: ContactSource;
  other_contact: 'yes' | 'no';
};

export class UxWithDDStateSourceAndOtherStrategy implements EventStrategy {
  performComputations({ addresses, event_type, source }: Props): TrackedEvent<Return> {
    const otherAddresses = addresses.filter(
      (address) => address.addressType === AddressType.LEGAL && address.senderId !== 'default'
    );

    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type,
        digital_domicile_state: getDigitalDomicileState(addresses),
        source, // to be implemented
        other_contact: otherAddresses ? 'yes' : 'no',
      },
    };
  }
}
