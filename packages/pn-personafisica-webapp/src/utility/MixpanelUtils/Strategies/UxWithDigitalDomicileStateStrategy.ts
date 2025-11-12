import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import { DigitalAddress } from '../../../models/contacts';
import { MixpanelDigitalDomicileState, getDigitalDomicileState } from '../../mixpanel';

type Props = {
  legal_addresses: Array<DigitalAddress>;
  event_type: EventAction.ACTION | EventAction.SCREEN_VIEW;
};

type Return = {
  digital_domicile_state: MixpanelDigitalDomicileState;
};

export class UxWithDigitalDomicileStateStrategy implements EventStrategy {
  performComputations({ legal_addresses, event_type }: Props): TrackedEvent<Return> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type,
        digital_domicile_state: getDigitalDomicileState(legal_addresses),
      },
    };
  }
}
