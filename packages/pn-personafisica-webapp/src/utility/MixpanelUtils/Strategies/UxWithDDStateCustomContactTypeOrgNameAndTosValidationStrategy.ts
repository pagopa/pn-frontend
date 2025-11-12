import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import { ChannelType, DigitalAddress } from '../../../models/contacts';
import {
  MixpanelCustomizedContactType,
  MixpanelDigitalDomicileState,
  MixpanelTosState,
  getCustomizedContactType,
  getDigitalDomicileState,
} from '../../mixpanel';

type Props = {
  event_type: EventAction.ACTION | EventAction.SCREEN_VIEW;
  addresses: Array<DigitalAddress>;
  customized_contact_type: ChannelType.PEC | ChannelType.SERCQ_SEND | 'missing';
  organization_name: string;
  tos_validation: MixpanelTosState;
};

type Return = {
  digital_domicile_state: MixpanelDigitalDomicileState;
  customized_contact_type: MixpanelCustomizedContactType;
  organization_name: string;
  tos_validation: MixpanelTosState;
};

export class UxWithDDStateCustomContactTypeOrgNameAndTosValidationStrategy
  implements EventStrategy
{
  performComputations({
    addresses,
    customized_contact_type,
    event_type,
    organization_name,
    tos_validation,
  }: Props): TrackedEvent<Return> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type,
        digital_domicile_state: getDigitalDomicileState(addresses),
        customized_contact_type: getCustomizedContactType(customized_contact_type),
        organization_name,
        tos_validation,
      },
    };
  }
}
