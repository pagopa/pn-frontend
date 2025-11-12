import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import { DigitalAddress } from '../../../models/contacts';
import { MixpanelDigitalDomicileState, getDigitalDomicileState } from '../../mixpanel';

type TosValidation = 'valid' | 'missing';

type Props = {
  tos_validation: TosValidation;
  legal_addresses: Array<DigitalAddress>;
};

type Return = {
  tos_validation: TosValidation;
  digital_domicile_state: MixpanelDigitalDomicileState;
};

export class SendAddSercqSendUxConversionStrategy implements EventStrategy {
  performComputations({ tos_validation, legal_addresses }: Props): TrackedEvent<Return> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        tos_validation,
        digital_domicile_state: getDigitalDomicileState(legal_addresses),
      },
    };
  }
}
