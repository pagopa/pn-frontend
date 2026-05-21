import { TrackedEvent, uxAction, uxConfirm, uxScreenView } from '@pagopa-pn/pn-commons';

import { PGEventPayloads } from '../../models/PGEventPayloads';
import { PGEventsType } from '../../models/PGEventsType';

type MandateTrackingConfigs = {
  [PGEventsType.SEND_PG_ADD_MANDATE_START]: (
    payload: PGEventPayloads[PGEventsType.SEND_PG_ADD_MANDATE_START]
  ) => TrackedEvent;
  [PGEventsType.SEND_PG_ADD_MANDATE_UX_SUCCESS]: (
    payload: PGEventPayloads[PGEventsType.SEND_PG_ADD_MANDATE_UX_SUCCESS]
  ) => TrackedEvent;
  [PGEventsType.SEND_PG_MANDATES_GIVEN]: (
    payload: PGEventPayloads[PGEventsType.SEND_PG_MANDATES_GIVEN]
  ) => TrackedEvent;
  [PGEventsType.SEND_PG_MANDATES_RECEIVED]: (
    payload: PGEventPayloads[PGEventsType.SEND_PG_MANDATES_RECEIVED]
  ) => TrackedEvent;
};

export const mandateTrackingConfigs: MandateTrackingConfigs = {
  [PGEventsType.SEND_PG_ADD_MANDATE_START]: () => uxAction(),
  [PGEventsType.SEND_PG_ADD_MANDATE_UX_SUCCESS]: () => uxConfirm(),
  [PGEventsType.SEND_PG_MANDATES_GIVEN]: () => uxScreenView(),
  [PGEventsType.SEND_PG_MANDATES_RECEIVED]: () => uxScreenView(),
};
