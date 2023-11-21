import { BasicUser } from '@pagopa-pn/pn-commons';

import { Role } from '../../models/user';

export interface User extends BasicUser {
  organization: Organization;
  desired_exp: number;
}

export interface Organization {
  parentDescription?: string;
  id: string;
  roles: Array<Role>;
  fiscal_code: string; // organization fiscal code
  groups?: Array<string>;
  hasGroups?: boolean;
  name: string;
  subUnitCode?: string;
  subUnitType?: string;
  aooParent?: string;
  rootParent?: {
    id?: string;
    description?: string;
  };
}
