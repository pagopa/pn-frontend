import { uxAction, uxScreenView } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../../../models/PFEventsType';
import type { BannerPayload } from './shared';

export const notificationBannerRegistry = {
  [PFEventsType.SEND_BANNER]: {
    build: (payload: BannerPayload) => uxScreenView(payload),
  },
  [PFEventsType.SEND_TAP_BANNER]: {
    build: (payload: BannerPayload) => uxAction(payload),
  },
  [PFEventsType.SEND_CLOSE_BANNER]: {
    build: (payload: BannerPayload) => uxAction(payload),
  },
};
