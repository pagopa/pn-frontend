import { PFEventsType } from '../../../../../models/PFEventsType';
import type { KoErrorPayload } from './../../shared';
import { buildKoError } from './../../shared';

export const contactSercqEmailRegistry = {
  [PFEventsType.SEND_ADD_SERCQ_SEND_EMAIL_ERROR]: {
    build: (details: KoErrorPayload) => buildKoError(details),
  },
};
