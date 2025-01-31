import { AppRouteParams } from '@pagopa-pn/pn-commons';

import { STORAGE_RAPID_ACCESS_KEY, storageRapidAccessOps } from '../storage';

describe('storage utility test', () => {
  it('storage Aar', () => {
    const aar: [AppRouteParams, string] = [AppRouteParams.AAR, 'test'];
    storageRapidAccessOps.write(aar);
    expect(sessionStorage.getItem(STORAGE_RAPID_ACCESS_KEY)).toBe(JSON.stringify(aar));
    expect(storageRapidAccessOps.read()).toEqual(aar);
    storageRapidAccessOps.delete();
    expect(sessionStorage.getItem(STORAGE_RAPID_ACCESS_KEY)).toBeNull();
  });
  it('storageRetrievalId test', () => {
    const retrievalId: [AppRouteParams, string] = [AppRouteParams.RETRIEVAL_ID, 'test'];
    storageRapidAccessOps.write(retrievalId);
    expect(sessionStorage.getItem(STORAGE_RAPID_ACCESS_KEY)).toBe(JSON.stringify(retrievalId));
    expect(storageRapidAccessOps.read()).toEqual(retrievalId);
    storageRapidAccessOps.delete();
    expect(sessionStorage.getItem(STORAGE_RAPID_ACCESS_KEY)).toBeNull();
  });
});
