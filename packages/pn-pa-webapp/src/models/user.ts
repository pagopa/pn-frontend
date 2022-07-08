export interface Role {
  role: string;
  partyRole: PartyRole;
}

export enum PartyRole {
  DELEGATE = 'DELEGATE', // not managed by PN
  MANAGER = 'MANAGER',
  OPERATOR = 'OPERATOR',
  SUB_DELEGATE = 'SUB_DELEGATE', // not managed by PN
}
