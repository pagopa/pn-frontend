import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

import { ContactSource } from '../../../models/contacts';

type Props = {
  source: ContactSource;
};

type Return = Props & {
  other_contact: string;
};

export class SendAddSercqSendEnterFlowStrategy implements EventStrategy {
  performComputations({ source }: Props): TrackedEvent<Return> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        other_contact: 'no',
        source,
      },
    };
  }
}
