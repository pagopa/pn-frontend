import { digitalAddresses } from '../../../../__mocks__/Contacts.mock';
import {
  adminUser,
  adminUserWithGroup,
  operatorUser,
  operatorUserWithGroup,
} from '../../../../__mocks__/User.mock';
import { PGEventsType } from '../../../../models/PGEventsType';
import { ChannelType } from '../../../../models/contacts';
import {
  mapBooleanSuperPropertyToPayload,
  mapBooleanToYesNo,
  mapDigitalDomicileSuperPropertyToPayload,
  mapUserToRole,
} from '../superPropertyMappers';

describe('superPropertyMappers', () => {
  it('should map boolean values to Mixpanel yes/no values', () => {
    expect(mapBooleanToYesNo(true)).toBe('yes');
    expect(mapBooleanToYesNo(false)).toBe('no');
  });

  it('should map domain user role to Mixpanel USER_ROLE values', () => {
    expect(mapUserToRole(adminUser)).toStrictEqual({
      [PGEventsType.USER_ROLE]: 'admin',
    });

    expect(mapUserToRole(adminUserWithGroup)).toStrictEqual({
      [PGEventsType.USER_ROLE]: 'group_admin',
    });

    expect(mapUserToRole(operatorUser)).toStrictEqual({
      [PGEventsType.USER_ROLE]: 'operator',
    });

    expect(mapUserToRole(operatorUserWithGroup)).toStrictEqual({
      [PGEventsType.USER_ROLE]: 'group_operator',
    });
  });

  it('should map boolean super property event data to yes payload', () => {
    const payload = mapBooleanSuperPropertyToPayload(PGEventsType.SEND_PG_HAS_EMAIL, {
      value: true,
    });

    expect(payload).toStrictEqual({
      [PGEventsType.SEND_PG_HAS_EMAIL]: 'yes',
    });
  });

  it('should map boolean super property event data to no payload', () => {
    const payload = mapBooleanSuperPropertyToPayload(PGEventsType.SEND_PG_HAS_MANDATE_GIVEN, {
      value: false,
    });

    expect(payload).toStrictEqual({
      [PGEventsType.SEND_PG_HAS_MANDATE_GIVEN]: 'no',
    });
  });

  it('should map digital domicile super property event data to digital domicile payload', () => {
    const payload = mapDigitalDomicileSuperPropertyToPayload({
      addresses: digitalAddresses,
    });

    expect(payload).toStrictEqual({
      [PGEventsType.SEND_PG_HAS_DIGITAL_DOMICILE]: ChannelType.PEC,
    });
  });
});
