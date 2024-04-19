import { ConsentType } from '@pagopa-pn/pn-commons';

import { BffTosPrivacyActionBodyActionEnum } from '../generated-client/tos-privacy';

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

export const acceptTosPrivacyConsentBodyMock = {
  tos: {
    action: BffTosPrivacyActionBodyActionEnum.Accept,
    version: 'mock-version-1',
  },
  privacy: {
    action: BffTosPrivacyActionBodyActionEnum.Accept,
    version: 'mock-version-1',
  },
};
