import { uxAction, uxConfirm, uxScreenView } from '@pagopa-pn/pn-commons';

import { PGEventsType } from '../../models/PGEventsType';
import { TrackingConfigs } from './trackingTypes';

type ContactEventType =
  | PGEventsType.SEND_PG_YOUR_CONTACT_DETAILS
  // SERCQ
  | PGEventsType.SEND_PG_ADD_DIGITAL_DOMICILE_START
  | PGEventsType.SEND_PG_ADD_DIGITAL_DOMICILE_UX_SUCCESS
  | PGEventsType.SEND_PG_REMOVE_DIGITAL_DOMICILE_START
  | PGEventsType.SEND_PG_REMOVE_DIGITAL_DOMICILE_UX_SUCCESS
  | PGEventsType.SEND_PG_ADD_DD_SERCQ_SEND_START
  | PGEventsType.SEND_PG_ADD_DD_PEC_START
  // EMAIL
  | PGEventsType.SEND_PG_ADD_EMAIL_START
  | PGEventsType.SEND_PG_ADD_EMAIL_UX_SUCCESS
  | PGEventsType.SEND_PG_REMOVE_EMAIL_START
  | PGEventsType.SEND_PG_REMOVE_EMAIL_UX_SUCCESS
  // SMS
  | PGEventsType.SEND_PG_ADD_SMS_START
  | PGEventsType.SEND_PG_ADD_SMS_UX_SUCCESS
  | PGEventsType.SEND_PG_REMOVE_SMS_START
  | PGEventsType.SEND_PG_REMOVE_SMS_UX_SUCCESS;

export const contactTrackingConfigs: TrackingConfigs<ContactEventType> = {
  [PGEventsType.SEND_PG_YOUR_CONTACT_DETAILS]: (payload) => uxScreenView(payload),
  // SERCQ
  [PGEventsType.SEND_PG_ADD_DIGITAL_DOMICILE_START]: () => uxAction(),
  [PGEventsType.SEND_PG_ADD_DIGITAL_DOMICILE_UX_SUCCESS]: (payload) => uxConfirm(payload),
  [PGEventsType.SEND_PG_REMOVE_DIGITAL_DOMICILE_START]: () => uxAction(),
  [PGEventsType.SEND_PG_REMOVE_DIGITAL_DOMICILE_UX_SUCCESS]: () => uxConfirm(),
  [PGEventsType.SEND_PG_ADD_DD_SERCQ_SEND_START]: () => uxAction(),
  [PGEventsType.SEND_PG_ADD_DD_PEC_START]: () => uxAction(),
  // EMAIL
  [PGEventsType.SEND_PG_ADD_EMAIL_START]: () => uxAction(),
  [PGEventsType.SEND_PG_ADD_EMAIL_UX_SUCCESS]: () => uxConfirm(),
  [PGEventsType.SEND_PG_REMOVE_EMAIL_START]: () => uxAction(),
  [PGEventsType.SEND_PG_REMOVE_EMAIL_UX_SUCCESS]: () => uxConfirm(),
  // SMS
  [PGEventsType.SEND_PG_ADD_SMS_START]: () => uxAction(),
  [PGEventsType.SEND_PG_ADD_SMS_UX_SUCCESS]: () => uxConfirm(),
  [PGEventsType.SEND_PG_REMOVE_SMS_START]: () => uxAction(),
  [PGEventsType.SEND_PG_REMOVE_SMS_UX_SUCCESS]: () => uxConfirm(),
};
