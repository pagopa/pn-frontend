import * as React from 'react';

import { axe, render } from '../../../__test__/test-utils';
import { arrayOfDelegators } from '../../../redux/delegation/__test__/test.utils';
import DelegationsOfTheCompany from '../DelegationsOfTheCompany';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('Delegators Component - accessibility tests', () => {
  it('is Delegator component accessible', async () => {
    const result = render(<DelegationsOfTheCompany />, {
      preloadedState: {
        delegationsState: {
          delegations: {
            delegators: arrayOfDelegators,
          },
          pagination: {
            nextPagesKey: [],
            moreResult: false,
          },
          groups: [],
          delegatorsNames: [],
        },
      },
    });
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
