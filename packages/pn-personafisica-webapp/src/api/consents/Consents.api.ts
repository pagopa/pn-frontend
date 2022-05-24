import { apiClient } from '../axios';
import { Consent, ConsentActionType, ConsentPath } from '../../models/consents';

export const ConsentsApi = {
  getConsentByType: (consentPath: ConsentPath): Promise<Consent> =>
    apiClient
      .get<Consent>(`/user-consents/v1/consents/${consentPath}`)
      .then((response) => response.data),
  setConsentByType: (
    consentPath: ConsentPath,
    body: { action: ConsentActionType }
  ): Promise<string> =>
    apiClient.put<Consent>(`/user-consents/v1/consents/${consentPath}`, body).then((response) => {
      if (response.status === 200) {
        return 'success';
      } else {
        return 'error';
      }
    }),
};
