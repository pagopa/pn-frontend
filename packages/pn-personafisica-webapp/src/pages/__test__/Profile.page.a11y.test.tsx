import { vi } from 'vitest';

import { userResponse } from '../../__mocks__/Auth.mock';
import { axe, render } from '../../__test__/test-utils';
import Profile from '../Profile.page';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('profile page - accessibility tests', () => {
  it('is profile page accessible', async () => {
    const { container } = render(<Profile />, {
      preloadedState: { userState: { user: userResponse } },
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
