import { Consent, ConsentActionType, ConsentType } from '../../models/consents';
import { apiClient } from '../axios';
import { CONSENTS } from './consents.routes';

export const ConsentsApi = {
  getConsentByType: (consentType: ConsentType): Promise<Consent> =>
    apiClient
      .get<Consent>(CONSENTS(consentType))
      .then((response) => response.data),
      // .then((response) => ({...response.data, accepted: false})),
      // .then(() => Promise.reject({ response: { status: 500 } })),

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
