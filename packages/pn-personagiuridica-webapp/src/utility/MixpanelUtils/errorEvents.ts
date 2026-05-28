import { koError } from '@pagopa-pn/pn-commons';

import { PGEventsType } from '../../models/PGEventsType';
import { TrackingConfigs } from './trackingTypes';

type ErrorEventType = PGEventsType.SEND_PG_TOAST_ERROR;

export const errorTrackingConfigs: TrackingConfigs<ErrorEventType> = {
  [PGEventsType.SEND_PG_TOAST_ERROR]: (payload) => koError(payload),
};
