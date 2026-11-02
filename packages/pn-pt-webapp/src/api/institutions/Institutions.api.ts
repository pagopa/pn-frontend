import {
  GetInstitutionsParams,
  InstitutionRow,
  InstitutionsResponse,
} from '../../models/Institutions';

// import { apiClient } from '../apiClients';
// import { INSTITUTIONS_LIST } from './institutions.routes';

// TODO: remove the temporary data and restore the BFF call once the API is available
const temporaryInstitutions: Array<InstitutionRow> = [
  {
    institutionId: 'aaaaaaaa-0000-0000-0000-000000000001',
    institutionName: 'Ente Provvisorio 01',
    institutionTaxCode: '99999999901',
    delegationId: 'bbbbbbbb-0000-0000-0000-000000000001',
    status: 'ACTIVE',
    statusChangedAt: '2026-01-01T09:30:00.000Z',
  },
  {
    institutionId: 'aaaaaaaa-0000-0000-0000-000000000002',
    institutionName: 'Ente Provvisorio 02',
    institutionTaxCode: '99999999902',
    delegationId: 'bbbbbbbb-0000-0000-0000-000000000002',
    status: 'REVOKED',
    statusChangedAt: '2026-01-01T09:30:00.000Z',
  },
  {
    institutionId: 'aaaaaaaa-0000-0000-0000-000000000003',
    institutionName: 'Ente Provvisorio 03',
    institutionTaxCode: '99999999903',
    delegationId: 'bbbbbbbb-0000-0000-0000-000000000003',
    status: 'REVOKED',
    statusChangedAt: '2026-01-01T09:30:00.000Z',
  },
];

export const InstitutionsApi = {
  getInstitutions: ({
    search,
    limit = 10,
    lastKey,
  }: GetInstitutionsParams): Promise<InstitutionsResponse> => {
    const normalizedSearch = search?.toLowerCase() ?? '';
    const filtered = temporaryInstitutions.filter(
      (institution) =>
        institution.institutionName.toLowerCase().includes(normalizedSearch) ||
        institution.institutionTaxCode.includes(normalizedSearch)
    );
    const start = lastKey ? Number(lastKey) : 0;
    const end = start + limit;
    return Promise.resolve({
      items: filtered.slice(start, end),
      lastKey: end < filtered.length ? String(end) : undefined,
    });
  },
  // apiClient
  //   .get<InstitutionsResponse>(INSTITUTIONS_LIST(), { params })
  //   .then((response) => response.data),
};
