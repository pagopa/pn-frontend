import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import { DigitalAddress } from '../../../models/contacts';
import {
  MixpanelDigitalDomicileState,
  MixpanelPecState,
  MixpanelTosState,
  getDigitalDomicileState,
} from '../../mixpanel';

type Props = {
  event_type: EventAction.ACTION | EventAction.SCREEN_VIEW;
  tos_validation: MixpanelTosState;
  pec_validation: MixpanelPecState;
  legal_addresses: Array<DigitalAddress>;
};

type Return = {
  digital_domicile_state: MixpanelDigitalDomicileState;
  tos_validation: MixpanelTosState;
  pec_validation: MixpanelPecState;
};

export class UxWithDDStateTosAndPecValidationStrategy implements EventStrategy {
  performComputations({
    legal_addresses,
    tos_validation,
    pec_validation,
    event_type,
  }: Props): TrackedEvent<Return> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type,
        digital_domicile_state: getDigitalDomicileState(legal_addresses),
        tos_validation,
        pec_validation,
      },
    };
  }
}
