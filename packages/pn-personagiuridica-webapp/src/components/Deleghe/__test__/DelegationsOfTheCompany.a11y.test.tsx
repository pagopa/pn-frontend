import * as React from 'react';

import { apiOutcomeTestHelper } from '@pagopa-pn/pn-commons';

import { arrayOfDelegators } from '../../../__mocks__/Delegations.mock';
import { axe, render } from '../../../__test__/test-utils';
import { DELEGATION_ACTIONS } from '../../../redux/delegation/actions';
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

  it('API error', async () => {
    const result = render(<DelegationsOfTheCompany />, {
      preloadedState: {
        appState: apiOutcomeTestHelper.appStateWithMessageForAction(
          DELEGATION_ACTIONS.GET_DELEGATORS
        ),
      },
    });
    const results = await axe(result.container);
    expect(results).toHaveNoViolations();
  });
});
