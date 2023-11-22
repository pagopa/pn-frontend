import * as React from 'react';
import { vi } from 'vitest';

import { arrayOfDelegators } from '../../../__mocks__/Delegations.mock';
import { axe, render } from '../../../__test__/test-utils';
import Delegators from '../Delegators';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('Delegators Component - accessibility tests', () => {
  it('is Delegators component accessible - no delegates', async () => {
    const result = render(<Delegators />, {
      preloadedState: { delegationsState: { delegations: { delegators: [] } } },
    });
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });

  it('is Delegators component accessible - with delegates', async () => {
    const result = render(<Delegators />, {
      preloadedState: { delegationsState: { delegations: { delegators: arrayOfDelegators } } },
    });
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
