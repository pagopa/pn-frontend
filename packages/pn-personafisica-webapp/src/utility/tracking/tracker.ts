import { createEventTracker } from '@pagopa-pn/pn-commons';

import type { PFEventsType } from '../../models/PFEventsType';
import type { PFEventPayloads } from './event-payloads';
import { eventsRegistry } from './events.registry';

export const tracker = createEventTracker<PFEventsType, PFEventPayloads>(eventsRegistry);
