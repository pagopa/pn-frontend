import type { PGEventPayloads, YesNo } from '../../../models/PGEventPayloads';
import { PGEventsType } from '../../../models/PGEventsType';
import { PNRole, type User } from '../../../models/User';

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
