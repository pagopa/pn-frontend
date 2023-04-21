import { act, fireEvent, RenderResult, waitFor } from '@testing-library/react';
import React from 'react';
import * as redux from 'react-redux';
import { ApiKey } from '../../models/ApiKeys';
import { mockApiKeysForFE } from '../../redux/apiKeys/__test__/test-utils';
import { render } from '../../__test__/test-utils';
import * as actions from '../../redux/apiKeys/actions';
import ApiKeys from '../ApiKeys.page';

const mockNavigateFn = jest.fn();

// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    useIsMobile: () => false,
  };
});

describe('ApiKeys Page', () => {
  // eslint-disable-next-line functional/no-let
  let result: RenderResult | undefined;

  const mockDispatchFn = jest.fn();
  const mockActionFn = jest.fn();
  
  const initialState = (apiKeys: Array<ApiKey>) => ({
    preloadedState: {
      apiKeysState: {
        loading: false,
        apiKeys,
      },
    },
  });

  beforeEach(async () => {
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    // mock action
    const actionSpy = jest.spyOn(actions, 'getApiKeys');
    actionSpy.mockImplementation(mockActionFn);
  });

  afterEach(() => {
    result = undefined;
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('renders the page', async () => {
    await act(async () => {
      result = render(<ApiKeys />, initialState([]));
    });
    expect(result?.getAllByRole('heading')[0]).toHaveTextContent(/title/i);
  });

  it('renders the page with apiKeys list and click Generate New Api Key button', async () => {
    await act(async () => {
      result = render(<ApiKeys />, initialState(mockApiKeysForFE));
    });
    const tableApiKeys = result?.container.querySelector('table');
    expect(tableApiKeys).toBeInTheDocument();

    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith();

    const button = result?.queryByTestId('generateApiKey');
    expect(button).toBeInTheDocument();
    fireEvent.click(button!);

    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
    });
  });
});
