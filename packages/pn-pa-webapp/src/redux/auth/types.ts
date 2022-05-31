import { Role } from '../../models/user';

interface CommonUser {
  email: string;
  sessionToken: string;
  name: string;
  family_name: string;
  fiscal_number: string;
  uid: string;
  organization: Organization;
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
