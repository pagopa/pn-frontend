import { vi } from 'vitest';

import { render } from '../../__test__/test-utils';
import Statistics from '../Statistics.page';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

// TODO enable this test after completing the feature PN-10851
describe('Statistics Page tests', () => {
  it.skip('renders Statistics Page', () => {
    const result = render(<Statistics />, {
      preloadedState: {
        userState: { organizationParty: { name: 'mocked-sender' } },
      },
    });

    expect(result.container).toHaveTextContent('title');
    expect(result.container).toHaveTextContent('subtitle');
  });
});
