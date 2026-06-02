import { uxAction, uxConfirm, uxScreenView } from '@pagopa-pn/pn-commons';

import { PGEventsType } from '../../models/PGEventsType';
import { mapAddMandateSuccessToEventPayload } from './mappers/mandatePayloadMappers';
import { TrackingConfigs } from './trackingTypes';

type MandateEventType =
  | PGEventsType.SEND_PG_ADD_MANDATE_START
  | PGEventsType.SEND_PG_ADD_MANDATE_UX_SUCCESS
  | PGEventsType.SEND_PG_MANDATES_GIVEN
  | PGEventsType.SEND_PG_MANDATES_RECEIVED;

export const mandateTrackingConfigs: TrackingConfigs<MandateEventType> = {
  [PGEventsType.SEND_PG_ADD_MANDATE_START]: () => uxAction(),
  [PGEventsType.SEND_PG_ADD_MANDATE_UX_SUCCESS]: (data) =>
    uxConfirm(mapAddMandateSuccessToEventPayload(data)),
  [PGEventsType.SEND_PG_MANDATES_GIVEN]: () => uxScreenView(),
  [PGEventsType.SEND_PG_MANDATES_RECEIVED]: () => uxScreenView(),
};
