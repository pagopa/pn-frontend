import { vi } from 'vitest';

import '@testing-library/jest-dom';

// mock translations: keep the real react-i18next implementation but stub the
// Trans component so tests can assert on the i18n key without a full i18n setup
vi.mock('react-i18next', async (importOriginal) => {
  const original = await importOriginal<typeof import('react-i18next')>();
  const TransComponent = ({ i18nKey }: { i18nKey?: string }) => (
    <span data-testid="trans-component">{i18nKey}</span>
  );
  return { ...original, Trans: TransComponent };
});
