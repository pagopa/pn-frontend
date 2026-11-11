import { BasicUser, InstitutionType } from '@pagopa-pn/pn-commons';

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

export enum PNRole {
  ADMIN = 'admin', // ref amministrativo
  OPERATOR = 'operator', // ref tecnico
}

export interface User extends BasicUser {
  name?: string;
  family_name?: string;
  fiscal_number?: string;
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
  institutionType: InstitutionType; // only PT institutions can access the app
}
