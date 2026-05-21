import type { TrackedEvent } from '@pagopa-pn/pn-commons';

import { PGEventPayloads } from '../../models/PGEventPayloads';
import { PGEventsType } from '../../models/PGEventsType';
import { contactTrackingConfigs } from './contactEvents';
import { mandateTrackingConfigs } from './mandateEvents';
import { navigationTrackingConfigs } from './navigationEvents';
import { notificationTrackingConfigs } from './notificationEvents';

export type PGTrackingConfigs = Partial<{
  [K in PGEventsType]: (payload: PGEventPayloads[K]) => TrackedEvent;
}>;

export const pgTrackingConfigs: PGTrackingConfigs = {
  ...contactTrackingConfigs,
  ...mandateTrackingConfigs,
  ...navigationTrackingConfigs,
  ...notificationTrackingConfigs,
};

export function getPGTrackingConfig<K extends PGEventsType>(
  eventType: K
): ((payload: PGEventPayloads[K]) => TrackedEvent) | undefined {
  return pgTrackingConfigs[eventType];
}
