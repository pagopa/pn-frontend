import { vi } from 'vitest';

import { arrayOfDelegates } from '../../../__mocks__/Delegations.mock';
import { axe, render } from '../../../__test__/test-utils';
import Delegates from '../Delegates';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('Delegates Component - accessibility tests', () => {
  it('is Delegates component accessible - no delegates', async () => {
    const result = render(<Delegates />, {
      preloadedState: { delegationsState: { delegations: { delegates: [] } } },
    });
    const results = await axe(result.container);
    expect(results).toHaveNoViolations();
  });

  it('is Delegates component accessible - with delegates', async () => {
    const result = render(<Delegates />, {
      preloadedState: { delegationsState: { delegations: { delegates: arrayOfDelegates } } },
    });
    const results = await axe(result.container);
    expect(results).toHaveNoViolations();
  });
});
