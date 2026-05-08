import { IDPS_MOCK } from '../../__mocks__/IDPS.mock';
import { IDP } from '../../models/IDPS';
import {
  OidcAuthorizeParams,
  OidcAuthorizeResponse,
  OidcStateDataResponse,
} from '../../models/OneIdentity';
import { getConfiguration } from '../../services/configuration.service';

export const OneIdentityApi = {
  getIdps: async (): Promise<Array<IDP>> => {
    const { ONE_IDENTITY_BASE_URL } = getConfiguration();
    try {
      const response = await fetch(`${ONE_IDENTITY_BASE_URL}/idps`);

      return response.json() as Promise<Array<IDP>>;
    } catch {
      // TODO - In attesa di risoluzione problema CORS
      return IDPS_MOCK;
    }
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

    const response = await fetch(`${API_BASE_URL}/oidc-authorize?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Error during OIDC authorize');
    }

    return response.json() as Promise<OidcAuthorizeResponse>;
  },
  getOidcStateData: async (state: string): Promise<OidcStateDataResponse> => {
    const { API_BASE_URL } = getConfiguration();
    const params = new URLSearchParams({ state });

    const response = await fetch(`${API_BASE_URL}/oidc-state?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Error during retrieving OIDC state data');
    }

    return response.json() as Promise<OidcStateDataResponse>;
  },
};
