import { AppRouteParams, RapidAccess } from '@pagopa-pn/pn-commons';

import { RAPID_ACCESS_STORAGE_KEY, storageRapidAccessOps } from '../storage';

describe('storage utility test', () => {
  it('storage Aar', () => {
    const aar: RapidAccess = {
      param: AppRouteParams.AAR,
      value: 'test-aar',
      origin: 'io',
    };
    storageRapidAccessOps.write(aar);
    expect(sessionStorage.getItem(RAPID_ACCESS_STORAGE_KEY)).toEqual(JSON.stringify(aar));
    expect(storageRapidAccessOps.read()).toEqual(aar);
    storageRapidAccessOps.delete();
    expect(sessionStorage.getItem(RAPID_ACCESS_STORAGE_KEY)).toBeNull();
  });
  it('storageRetrievalId test', () => {
    const retrievalId: RapidAccess = {
      param: AppRouteParams.RETRIEVAL_ID,
      value: 'test-retrieval-id',
    };
    storageRapidAccessOps.write(retrievalId);
    expect(sessionStorage.getItem(RAPID_ACCESS_STORAGE_KEY)).toEqual(JSON.stringify(retrievalId));
    expect(storageRapidAccessOps.read()).toEqual(retrievalId);
    storageRapidAccessOps.delete();
    expect(sessionStorage.getItem(RAPID_ACCESS_STORAGE_KEY)).toBeNull();
  });
});
