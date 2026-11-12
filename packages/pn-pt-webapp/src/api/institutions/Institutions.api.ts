import { PtInstitutionsApiFactory } from '../../generated-client/pt-institutions';
import { GetInstitutionsParams, InstitutionsResponse } from '../../models/Institutions';
import { apiClient } from '../apiClients';

export const InstitutionsApi = {
  getInstitutions: async ({
    search,
    status,
    limit,
    lastKey,
  }: GetInstitutionsParams): Promise<InstitutionsResponse> => {
    const ptInstitutionsFactory = PtInstitutionsApiFactory(undefined, undefined, apiClient);
    const response = await ptInstitutionsFactory.getPtInstitutionsV1(
      search,
      status,
      limit,
      lastKey
    );
    return response.data;
  },
};
