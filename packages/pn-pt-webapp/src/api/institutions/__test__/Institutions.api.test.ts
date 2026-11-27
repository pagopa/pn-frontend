import MockAdapter from 'axios-mock-adapter';

import { getInstitutionsResponse } from '../../../__mocks__/Institutions.mock';
import { apiClient } from '../../apiClients';
import { InstitutionsApi } from '../Institutions.api';

describe('Institutions api tests', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('getInstitutions - first page', async () => {
    const params = { limit: 10 };
    const expected = getInstitutionsResponse(params);
    mock.onGet(/\/bff\/v1\/pt\/institutions.*/).reply(200, expected);

    const result = await InstitutionsApi.getInstitutions(params);
    expect(result).toStrictEqual(expected);
    expect(mock.history.get).toHaveLength(1);
    expect(mock.history.get[0].url).toBe('/bff/v1/pt/institutions?limit=10');
  });

  it('getInstitutions - search, status and lastKey are sent as query params', async () => {
    const params = { search: 'fittizio', status: 'ACTIVE' as const, limit: 10, lastKey: '10' };
    const expected = getInstitutionsResponse(params);
    mock.onGet(/\/bff\/v1\/pt\/institutions.*/).reply(200, expected);

    const result = await InstitutionsApi.getInstitutions(params);
    expect(result).toStrictEqual(expected);

    const [path, query] = mock.history.get[0].url!.split('?');
    expect(path).toBe('/bff/v1/pt/institutions');
    expect(Object.fromEntries(new URLSearchParams(query))).toStrictEqual({
      search: 'fittizio',
      status: 'ACTIVE',
      limit: '10',
      lastKey: '10',
    });
  });
});
