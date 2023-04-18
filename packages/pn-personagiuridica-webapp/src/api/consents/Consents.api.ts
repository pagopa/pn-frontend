import { Consent, ConsentActionType, ConsentType } from '../../models/consents';
import { apiClient } from '../apiClients';
import { GET_CONSENTS, SET_CONSENTS } from './consents.routes';

export const ConsentsApi = {
  getConsentByType: (consentType: ConsentType): Promise<Consent> =>
    apiClient
      .get<Consent>(GET_CONSENTS(consentType))
      .then((response) => response.data),

  setConsentByType: (
    consentType: ConsentType,
    consentVersion: string,
    body: { action: ConsentActionType }
  ): Promise<string> =>
    apiClient.put<Consent>(SET_CONSENTS(consentType, consentVersion), body).then((response) => {
      if (response.status === 200) {
        return 'success';
      } else {
        return 'error';
      }
    }),
};
