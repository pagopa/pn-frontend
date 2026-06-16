import { getLangCode } from '@pagopa-pn/pn-commons';

import type {
  BooleanSuperPropertyEventData,
  DigitalDomicileSuperPropertyEventData,
  LanguageSuperPropertyEventData,
  PGDigitalDomicilePayload,
  PGEventPayloads,
  PGHasPayload,
  PGHasProperty,
  PGLanguagePayload,
  YesNo,
} from '../../../models/PGEventPayloads';
import { PGEventsType } from '../../../models/PGEventsType';
import { PNRole, type User } from '../../../models/User';
import { mapDigitalDomicileToType } from './contactPayloadMappers';

export const mapUserToRole = (user: User): PGEventPayloads[PGEventsType.USER_ROLE] => {
  const role = user.organization?.roles?.[0]?.role;

  if (role === PNRole.ADMIN) {
    return {
      [PGEventsType.USER_ROLE]: user.hasGroup ? 'group_admin' : 'admin',
    };
  }

  return {
    [PGEventsType.USER_ROLE]: user.hasGroup ? 'group_operator' : 'operator',
  };
};

export const mapBooleanToYesNo = (value: boolean): YesNo => (value ? 'yes' : 'no');

export const mapBooleanSuperPropertyToPayload = <K extends PGHasProperty>(
  property: K,
  { value }: BooleanSuperPropertyEventData
): PGHasPayload<K> =>
  ({
    [property]: mapBooleanToYesNo(value),
  } as PGHasPayload<K>);

export const mapDigitalDomicileSuperPropertyToPayload = (
  data: DigitalDomicileSuperPropertyEventData
): PGDigitalDomicilePayload => ({
  [PGEventsType.SEND_PG_HAS_DIGITAL_DOMICILE]:
    data.addresses === undefined ? data.value : mapDigitalDomicileToType(data.addresses),
});

export const mapLanguageSuperPropertyToPayload = ({
  language,
}: LanguageSuperPropertyEventData): PGLanguagePayload => ({
  [PGEventsType.SEND_LANGUAGE]: getLangCode(language),
});
