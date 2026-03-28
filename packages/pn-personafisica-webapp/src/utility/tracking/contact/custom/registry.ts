import { mergeRegistries } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../../../models/PFEventsType';
import { PFEventPayloads } from '../../event-payloads';
import { contactCustomCommonRegistry } from './common/registry';
import { contactCustomSercqRegistry } from './sercq/registry';

export const contactCustomRegistry = mergeRegistries<PFEventsType, PFEventPayloads>(
  contactCustomCommonRegistry,
  contactCustomSercqRegistry
);
