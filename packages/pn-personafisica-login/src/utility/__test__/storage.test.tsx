import { AppRouteParams } from '@pagopa-pn/pn-commons';

import { storageAarOps, storageRetrievalIdOps, storageDeleteAll } from '../storage';

describe('storage utility test', () => {
  it('storageAarOps', () => {
    storageAarOps.write('test');
    expect(sessionStorage.getItem(AppRouteParams.AAR)).toBe('test');
    expect(storageAarOps.read()).toBe('test');
    storageAarOps.delete();
    expect(sessionStorage.getItem(AppRouteParams.AAR)).toBeNull();
  });
  it('storageRetrievalIdOps', () => {
    storageRetrievalIdOps.write('test-retrieval-id');
    expect(sessionStorage.getItem(AppRouteParams.RETRIEVAL_ID)).toBe('test-retrieval-id');
    expect(storageRetrievalIdOps.read()).toBe('test-retrieval-id');
    storageRetrievalIdOps.delete();
    expect(sessionStorage.getItem(AppRouteParams.RETRIEVAL_ID)).toBeNull();
  });
  it('storageDeleteAll', () => {
    storageAarOps.write('test');
    storageRetrievalIdOps.write('test-retrieval-id');
    storageDeleteAll();
    expect(sessionStorage.getItem(AppRouteParams.AAR)).toBeNull();
    expect(sessionStorage.getItem(AppRouteParams.RETRIEVAL_ID)).toBeNull();
  });
});
