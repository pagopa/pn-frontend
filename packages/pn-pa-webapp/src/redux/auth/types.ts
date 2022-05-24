import { Role } from '../../models/user';
export interface User {
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
