import * as React from 'react';

import { arrayOfDelegates } from '../../../__mocks__/Delegations.mock';
import { axe, render } from '../../../__test__/test-utils';
import { DELEGATION_ACTIONS } from '../../../redux/delegation/actions';
import MobileDelegates from '../MobileDelegates';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('MobileDelegates Component - accessibility tests', () => {
  it('is MobileDelegates component accessible - no delegates', async () => {
    const result = render(<MobileDelegates />, {
      preloadedState: { delegationsState: { delegations: { delegates: [] } } },
    });
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });

  it('is MobileDelegates component accessible - with delegates', async () => {
    const result = render(<MobileDelegates />, {
      preloadedState: { delegationsState: { delegations: { delegates: arrayOfDelegates } } },
    });
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
