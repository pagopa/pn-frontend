import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import { DigitalAddress } from '../../../models/contacts';
import { MixpanelConcatCourtesyContacts, concatCourtestyContacts } from '../../mixpanel';

type Props = {
  event_type: EventAction;
  contacts: Array<DigitalAddress>;
};

type Result = {
  contact_details: MixpanelConcatCourtesyContacts;
};

export class UxWithCourtesyContactListStrategy implements EventStrategy {
  performComputations({ event_type, contacts }: Props): TrackedEvent<Result> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type,
        contact_details: concatCourtestyContacts(contacts),
      },
    };
  }
}
