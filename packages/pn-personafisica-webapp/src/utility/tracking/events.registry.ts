import { mergeRegistries } from '@pagopa-pn/pn-commons';

import type { PFEventsType } from '../../models/PFEventsType';
import { commonRegistry } from './common/registry';
import { contactRegistry } from './contact/registry';
import type { PFEventPayloads } from './event-payloads';
import { mandateRegistry } from './mandate/registry';
import { notificationRegistry } from './notification/registry';
import { profileRegistry } from './profile/registry';
import { tppRegistry } from './tpp/registry';

export const eventsRegistry = mergeRegistries<PFEventsType, PFEventPayloads>(
  commonRegistry,
  contactRegistry,
  mandateRegistry,
  notificationRegistry,
  profileRegistry,
  tppRegistry
);
