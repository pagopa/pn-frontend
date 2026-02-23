import { PFEventsType } from '../../../../../models/PFEventsType';
import type { KoErrorPayload } from './../../shared';
import { buildKoError } from './../../shared';

export const contactSercqCommonRegistry = {
  [PFEventsType.SEND_ADD_SERCQ_SEND_TOS_MANDATORY]: {
    build: (details: KoErrorPayload) => buildKoError(details),
  },
};
