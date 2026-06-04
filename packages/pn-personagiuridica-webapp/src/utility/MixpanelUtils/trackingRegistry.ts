import type { TrackedEvent } from '@pagopa-pn/pn-commons';

import { PGEventPayloads } from '../../models/PGEventPayloads';
import { PGEventsType } from '../../models/PGEventsType';
import { mandateTrackingConfigs } from './mandateEvents';
import { notificationTrackingConfigs } from './notificationEvents';

export type PGTrackingConfigs = Partial<{
  [K in PGEventsType]: (payload: PGEventPayloads[K]) => TrackedEvent;
}>;

export const pgTrackingConfigs: PGTrackingConfigs = {
  ...notificationTrackingConfigs,
  ...mandateTrackingConfigs,
};

export function getPGTrackingConfig<K extends PGEventsType>(
  eventType: K
): ((payload: PGEventPayloads[K]) => TrackedEvent) | undefined {
  return pgTrackingConfigs[eventType];
}
