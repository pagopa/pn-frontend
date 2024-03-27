import * as React from 'react';

import { axe, render } from '../../../__test__/test-utils';
import DomicileBanner from '../DomicileBanner';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('DomicileBanner component - accessibility tests', () => {
  it('is Domicile Banner component accessible', async () => {
    const result = render(<DomicileBanner />);
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
