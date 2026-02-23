import { PFEventsType } from '../../models/PFEventsType';
import { KoErrorPayload, SendAddAddressPayload } from './contact/shared';
import { BannerPayload } from './notification/banner/shared';

export type PFEventPayloads = {
  [PFEventsType.SEND_BANNER]: BannerPayload;
  [PFEventsType.SEND_TAP_BANNER]: BannerPayload;
  [PFEventsType.SEND_CLOSE_BANNER]: BannerPayload;

  [PFEventsType.SEND_ADD_ADDRESS]: SendAddAddressPayload;

  [PFEventsType.SEND_LANDING_PAGE]: void;

  [PFEventsType.SEND_ADD_SERCQ_SEND_PEC_ERROR]: KoErrorPayload;
  [PFEventsType.SEND_ADD_SERCQ_SEND_EMAIL_ERROR]: KoErrorPayload;
  [PFEventsType.SEND_ADD_SERCQ_SEND_SMS_ERROR]: KoErrorPayload;
  [PFEventsType.SEND_ADD_SERCQ_SEND_PEC_TOS_MANDATORY]: KoErrorPayload;
  [PFEventsType.SEND_ADD_SERCQ_SEND_TOS_MANDATORY]: KoErrorPayload;
  [PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_SELECTION_MISSING]: KoErrorPayload;
  [PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT_TOS_MANDATORY]: KoErrorPayload;

  [PFEventsType.SEND_ACCEPT_DELEGATION]: void;

  [PFEventsType.SEND_ACTIVE_IO_UX_SUCCESS]: boolean;
};
