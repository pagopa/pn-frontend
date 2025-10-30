import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import { DigitalAddress } from '../../../models/contacts';
import {
  MixpanelConcatCourtesyContacts,
  MixpanelDigitalDomicileState,
  concatCourtestyContacts,
  getDigitalDomicileState,
} from '../../mixpanel';

type Props = {
  legal_addresses: Array<DigitalAddress>;
  contact_details: Array<DigitalAddress>;
  event_type: EventAction.ACTION | EventAction.SCREEN_VIEW;
};

type Return = {
  digital_domicile_state: MixpanelDigitalDomicileState;
  contact_details: MixpanelConcatCourtesyContacts;
};

export class UxWithDigitalDomicileStateAndContactDetailsStrategy implements EventStrategy {
  performComputations({
    legal_addresses,
    contact_details,
    event_type,
  }: Props): TrackedEvent<Return> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type,
        digital_domicile_state: getDigitalDomicileState(legal_addresses),
        contact_details: concatCourtestyContacts(contact_details),
      },
    };
  }
}
