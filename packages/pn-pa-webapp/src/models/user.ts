import { BasicUser } from '@pagopa-pn/pn-commons';

export interface Role {
  role: PNRole;
  partyRole: PartyRole;
}

export enum PartyRole {
  DELEGATE = 'DELEGATE', // not managed by PN
  MANAGER = 'MANAGER',
  OPERATOR = 'OPERATOR',
  SUB_DELEGATE = 'SUB_DELEGATE', // not managed by PN
}

export enum GroupStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export interface UserGroup {
  id: string;
  name: string;
}

export enum PNRole {
  ADMIN = 'admin', // ref amministrativo
  OPERATOR = 'operator', // ref tecnico
}

export interface User extends BasicUser {
  organization: Organization;
  desired_exp: number;
}

export interface Organization {
  id: string;
  roles: Array<Role>;
  fiscal_code: string; // organization fiscal code
  groups?: Array<string>;
  hasGroups?: boolean;
  name: string;
  subUnitCode?: string;
  subUnitType?: string;
  aooParent?: string;
  ipaCode?: string;
  rootParent?: {
    id?: string;
    description?: string;
  };
}
