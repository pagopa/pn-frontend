import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import { MixpanelPecState, MixpanelTosState } from '../../mixpanel';

type Props = {
  pec_validation: MixpanelPecState;
  tos_validation: MixpanelTosState;
};

export class SendAddSercqPecStartActivationStrategy implements EventStrategy {
  performComputations({ pec_validation, tos_validation }: Props): TrackedEvent<Props> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        pec_validation,
        tos_validation,
      },
    };
  }
}
