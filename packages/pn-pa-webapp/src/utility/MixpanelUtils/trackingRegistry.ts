import type { TrackedEvent } from '@pagopa-pn/pn-commons';

import type { PAEventPayloads } from '../../models/PAEventPayloads';
import { PAEventsType } from '../../models/PAEventsType';
import { apiKeyTrackingConfigs } from './apiKeyEvents';
import { errorTrackingConfigs } from './errorEvents';
import { newNotificationTrackingConfigs } from './newNotificationEvents';
import { notificationTrackingConfigs } from './notificationEvents';
import { serviceStatusTrackingConfigs } from './serviceStatusEvents';
import { statisticsTrackingConfigs } from './statisticsEvents';
import { superPropertyTrackingConfigs } from './superPropertyEvents';
import { TrackingConfigs } from './trackingTypes';

type PATrackingConfigs = TrackingConfigs<PAEventsType>;

export const paTrackingConfigs: PATrackingConfigs = {
  ...apiKeyTrackingConfigs,
  ...errorTrackingConfigs,
  ...newNotificationTrackingConfigs,
  ...notificationTrackingConfigs,
  ...serviceStatusTrackingConfigs,
  ...statisticsTrackingConfigs,
  ...superPropertyTrackingConfigs,
};

export function getPATrackingConfig<K extends PAEventsType>(
  eventType: K
): ((payload: PAEventPayloads[K]) => TrackedEvent) | undefined {
  return paTrackingConfigs[eventType];
}
