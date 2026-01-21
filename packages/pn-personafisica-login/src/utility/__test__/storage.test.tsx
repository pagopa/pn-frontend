import { AppRouteParams } from '@pagopa-pn/pn-commons';

import {
  storageOneIdentityNonce,
  storageOneIdentityRedirectUri,
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

  it('storageOneIdentityRedirectUri tests', () => {
    const redirectUri = 'https://example.com/callback';
    storageOneIdentityRedirectUri.write(redirectUri);
    expect(sessionStorage.getItem('redirect_uri')).toBe(redirectUri);
    expect(storageOneIdentityRedirectUri.read()).toEqual(redirectUri);
    storageOneIdentityRedirectUri.delete();
    expect(sessionStorage.getItem('redirect_uri')).toBeNull();
  });
});
