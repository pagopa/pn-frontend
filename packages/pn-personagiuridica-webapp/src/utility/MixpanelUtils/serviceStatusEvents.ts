import { uxScreenView } from '@pagopa-pn/pn-commons';

import { PGEventsType } from '../../models/PGEventsType';
import { TrackingConfigs } from './trackingTypes';

type ServiceStatusEventType = PGEventsType.SEND_PG_SERVICE_STATUS;

export const serviceStatusTrackingConfigs: TrackingConfigs<ServiceStatusEventType> = {
  [PGEventsType.SEND_PG_SERVICE_STATUS]: () => uxScreenView(),
};
