import { appStorage } from '../appStorage.utility';

describe('Test appStorage utility', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('domicileBanner enabled by default when no value is stored', () => {
    expect(appStorage.domicileBanner.isEnabled()).toBe(true);
  });

  it('domicileBanner is disabled after disable()', () => {
    appStorage.domicileBanner.disable();
    expect(appStorage.domicileBanner.isEnabled()).toBe(false);
  });

  it('domicileBanner is enabled again after enable()', () => {
    appStorage.domicileBanner.disable();
    appStorage.domicileBanner.enable();
    expect(appStorage.domicileBanner.isEnabled()).toBe(true);
  });

  it('domicileBanner - treats non "true" values as enabled', () => {
    sessionStorage.setItem('domicileBannerClosed', 'false');
    expect(appStorage.domicileBanner.isEnabled()).toBe(true);
  });
});
