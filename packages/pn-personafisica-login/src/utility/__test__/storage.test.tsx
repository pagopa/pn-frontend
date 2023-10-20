import { AppRouteParams, AppRouteType } from '@pagopa-pn/pn-commons';

import {
  storageAarOps,
  storageOnSuccessOps,
  storageSpidSelectedOps,
  storageTypeOps,
} from '../storage';

describe('storage utility test', () => {
  it('storageOnSuccessOps', () => {
    storageOnSuccessOps.write('test');
    expect(sessionStorage.getItem('LOGIN:onSuccess')).toBe('test');
    expect(storageOnSuccessOps.read()).toBe('test');
    storageOnSuccessOps.delete();
    expect(sessionStorage.getItem('LOGIN:onSuccess')).toBeNull();
  });

  it('storageTypeOps', () => {
    storageTypeOps.write(AppRouteType.PF);
    expect(sessionStorage.getItem(AppRouteParams.TYPE)).toBe(AppRouteType.PF);
    expect(storageTypeOps.read()).toBe(AppRouteType.PF);
    storageTypeOps.write(AppRouteType.PG);
    expect(sessionStorage.getItem(AppRouteParams.TYPE)).toBe(AppRouteType.PG);
    expect(storageTypeOps.read()).toBe(AppRouteType.PG);
    storageTypeOps.delete();
    expect(sessionStorage.getItem(AppRouteParams.TYPE)).toBeNull();
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
