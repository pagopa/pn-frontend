export enum ConsentType {
  TOS = 'TOS',
  DATAPRIVACY = 'DATAPRIVACY',
  TOS_SERCQ = 'TOS_SERCQ',
  TOS_DEST_B2B = 'TOS_DEST_B2B',
}

export enum ConsentActionType {
  ACCEPT = 'ACCEPT',
  DECLINE = 'DECLINE',
}

export interface TosPrivacyConsent {
  recipientId: string;
  consentType: ConsentType;
  accepted: boolean;
  isFirstAccept: boolean;
  consentVersion: string;
}
