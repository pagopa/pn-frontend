import { uxAction, uxConfirm, uxScreenView } from '@pagopa-pn/pn-commons';

import { PGEventsType } from '../../models/PGEventsType';
import { TrackingConfigs } from './trackingTypes';

type ContactEventType =
  | PGEventsType.SEND_PG_YOUR_CONTACT_DETAILS
  // SERCQ
  | PGEventsType.SEND_PG_ADD_SERCQ_START
  | PGEventsType.SEND_PG_ADD_SERCQ_UX_SUCCESS
  | PGEventsType.SEND_PG_REMOVE_SERCQ_START
  | PGEventsType.SEND_PG_REMOVE_SERCQ_UX_SUCCESS
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
  [PGEventsType.SEND_PG_ADD_SERCQ_START]: () => uxAction(),
  [PGEventsType.SEND_PG_ADD_SERCQ_UX_SUCCESS]: () => uxConfirm(),
  [PGEventsType.SEND_PG_REMOVE_SERCQ_START]: () => uxAction(),
  [PGEventsType.SEND_PG_REMOVE_SERCQ_UX_SUCCESS]: () => uxConfirm(),
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
