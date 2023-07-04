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
  description: string;
  status: GroupStatus;
}

export enum PNRole {
  ADMIN = 'admin', // ref amministrativo
  OPERATOR = 'operator', // ref tecnico
}
