import * as React from 'react';

import { apiOutcomeTestHelper } from '@pagopa-pn/pn-commons';

import { mockApiKeysForFE } from '../../__mocks__/ApiKeys.mock';
import { RenderResult, act, axe, render } from '../../__test__/test-utils';
import { API_KEYS_ACTIONS } from '../../redux/apiKeys/actions';
import ApiKeys from '../ApiKeys.page';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const reduxInitialState = {
  apiKeysState: {
    loading: false,
    apiKeys: { items: [], total: 0 },
    pagination: {
      size: 10,
      page: 0,
      nextPagesKey: [],
    },
  },
};

describe('ApiKeys Page - accessibility tests', () => {
  it('empty list', async () => {
    let result: RenderResult | undefined;

    await act(async () => {
      result = render(<ApiKeys />, { preloadedState: reduxInitialState });
    });
    const results = await axe(result!.container);
    expect(results).toHaveNoViolations();
  });

  it('no empty list', async () => {
    let result: RenderResult | undefined;

    await act(async () => {
      result = render(<ApiKeys />, {
        preloadedState: {
          apiKeysState: { ...reduxInitialState.apiKeysState, apiKeys: mockApiKeysForFE },
        },
      });
    });
    const results = await axe(result!.container);
    expect(results).toHaveNoViolations();
  });

  it('api return error', async () => {
    let result: RenderResult | undefined;

    await act(async () => {
      result = render(<ApiKeys />, {
        preloadedState: {
          apiKeysState: { ...reduxInitialState.apiKeysState, apiKeys: mockApiKeysForFE },
          appState: apiOutcomeTestHelper.appStateWithMessageForAction(
            API_KEYS_ACTIONS.GET_API_KEYS
          ),
        },
      });
    });
    const results = await axe(result!.container);
    expect(results).toHaveNoViolations();
  });
});
