import { mergeRegistries } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../../models/PFEventsType';
import { PFEventPayloads } from '../event-payloads';
import { contactCommonRegistry } from './common/registry';
import { contactCustomRegistry } from './custom/registry';
import { contactEmailRegistry } from './email/registry';
import { contactIoRegistry } from './io/registry';
import { contactPecRegistry } from './pec/registry';
import { contactSercqRegistry } from './sercq/registry';

export const contactRegistry = mergeRegistries<PFEventsType, PFEventPayloads>(
  contactCommonRegistry,
  contactCustomRegistry,
  contactEmailRegistry,
  contactIoRegistry,
  contactPecRegistry,
  contactSercqRegistry
);
