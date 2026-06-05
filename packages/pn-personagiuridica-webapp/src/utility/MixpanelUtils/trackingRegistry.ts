import type { TrackedEvent } from '@pagopa-pn/pn-commons';

import { PGEventPayloads } from '../../models/PGEventPayloads';
import { PGEventsType } from '../../models/PGEventsType';
import { apiKeyTrackingConfigs } from './apiKeyEvents';
import { contactTrackingConfigs } from './contactEvents';
import { errorTrackingConfigs } from './errorEvents';
import { mandateTrackingConfigs } from './mandateEvents';
import { navigationTrackingConfigs } from './navigationEvents';
import { notificationTrackingConfigs } from './notificationEvents';
import { serviceStatusTrackingConfigs } from './serviceStatusEvents';
import { superPropertyTrackingConfigs } from './superPropertyEvents';
import { TrackingConfigs } from './trackingTypes';

type PGTrackingConfigs = TrackingConfigs<PGEventsType>;

export const pgTrackingConfigs: PGTrackingConfigs = {
  ...apiKeyTrackingConfigs,
  ...contactTrackingConfigs,
  ...errorTrackingConfigs,
  ...mandateTrackingConfigs,
  ...navigationTrackingConfigs,
  ...notificationTrackingConfigs,
  ...serviceStatusTrackingConfigs,
  ...superPropertyTrackingConfigs,
};

export function getPGTrackingConfig<K extends PGEventsType>(
  eventType: K
): ((payload: PGEventPayloads[K]) => TrackedEvent) | undefined {
  return pgTrackingConfigs[eventType];
}
