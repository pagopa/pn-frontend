export enum ConsentType {
  TOS = 'TOS',
  DATAPRIVACY = 'DATAPRIVACY',
}

export enum ConsentPath {
  tos = 'tos',
  dataprivacy = 'dataprivacy',
}

export enum ConsentActionType {
  ACCEPT = 'ACCEPT',
  REFUSE = 'REFUSE',
}

export interface Consent {
  recipientId: string;
  consentType: ConsentType;
  accepted: boolean;
  isFirstAccept: boolean;
  consentVersion: string;
}
