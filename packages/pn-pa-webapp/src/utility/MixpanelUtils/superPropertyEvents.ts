import { superProperty } from '@pagopa-pn/pn-commons';

import { PAEventsType } from '../../models/PAEventsType';
import { mapBooleanSuperPropertyToPayload } from './mappers/superPropertyMappers';
import { TrackingConfigs } from './trackingTypes';

type SuperPropertyEventsType =
  | PAEventsType.SEND_PA_HAS_NOTIFICATIONS
  | PAEventsType.SEND_PA_HAS_CAMPAIGNS;

export const superPropertyTrackingConfigs: TrackingConfigs<SuperPropertyEventsType> = {
  [PAEventsType.SEND_PA_HAS_CAMPAIGNS]: (data) =>
    superProperty(mapBooleanSuperPropertyToPayload(PAEventsType.SEND_PA_HAS_CAMPAIGNS, data)),
  [PAEventsType.SEND_PA_HAS_NOTIFICATIONS]: (data) =>
    superProperty(mapBooleanSuperPropertyToPayload(PAEventsType.SEND_PA_HAS_NOTIFICATIONS, data)),
};
