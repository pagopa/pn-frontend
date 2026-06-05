import { uxAction, uxConfirm, uxScreenView } from '@pagopa-pn/pn-commons';

import { PGEventsType } from '../../models/PGEventsType';
import { TrackingConfigs } from './trackingTypes';

type ApiKeyEventType =
  | PGEventsType.SEND_PG_API_INTEGRATION
  | PGEventsType.SEND_PG_ADD_API_START
  | PGEventsType.SEND_PG_ADD_API_UX_SUCCESS;

export const apiKeyTrackingConfigs: TrackingConfigs<ApiKeyEventType> = {
  [PGEventsType.SEND_PG_API_INTEGRATION]: () => uxScreenView(),
  [PGEventsType.SEND_PG_ADD_API_START]: () => uxAction(),
  [PGEventsType.SEND_PG_ADD_API_UX_SUCCESS]: () => uxConfirm(),
};
