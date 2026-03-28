import { mergeRegistries } from '@pagopa-pn/pn-commons/';

import { PFEventsType } from '../../../../models/PFEventsType';
import { PFEventPayloads } from '../../event-payloads';
import { contactSercqCommonRegistry } from './common/registry';
import { contactSercqEmailRegistry } from './email/registry';
import { contactSercqIoRegistry } from './io/registry';
import { contactSercqPecRegistry } from './pec/registry';
import { contactSercqSmsRegistry } from './sms/registry';

export const contactSercqRegistry = mergeRegistries<PFEventsType, PFEventPayloads>(
  contactSercqCommonRegistry,
  contactSercqEmailRegistry,
  contactSercqIoRegistry,
  contactSercqPecRegistry,
  contactSercqSmsRegistry
);
