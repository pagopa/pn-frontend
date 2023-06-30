import { BasicUser } from '@pagopa-pn/pn-commons';

export enum PNRole {
  ADMIN = 'pg-admin', // ref amministrativo
  OPERATOR = 'pg-operator', // ref tecnico
}

export enum PartyRole {
  DELEGATE = 'DELEGATE', // not managed by PN
  MANAGER = 'MANAGER',
  OPERATOR = 'OPERATOR',
  SUB_DELEGATE = 'SUB_DELEGATE', // not managed by PN
}

export interface Role {
  role: PNRole;
  partyRole: PartyRole;
}

export interface Organization {
  id: string;
  name: string;
  roles: Array<Role>;
  fiscal_code: string; // organization fiscal code
  groups?: Array<string>;
}

export interface User extends BasicUser {
  from_aa: boolean;
  aud: string;
  level: string;
  iat: number;
  exp: number;
  iss: string;
  jti: string;
  organization: Organization;
  desired_exp: number;
  hasGroup?: boolean;
}
