import { PFEventsType } from '../../../../../models/PFEventsType';
import type { KoErrorPayload } from './../../shared';
import { buildKoError } from './../../shared';

export const contactSercqSmsRegistry = {
  [PFEventsType.SEND_ADD_SERCQ_SEND_SMS_ERROR]: {
    build: (details: KoErrorPayload) => buildKoError(details),
  },
};
