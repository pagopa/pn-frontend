/*
  Scrivere TEST opportuni non appena si avrà il quadro completo su FE/BE
  Issue di riferimento: PN-1845

  Ci sono un paio di test dove si è provveduti a skipparli per evitare il fallimento dei test di tutta la webapp
*/

import { act, fireEvent, RenderResult, waitFor } from '@testing-library/react';
import * as redux from 'react-redux';
import * as actions from '../../redux/apiKeys/actions';
import { ApiKey } from '../../models/ApiKeys';
import { mockApiKeysForFE } from '../../redux/apiKeys/__test__/test-utils';
import { axe, render } from '../../__test__/test-utils';
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

const mockDispatchFn = jest.fn();
const mockActionFn = jest.fn();

describe('ApiKeys Page', () => {
  // eslint-disable-next-line functional/no-let
  let result: RenderResult | undefined;

  const initialState = (param: Array<ApiKey>) => ({
    preloadedState: {
      apiKeysState: {
        loading: false,
        apiKeys: param,
      }
    }
  });

  beforeEach(async () => {
    // mock action
    const actionSpy = jest.spyOn(actions, 'getApiKeys');
    actionSpy.mockImplementation(mockActionFn);
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn);
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

  it('does not have basic accessibility issues rendering the page', async () => {
    await act(async () => {
      result = render(<ApiKeys />, initialState(mockApiKeysForFE));
    });
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  }, 15000);
});