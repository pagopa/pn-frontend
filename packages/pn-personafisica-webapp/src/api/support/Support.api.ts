import { ZendeskAuthorizationDTO } from '../../models/Support';
import { apiClient } from '../apiClients';
import { ZENDESK_AUTHORIZATION } from './support.routes';

export const SupportApi = {
  zendeskAuthorization: (params: string): Promise<ZendeskAuthorizationDTO> =>
    apiClient
      .post<ZendeskAuthorizationDTO>(ZENDESK_AUTHORIZATION(), { email: params })
      .then((response) => response.data),
};
