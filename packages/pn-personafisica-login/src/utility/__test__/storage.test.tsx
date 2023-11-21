import { AppRouteParams } from '@pagopa-pn/pn-commons';

import { storageAarOps, storageOnSuccessOps, storageSpidSelectedOps } from '../storage';

describe('storage utility test', () => {
  it('storageOnSuccessOps', () => {
    storageOnSuccessOps.write('test');
    expect(sessionStorage.getItem('LOGIN:onSuccess')).toBe('test');
    expect(storageOnSuccessOps.read()).toBe('test');
    storageOnSuccessOps.delete();
    expect(sessionStorage.getItem('LOGIN:onSuccess')).toBeNull();
  });

  it('storageAarOps', () => {
    storageAarOps.write('test');
    expect(sessionStorage.getItem(AppRouteParams.AAR)).toBe('test');
    expect(storageAarOps.read()).toBe('test');
    storageAarOps.delete();
    expect(sessionStorage.getItem(AppRouteParams.AAR)).toBeNull();
  });

  it('storageSpidSelectedOps', () => {
    storageSpidSelectedOps.write('test');
    expect(sessionStorage.getItem('SPID_SELECTED')).toBe(JSON.stringify('test'));
    expect(storageSpidSelectedOps.read()).toBe('test');
    storageSpidSelectedOps.delete();
    expect(sessionStorage.getItem('SPID_SELECTED')).toBeNull();
  });
});
