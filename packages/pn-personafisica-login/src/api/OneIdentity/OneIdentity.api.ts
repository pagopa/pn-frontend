import { IDPS_MOCK } from '../../__mocks__/IDPS.mock';
import { IDP } from '../../models/IDPS';
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
};
