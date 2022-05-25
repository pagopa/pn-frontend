import { apiClient } from '../axios';
import { Consent, ConsentActionType, ConsentType } from '../../models/consents';

export const ConsentsApi = {
  getConsentByType: (consentType: ConsentType): Promise<Consent> =>
    apiClient
      .get<Consent>(`/user-consents/v1/consents/${consentType}`)
      .then((response) => response.data),
  setConsentByType: (
    consentType: ConsentType,
    body: { action: ConsentActionType }
  ): Promise<string> =>
    apiClient.put<Consent>(`/user-consents/v1/consents/${consentType}`, body).then((response) => {
      if (response.status === 200) {
        return 'success';
      } else {
        return 'error';
      }
    }),
};
