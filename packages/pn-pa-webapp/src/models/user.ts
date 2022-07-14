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
  ADMIN = 'admin',
  OPERATOR = 'operator'
}
