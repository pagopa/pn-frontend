import {
  getLocalizedOrDefaultLabel,
  hasLocalizedLabel,
  initLocalization,
  initLocalizationExists,
} from '../localization.utility';

describe('localization service', () => {
  it('localize label (default label)', () => {
    const label = getLocalizedOrDefaultLabel('', 'mocked.path', 'default label');
    expect(label).toBe('default label');
  });

  it('localize label (localized label)', () => {
    initLocalization((namespace, path) => namespace + ' ' + path);
    const label = getLocalizedOrDefaultLabel('notifications', 'mocked.path', 'default label');
    expect(label).toBe('notifiche mocked.path');
  });

  it('localize label with namespaces (localized label)', () => {
    initLocalization((namespace, path) => namespace + ' ' + path, {
      common: 'common',
      notifications: 'different-namespace',
      appStatus: 'appStatus',
      delegations: 'deleghe',
      recapiti: 'recapiti',
      campaigns: 'campaigns',
    });
    const label = getLocalizedOrDefaultLabel('notifications', 'mocked.path', 'default label');
    expect(label).toBe('different-namespace mocked.path');
  });

  it('localize label when there is no available translation (default label)', () => {
    initLocalization(() => '');
    const label = getLocalizedOrDefaultLabel('notifications', 'mocked.path', 'default label');
    expect(label).toBe('default label');
  });

  it('localize label when no deafult is specified (path)', () => {
    const label = getLocalizedOrDefaultLabel('', 'mocked.path');
    expect(label).toBe('mocked.path');
  });

  it('returns true when the localization key exists', () => {
    initLocalization((namespace, path) => namespace + ' ' + path, {
      common: 'common',
      notifications: 'notifiche',
      appStatus: 'appStatus',
      delegations: 'deleghe',
      recapiti: 'recapiti',
    });
    initLocalizationExists((namespace, path) => {
      return namespace === 'notifiche' && path === 'mocked.path';
    });

    expect(hasLocalizedLabel('notifications', 'mocked.path')).toBe(true);
  });

  it('returns false when the localization key does not exist', () => {
    initLocalizationExists(() => false);

    expect(hasLocalizedLabel('notifications', 'missing.path')).toBe(false);
  });

  it('maps custom namespaces before checking the key', () => {
    initLocalization((namespace, path) => `${namespace} ${path}`, {
      common: 'common',
      notifications: 'custom-notifications',
      appStatus: 'appStatus',
      delegations: 'deleghe',
      recapiti: 'recapiti',
    });

    initLocalizationExists(
      (namespace, path) => namespace === 'custom-notifications' && path === 'mocked.path'
    );

    expect(hasLocalizedLabel('notifications', 'mocked.path')).toBe(true);
  });

  it('returns false when the existence function is not initialized', () => {
    initLocalizationExists();

    expect(hasLocalizedLabel('notifications', 'mocked.path')).toBe(false);
  });
});
