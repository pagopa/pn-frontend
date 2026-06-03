import { uxScreenView } from '@pagopa-pn/pn-commons';

import { PAEventsType } from '../../models/PAEventsType';
import { TrackingConfigs } from './trackingTypes';

type StatisticsEventType = PAEventsType.SEND_PA_STATISTICS;

export const statisticsTrackingConfigs: TrackingConfigs<StatisticsEventType> = {
  [PAEventsType.SEND_PA_STATISTICS]: () => uxScreenView(),
};
