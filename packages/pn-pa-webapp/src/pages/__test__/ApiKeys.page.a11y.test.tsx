import * as React from 'react';
import * as redux from 'react-redux';

import { RenderResult, act } from '@testing-library/react';

import { mockApiKeysForFE } from '../../__mocks__/ApiKeys.mock';
import { axe, render } from '../../__test__/test-utils';
import { ApiKey } from '../../models/ApiKeys';
import * as actions from '../../redux/apiKeys/actions';
import ApiKeys from '../ApiKeys.page';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const initialState = (param: Array<ApiKey>) => ({
  preloadedState: {
    apiKeysState: {
      loading: false,
      apiKeys: param,
    },
  },
});

describe('ApiKeys Page - accessibility tests', () => {
  it('does not have basic accessibility issues rendering the page', async () => {
    const mockDispatchFn = jest.fn();
    const mockActionFn = jest.fn();

    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    // mock action
    const actionSpy = jest.spyOn(actions, 'getApiKeys');
    actionSpy.mockImplementation(mockActionFn);

    // eslint-disable-next-line functional/no-let
    let result: RenderResult | undefined;

    await act(async () => {
      result = render(<ApiKeys />, initialState(mockApiKeysForFE));
    });
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  }, 15000);
});
