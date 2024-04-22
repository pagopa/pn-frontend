export enum ConsentType {
  TOS = 'TOS',
  DATAPRIVACY = 'DATAPRIVACY',
}

export enum ConsentActionType {
  ACCEPT = 'ACCEPT',
  DECLINE = 'DECLINE',
}

interface Consent {
  recipientId: string;
  consentType: ConsentType;
  accepted: boolean;
  isFirstAccept: boolean;
  consentVersion: string;
}

export interface TosPrivacyConsent {
  tos: Consent;
  privacy: Consent;
}
