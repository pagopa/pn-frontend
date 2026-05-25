import { TrackedEvent } from '@pagopa-pn/pn-commons';

import { PGEventPayloads } from '../../models/PGEventPayloads';
import { PGEventsType } from '../../models/PGEventsType';

export type TrackingConfigs<T extends PGEventsType> = {
  [K in T]: (payload: PGEventPayloads[K]) => TrackedEvent;
};
