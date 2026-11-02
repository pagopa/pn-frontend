import { InstitutionsApi } from '../Institutions.api';

// TODO: test the BFF call with MockAdapter on apiClient once the API is available
describe('Institutions api tests', () => {
  it('getInstitutions - pagination with lastKey', async () => {
    const firstPage = await InstitutionsApi.getInstitutions({ limit: 2 });
    expect(firstPage.items).toHaveLength(2);
    expect(firstPage.items[0].institutionName).toBe('Ente Provvisorio 01');
    expect(firstPage.lastKey).toBe('2');

    const lastPage = await InstitutionsApi.getInstitutions({
      limit: 2,
      lastKey: firstPage.lastKey,
    });
    expect(lastPage.items).toHaveLength(1);
    expect(lastPage.items[0].institutionName).toBe('Ente Provvisorio 03');
    expect(lastPage.lastKey).toBeUndefined();
  });

  it('getInstitutions - search by name or tax code', async () => {
    const byName = await InstitutionsApi.getInstitutions({ search: 'provvisorio 02' });
    expect(byName.items).toHaveLength(1);
    expect(byName.items[0].institutionName).toBe('Ente Provvisorio 02');

    const byTaxCode = await InstitutionsApi.getInstitutions({ search: '99999999903' });
    expect(byTaxCode.items).toHaveLength(1);
    expect(byTaxCode.items[0].institutionTaxCode).toBe('99999999903');
  });
});
