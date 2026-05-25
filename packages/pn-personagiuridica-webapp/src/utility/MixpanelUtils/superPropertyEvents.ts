import { superProperty } from '@pagopa-pn/pn-commons';

import { PGHasProperty } from '../../models/PGEventPayloads';
import { PGEventsType } from '../../models/PGEventsType';
import { TrackingConfigs } from './trackingTypes';

type SuperPropertyEventsType = PGHasProperty | PGEventsType.USER_ROLE;

export const superPropertyTrackingConfigs: TrackingConfigs<SuperPropertyEventsType> = {
  [PGEventsType.USER_ROLE]: (payload) => superProperty(payload),
  [PGEventsType.SEND_PG_HAS_EMAIL]: (payload) => superProperty(payload),
  [PGEventsType.SEND_PG_HAS_SMS]: (payload) => superProperty(payload),
  [PGEventsType.SEND_PG_HAS_SERCQ]: (payload) => superProperty(payload),
  [PGEventsType.SEND_PG_HAS_MANDATE]: (payload) => superProperty(payload),
  [PGEventsType.SEND_PG_HAS_MANDATE_GIVEN]: (payload) => superProperty(payload),
  [PGEventsType.SEND_PG_HAS_NOTIFICATIONS]: (payload) => superProperty(payload),
};
