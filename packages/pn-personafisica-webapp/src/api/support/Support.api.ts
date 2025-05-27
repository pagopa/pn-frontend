import { ZendeskAuthorizationDTO, ZendeskAuthorizationRequest } from '../../models/Support';
import { apiClient } from '../apiClients';
import { ZENDESK_AUTHORIZATION } from './support.routes';

export const SupportApi = {
  zendeskAuthorization: (params: ZendeskAuthorizationRequest): Promise<ZendeskAuthorizationDTO> =>
    apiClient
      .post<ZendeskAuthorizationDTO>(ZENDESK_AUTHORIZATION(), params)
      .then((response) => response.data),
};
