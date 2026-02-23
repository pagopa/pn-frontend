import { PFEventsType } from '../../../../../models/PFEventsType';
import type { KoErrorPayload } from './../../shared';
import { buildKoError } from './../../shared';

export const contactSercqPecRegistry = {
  [PFEventsType.SEND_ADD_SERCQ_SEND_PEC_ERROR]: {
    build: (details: KoErrorPayload) => buildKoError(details),
  },
  [PFEventsType.SEND_ADD_SERCQ_SEND_PEC_TOS_MANDATORY]: {
    build: (details: KoErrorPayload) => buildKoError(details),
  },
};
