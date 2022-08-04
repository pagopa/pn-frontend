import { initLocalization, getLocalizedOrDefaultLabel } from '../localization.service';

test('localize label (default label)', () => {
  const label = getLocalizedOrDefaultLabel('', 'mocked.path', 'default label');
  expect(label).toBe('default label');
});

test('localize label (localized label)', () => {
  initLocalization((namespace, path) => namespace + ' ' + path);
  const label = getLocalizedOrDefaultLabel('notifications', 'mocked.path', 'default label');
  expect(label).toBe('notifiche mocked.path');
});
