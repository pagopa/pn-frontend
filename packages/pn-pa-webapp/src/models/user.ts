export interface Role {
  role: string;
  partyRole: PartyRole;
}

export enum PartyRole {
  DELEGATE = 'DELEGATE',
  MANAGER = 'MANAGER',
  OPERATOR = 'OPERATOR',
  SUB_DELEGATE = 'SUB_DELEGATE',
}

export enum GroupStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  status: GroupStatus;
}