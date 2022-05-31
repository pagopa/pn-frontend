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
