import { mergeRegistries } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../../models/PFEventsType';
import { PFEventPayloads } from '../event-payloads';
import { notificationBannerRegistry } from './banner/registry';
import { notificationCommonRegistry } from './common/registry';
import { notificationDownloadRegistry } from './download/registry';
import { notificationPaymentRegistry } from './payment/registry';

export const notificationRegistry = mergeRegistries<PFEventsType, PFEventPayloads>(
  notificationBannerRegistry,
  notificationCommonRegistry,
  notificationDownloadRegistry,
  notificationPaymentRegistry
);
