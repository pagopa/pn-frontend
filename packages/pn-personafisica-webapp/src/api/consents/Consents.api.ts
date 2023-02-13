import { Consent, ConsentActionType, ConsentType } from '../../models/consents';
import { apiClient } from '../apiClients';
import { CONSENTS } from './consents.routes';

export const ConsentsApi = {
  /*
  getConsentByType: (consentType: ConsentType): Promise<Consent> =>
    apiClient
      .get<Consent>(CONSENTS(consentType))
      .then((response) => response.data),
      */

  getConsentByType: (consentType: ConsentType): Promise<Consent> => {
    console.log(consentType);
    return Promise.resolve({
      recipientId: 'ciao',
      consentType: ConsentType.TOS,
      accepted: true,
    });
  },

  setConsentByType: (
    consentType: ConsentType,
    body: { action: ConsentActionType }
  ): Promise<string> =>
    apiClient.put<Consent>(CONSENTS(consentType), body).then((response) => {
      if (response.status === 200) {
        return 'success';
      } else {
        return 'error';
      }
    }),
};
