import { AppRouteParams } from '@pagopa-pn/pn-commons';

import { storageAarOps } from '../storage';

describe('storage utility test', () => {
  it('storageAarOps', () => {
    storageAarOps.write('test');
    expect(sessionStorage.getItem(AppRouteParams.AAR)).toBe('test');
    expect(storageAarOps.read()).toBe('test');
    storageAarOps.delete();
    expect(sessionStorage.getItem(AppRouteParams.AAR)).toBeNull();
  });
});
