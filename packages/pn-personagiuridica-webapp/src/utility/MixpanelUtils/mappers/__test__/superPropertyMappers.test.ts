import {
  adminUser,
  adminUserWithGroup,
  operatorUser,
  operatorUserWithGroup,
} from '../../../../__mocks__/User.mock';
import { PGEventsType } from '../../../../models/PGEventsType';
import { mapBooleanToYesNo, mapUserToRole } from '../superPropertyMappers';

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
});
