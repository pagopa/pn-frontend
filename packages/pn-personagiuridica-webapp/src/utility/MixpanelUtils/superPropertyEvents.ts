import { superProperty } from '@pagopa-pn/pn-commons';

import { PGHasProperty } from '../../models/PGEventPayloads';
import { PGEventsType } from '../../models/PGEventsType';
import {
  mapBooleanSuperPropertyToPayload,
  mapDigitalDomicileSuperPropertyToPayload,
  mapLanguageSuperPropertyToPayload,
} from './mappers/superPropertyMappers';
import { TrackingConfigs } from './trackingTypes';

type SuperPropertyEventsType =
  | PGHasProperty
  | PGEventsType.SEND_PG_HAS_DIGITAL_DOMICILE
  | PGEventsType.USER_ROLE
  | PGEventsType.SEND_LANGUAGE;

export const superPropertyTrackingConfigs: TrackingConfigs<SuperPropertyEventsType> = {
  [PGEventsType.SEND_LANGUAGE]: (data) => superProperty(mapLanguageSuperPropertyToPayload(data)),
  [PGEventsType.SEND_PG_HAS_EMAIL]: (data) =>
    superProperty(mapBooleanSuperPropertyToPayload(PGEventsType.SEND_PG_HAS_EMAIL, data)),
  [PGEventsType.SEND_PG_HAS_SMS]: (data) =>
    superProperty(mapBooleanSuperPropertyToPayload(PGEventsType.SEND_PG_HAS_SMS, data)),
  [PGEventsType.SEND_PG_HAS_DIGITAL_DOMICILE]: (data) =>
    superProperty(mapDigitalDomicileSuperPropertyToPayload(data)),
  [PGEventsType.SEND_PG_HAS_MANDATE]: (data) =>
    superProperty(mapBooleanSuperPropertyToPayload(PGEventsType.SEND_PG_HAS_MANDATE, data)),
  [PGEventsType.SEND_PG_HAS_MANDATE_GIVEN]: (data) =>
    superProperty(mapBooleanSuperPropertyToPayload(PGEventsType.SEND_PG_HAS_MANDATE_GIVEN, data)),
  [PGEventsType.SEND_PG_HAS_NOTIFICATIONS]: (data) =>
    superProperty(mapBooleanSuperPropertyToPayload(PGEventsType.SEND_PG_HAS_NOTIFICATIONS, data)),
  [PGEventsType.USER_ROLE]: (payload) => superProperty(payload),
};
