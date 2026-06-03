import { uxAction, uxConfirm, uxScreenView } from '@pagopa-pn/pn-commons';

import { PAEventsType } from '../../models/PAEventsType';
import { TrackingConfigs } from './trackingTypes';

type ApiKeyEventType =
  | PAEventsType.SEND_PA_ADD_API_START
  | PAEventsType.SEND_PA_ADD_API_UX_SUCCESS
  | PAEventsType.SEND_PA_API_INTEGRATIONS;

export const apiKeyTrackingConfigs: TrackingConfigs<ApiKeyEventType> = {
  [PAEventsType.SEND_PA_ADD_API_START]: () => uxAction(),
  [PAEventsType.SEND_PA_ADD_API_UX_SUCCESS]: () => uxConfirm(),
  [PAEventsType.SEND_PA_API_INTEGRATIONS]: () => uxScreenView(),
};
