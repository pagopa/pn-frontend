import { ConsentActionType, ConsentType } from '@pagopa-pn/pn-commons';

type FilterStartingWith<Set, Needle extends string> = Set extends `${Needle}${infer _X}`
  ? Set
  : never;

export const tosConsentMock = (
  accepted: boolean,
  type: FilterStartingWith<ConsentType, 'TOS'> = ConsentType.TOS
) => ({
  recipientId: 'mocked-recipientId',
  consentType: type,
  accepted,
  isFirstAccept: true,
  consentVersion: '1',
});

export const privacyConsentMock = (
  accepted: boolean,
  type: FilterStartingWith<ConsentType, 'DATAPRIVACY'> = ConsentType.DATAPRIVACY
) => ({
  recipientId: 'mocked-recipientId',
  consentType: type,
  accepted,
  isFirstAccept: true,
  consentVersion: '1',
});

export const tosPrivacyConsentMock = (tosAccepted: boolean, privacyAccepted: boolean) => [
  tosConsentMock(tosAccepted),
  privacyConsentMock(privacyAccepted),
];

export const sercqSendTosPrivacyConsentMock = (tosAccepted: boolean) => [
  tosConsentMock(tosAccepted, ConsentType.TOS_SERCQ),
];

export const acceptTosSercqSendBodyMock = [
  {
    action: ConsentActionType.ACCEPT,
    version: '1',
    type: ConsentType.TOS_SERCQ,
  },
];

export const acceptTosPrivacyConsentBodyMock = (
  tosType: FilterStartingWith<ConsentType, 'TOS'> = ConsentType.TOS,
  privacyType: FilterStartingWith<ConsentType, 'DATAPRIVACY'> = ConsentType.DATAPRIVACY
) => [
  {
    action: ConsentActionType.ACCEPT,
    version: '1',
    type: tosType,
  },
  {
    action: ConsentActionType.ACCEPT,
    version: '1',
    type: privacyType,
  },
];
