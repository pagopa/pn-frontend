import { uxScreenView } from '@pagopa-pn/pn-commons';

import { PAEventsType } from '../../models/PAEventsType';
import { TrackingConfigs } from './trackingTypes';

type ServiceStatusEventType = PAEventsType.SEND_PA_SERVICE_STATUS;

export const serviceStatusTrackingConfigs: TrackingConfigs<ServiceStatusEventType> = {
  [PAEventsType.SEND_PA_SERVICE_STATUS]: () => uxScreenView(),
};
