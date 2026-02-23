import { PFEventsType } from '../../../../../models/PFEventsType';
import type { KoErrorPayload } from './../../shared';
import { buildKoError } from './../../shared';

export const contactCustomCommonRegistry = {
  [PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SELECTION_MISSING]: {
    build: (details: KoErrorPayload) => buildKoError(details),
  },
  [PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_TOS_MANDATORY]: {
    build: (details: KoErrorPayload) => buildKoError(details),
  },
};
