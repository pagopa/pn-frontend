import * as React from 'react';

import { apiOutcomeTestHelper } from '@pagopa-pn/pn-commons';

import { arrayOfDelegates } from '../../../__mocks__/Delegations.mock';
import { axe, render } from '../../../__test__/test-utils';
import { DELEGATION_ACTIONS } from '../../../redux/delegation/actions';
import DelegatesByCompany from '../DelegatesByCompany';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('Delegates Component - accessibility tests', () => {
  it('is Delegates component accessible', async () => {
    const result = render(<DelegatesByCompany />, {
      preloadedState: {
        delegationsState: {
          delegations: {
            delegates: arrayOfDelegates,
          },
        },
      },
    });
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });

  it('API error - is Delegates component accessible', async () => {
    const result = render(<DelegatesByCompany />, {
      preloadedState: {
        appState: apiOutcomeTestHelper.appStateWithMessageForAction(
          DELEGATION_ACTIONS.GET_DELEGATES_BY_COMPANY
        ),
      },
    });
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
