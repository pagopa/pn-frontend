import { AppRouteParams } from '@pagopa-pn/pn-commons';

import { storageRapidAccessOps } from '../storage';

describe('storage utility test', () => {
  it('storage Aar', () => {
    const aar: [AppRouteParams, string] = [AppRouteParams.AAR, 'test-aar'];
    storageRapidAccessOps.write(aar);
    expect(sessionStorage.getItem(AppRouteParams.AAR)).toBe('test-aar');
    expect(storageRapidAccessOps.read()).toEqual(aar);
    storageRapidAccessOps.delete();
    expect(sessionStorage.getItem(AppRouteParams.AAR)).toBeNull();
  });
  it('storageRetrievalId test', () => {
    const retrievalId: [AppRouteParams, string] = [AppRouteParams.RETRIEVAL_ID, 'test-retrieval-id'];
    storageRapidAccessOps.write(retrievalId);
    expect(sessionStorage.getItem(AppRouteParams.RETRIEVAL_ID)).toBe('test-retrieval-id');
    expect(storageRapidAccessOps.read()).toEqual(retrievalId);
    storageRapidAccessOps.delete();
    expect(sessionStorage.getItem(AppRouteParams.RETRIEVAL_ID)).toBeNull();
  });
});
