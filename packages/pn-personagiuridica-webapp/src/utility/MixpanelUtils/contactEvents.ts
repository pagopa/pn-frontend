import { TrackedEvent, uxScreenView } from '@pagopa-pn/pn-commons';

import { PGEventPayloads } from '../../models/PGEventPayloads';
import { PGEventsType } from '../../models/PGEventsType';

type ContactTrackingConfigs = {
  [PGEventsType.SEND_PG_YOUR_CONTACT_DETAILS]: (
    payload: PGEventPayloads[PGEventsType.SEND_PG_YOUR_CONTACT_DETAILS]
  ) => TrackedEvent;
};

export const contactTrackingConfigs: ContactTrackingConfigs = {
  [PGEventsType.SEND_PG_YOUR_CONTACT_DETAILS]: (payload) => uxScreenView(payload),
};
