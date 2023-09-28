import { getLocalizedOrDefaultLabel, initLocalization } from '../localization.service';

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
    });
    const label = getLocalizedOrDefaultLabel('notifications', 'mocked.path', 'default label');
    expect(label).toBe('different-namespace mocked.path');
  });

  it('localize label when there is no available translation (default label)', () => {
    initLocalization((namespace, path) => '');
    const label = getLocalizedOrDefaultLabel('notifications', 'mocked.path', 'default label');
    expect(label).toBe('default label');
  });
});
