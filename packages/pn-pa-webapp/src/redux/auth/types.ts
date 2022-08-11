import { BasicUser } from '@pagopa-pn/pn-commons';
import { Role } from '../../models/user';

interface CommonUser extends BasicUser {
  organization: Organization;
  desired_exp: number;
}

export interface Organization {
  id: string;
  roles: Array<Role>;
  fiscal_code: string; // organization fiscal code
  groups?: Array<string>;
}

export interface SelfCareUser extends CommonUser {
  groups?: string;
}

export interface User extends CommonUser  {
  groups?: Array<string>;
}
