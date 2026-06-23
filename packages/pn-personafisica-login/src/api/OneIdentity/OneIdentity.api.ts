import type { IDP } from '@pagopa/mui-italia';

import { OidcAuthorizeParams, OidcAuthorizeResponse } from '../../models/OneIdentity';
import { getConfiguration } from '../../services/configuration.service';

export const OneIdentityApi = {
  getIdps: async (): Promise<Array<IDP>> => {
    const { ONE_IDENTITY_BASE_URL } = getConfiguration();
    const response = await fetch(`${ONE_IDENTITY_BASE_URL}/idps`);

    return response.json() as Promise<Array<IDP>>;
  },
  authorize: async ({
    entityId,
    aar,
    retrievalId,
  }: OidcAuthorizeParams): Promise<OidcAuthorizeResponse> => {
    const { API_BASE_URL } = getConfiguration();
    const params = new URLSearchParams({ idp: entityId });

    if (aar) {
      params.set('aar', aar);
    } else if (retrievalId) {
      params.set('retrievalId', retrievalId);
    }

    const response = await fetch(`${API_BASE_URL}oidc-authorize?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Error during OIDC authorize');
    }

    return response.json() as Promise<OidcAuthorizeResponse>;
  },
};
