import { koError } from '@pagopa-pn/pn-commons';

import { PAEventsType } from '../../models/PAEventsType';
import { mapToastErrorToEventPayload } from './mappers/errorPayloadMappers';
import { TrackingConfigs } from './trackingTypes';

type ErrorEventType = PAEventsType.SEND_PA_TOAST_ERROR;

export const errorTrackingConfigs: TrackingConfigs<ErrorEventType> = {
  [PAEventsType.SEND_PA_TOAST_ERROR]: (data) => koError(mapToastErrorToEventPayload(data)),
};
