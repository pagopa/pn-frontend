import { ReactNode } from 'react';
import { vi } from 'vitest';

import '@testing-library/jest-dom';

beforeAll(() => {
  // mock translations: keep the real react-i18next implementation but stub the
  // Trans component so tests can assert on the i18n key without a full i18n setup
  vi.mock('react-i18next', async (importOriginal) => {
    const original = await importOriginal<typeof import('react-i18next')>();

    return {
      ...original,
      Trans: (props: {
        ns?: string;
        i18nKey: string;
        t?: () => string;
        components?: Array<ReactNode> | Record<string, ReactNode>;
      }) => (
        <>
          {props.ns} {props.t ? '' : props.i18nKey} {props.t?.()}{' '}
          {Object.values(props.components ?? {}).map((c) => c)}
        </>
      ),
    };
  });
});
