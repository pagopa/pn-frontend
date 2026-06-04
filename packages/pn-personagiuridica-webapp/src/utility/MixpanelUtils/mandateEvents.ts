import { TrackedEvent, uxAction, uxConfirm } from '@pagopa-pn/pn-commons';

import { PGEventPayloads } from '../../models/PGEventPayloads';
import { PGEventsType } from '../../models/PGEventsType';

type MandateTrackingConfigs = {
  [PGEventsType.SEND_PG_ADD_MANDATE_START]: (
    payload: PGEventPayloads[PGEventsType.SEND_PG_ADD_MANDATE_START]
  ) => TrackedEvent;
  [PGEventsType.SEND_PG_ADD_MANDATE_UX_SUCCESS]: (
    payload: PGEventPayloads[PGEventsType.SEND_PG_ADD_MANDATE_UX_SUCCESS]
  ) => TrackedEvent;
};

export const mandateTrackingConfigs: MandateTrackingConfigs = {
  [PGEventsType.SEND_PG_ADD_MANDATE_START]: () => uxAction(),
  [PGEventsType.SEND_PG_ADD_MANDATE_UX_SUCCESS]: () => uxConfirm(),
};
