import type { TrackedEvent } from '@pagopa-pn/pn-commons';

import type { PAEventPayloads } from '../../models/PAEventPayloads';
import { PAEventsType } from '../../models/PAEventsType';

export type TrackingConfigs<T extends PAEventsType> = {
  [K in T]: (payload: PAEventPayloads[K]) => TrackedEvent;
};
