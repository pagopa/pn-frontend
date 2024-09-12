import { ConsentActionType, ConsentType } from '@pagopa-pn/pn-commons';

export const tosConsentMock = (accepted: boolean) => ({
  recipientId: 'mocked-recipientId',
  consentType: ConsentType.TOS,
  accepted,
  isFirstAccept: true,
  consentVersion: 'mocked-version',
});

export const privacyConsentMock = (accepted: boolean) => ({
  recipientId: 'mocked-recipientId',
  consentType: ConsentType.DATAPRIVACY,
  accepted,
  isFirstAccept: true,
  consentVersion: 'mocked-version',
});

export const tosPrivacyConsentMock = (tosAccepted: boolean, privacyAccepted: boolean) => ({
  tos: tosConsentMock(tosAccepted),
  privacy: privacyConsentMock(privacyAccepted),
});

export const acceptTosPrivacyConsentBodyMock = [
  {
    action: ConsentActionType.ACCEPT,
    version: 'mock-version-1',
    type: ConsentType.TOS,
  },
  {
    action: ConsentActionType.ACCEPT,
    version: 'mock-version-1',
    type: ConsentType.DATAPRIVACY,
  },
];
