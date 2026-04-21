import { AppRouteParams } from '@pagopa-pn/pn-commons';

import {
  storageOneIdentityNonce,
  storageOneIdentityState,
  storageRapidAccessOps,
} from '../storage';

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
    const retrievalId: [AppRouteParams, string] = [
      AppRouteParams.RETRIEVAL_ID,
      'test-retrieval-id',
    ];
    storageRapidAccessOps.write(retrievalId);
    expect(sessionStorage.getItem(AppRouteParams.RETRIEVAL_ID)).toBe('test-retrieval-id');
    expect(storageRapidAccessOps.read()).toEqual(retrievalId);
    storageRapidAccessOps.delete();
    expect(sessionStorage.getItem(AppRouteParams.RETRIEVAL_ID)).toBeNull();
  });

  it('write with useLocalStorage=true stores in localStorage', () => {
    const aar: [AppRouteParams, string] = [AppRouteParams.AAR, 'test-aar-local'];
    storageRapidAccessOps.write(aar, true);
    expect(localStorage.getItem(AppRouteParams.AAR)).toBe('test-aar-local');
    expect(sessionStorage.getItem(AppRouteParams.AAR)).toBeNull();
    expect(storageRapidAccessOps.read()).toEqual(aar);
    storageRapidAccessOps.delete();
    expect(localStorage.getItem(AppRouteParams.AAR)).toBeNull();
  });

  it('write clears the other storage', () => {
    storageRapidAccessOps.write([AppRouteParams.AAR, 'local-value'], true);
    expect(localStorage.getItem(AppRouteParams.AAR)).toBe('local-value');
    storageRapidAccessOps.write([AppRouteParams.AAR, 'session-value'], false);
    expect(sessionStorage.getItem(AppRouteParams.AAR)).toBe('session-value');
    expect(localStorage.getItem(AppRouteParams.AAR)).toBeNull();
    storageRapidAccessOps.delete();
  });

  it('read reads from localStorage when sessionStorage is empty', () => {
    storageRapidAccessOps.write([AppRouteParams.RETRIEVAL_ID, 'local-retrieval'], true);
    expect(sessionStorage.getItem(AppRouteParams.RETRIEVAL_ID)).toBeNull();
    expect(storageRapidAccessOps.read()).toEqual([AppRouteParams.RETRIEVAL_ID, 'local-retrieval']);
    storageRapidAccessOps.delete();
  });

  it('storageOneIdentityState test', () => {
    const state = '123456789';
    storageOneIdentityState.write(state);
    expect(sessionStorage.getItem('state')).toBe(state);
    expect(storageOneIdentityState.read()).toEqual(state);
    storageOneIdentityState.delete();
    expect(sessionStorage.getItem('state')).toBeNull();
  });

  it('storageOneIdentityNonce tests', () => {
    const nonce = '123456789';
    storageOneIdentityNonce.write(nonce);
    expect(sessionStorage.getItem('nonce')).toBe(nonce);
    expect(storageOneIdentityNonce.read()).toEqual(nonce);
    storageOneIdentityNonce.delete();
    expect(sessionStorage.getItem('nonce')).toBeNull();
  });
});
