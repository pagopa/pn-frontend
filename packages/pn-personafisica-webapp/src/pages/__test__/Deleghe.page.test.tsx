import React from 'react';
import * as redux from 'react-redux';

import * as isMobileHook from '@pagopa-pn/pn-commons/src/hooks/useIsMobile';

import { act, fireEvent, RenderResult, waitFor } from '@testing-library/react';
import { render } from '../../__test__/test-utils';
import Deleghe from '../Deleghe.page';

const useIsMobileSpy = jest.spyOn(isMobileHook, 'useIsMobile');

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../component/Deleghe/Delegates', () => ({
  __esModule: true,
  default: () => <div>delegates</div>,
}));

jest.mock('../../component/Deleghe/MobileDelegates', () => ({
  __esModule: true,
  default: () => <div>mobile delegates</div>,
}));

jest.mock('../../component/Deleghe/Delegators', () => ({
  __esModule: true,
  default: () => <div>delegators</div>,
}));

jest.mock('../../component/Deleghe/MobileDelegators', () => ({
  __esModule: true,
  default: () => <div>mobile delegators</div>,
}));

const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
const mockDispatchFn = jest.fn();

describe('Deleghe page', () => {
  // eslint-disable-next-line functional/no-let
  let result: RenderResult;

  const renderComponent = async (
    openConfirmationModal: boolean,
    openCodeModal: boolean,
    type: 'delegates' | 'delegators',
    error: boolean = false
  ) => {
    await act(async () => {
      result = render(<Deleghe />, {
        preloadedState: {
          delegationsState: {
            modalState: {
              id: '1',
              open: openConfirmationModal,
              type,
            },
            acceptModalState: {
              id: '1',
              open: openCodeModal,
              name: 'Nome',
              error,
            },
          },
        },
      });
    });
  };

  afterEach(() => {
    useIsMobileSpy.mockClear();
    useIsMobileSpy.mockReset();
    useDispatchSpy.mockClear();
    useDispatchSpy.mockReset();
  });

  it('renders the desktop view of the deleghe page', async () => {
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    useIsMobileSpy.mockReturnValue(false);
    await renderComponent(false, false, 'delegates');
    expect(result.container).toHaveTextContent(/deleghe.title/i);
    expect(result.container).toHaveTextContent(/deleghe.description/i);
    expect(result.container).toHaveTextContent(/delegates/i);
    expect(result.container).toHaveTextContent(/delegators/i);
    expect(mockDispatchFn).toBeCalledTimes(2);
  });

  it('renders the mobile view of the deleghe page', async () => {
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    useIsMobileSpy.mockReturnValue(true);
    await renderComponent(false, false, 'delegates');
    expect(result.container).toHaveTextContent(/deleghe.title/i);
    expect(result.container).toHaveTextContent(/deleghe.description/i);
    expect(result.container).toHaveTextContent(/mobile delegates/i);
    expect(result.container).toHaveTextContent(/mobile delegators/i);
    expect(mockDispatchFn).toBeCalledTimes(2);
  });

  it('checks the revocation modal open', async () => {
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    useIsMobileSpy.mockReturnValue(false);
    await renderComponent(true, false, 'delegates');
    const confirmRevocationButton = result.getByText(/deleghe.confirm_revocation/i);
    const closeButton = result.getByText(/button.annulla/i);
    expect(mockDispatchFn).toBeCalledTimes(2);
    expect(result.baseElement).toHaveTextContent(/deleghe.revocation_question/i);
    expect(result.baseElement).toHaveTextContent(/deleghe.confirm_revocation/i);
    fireEvent.click(confirmRevocationButton);
    expect(mockDispatchFn).toBeCalledTimes(3);
    fireEvent.click(closeButton);
    expect(mockDispatchFn).toBeCalledTimes(4);
  });

  it('checks the rejection modal open', async () => {
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    useIsMobileSpy.mockReturnValue(false);
    await renderComponent(true, false, 'delegators');
    const confirmRejectionButton = result.getByText(/deleghe.confirm_rejection/i);
    const closeButton = result.getByText(/button.annulla/i);
    expect(mockDispatchFn).toBeCalledTimes(2);
    expect(result.baseElement).toHaveTextContent(/deleghe.rejection_question/i);
    expect(result.baseElement).toHaveTextContent(/deleghe.confirm_rejection/i);
    fireEvent.click(confirmRejectionButton);
    expect(mockDispatchFn).toBeCalledTimes(3);
    fireEvent.click(closeButton);
    expect(mockDispatchFn).toBeCalledTimes(4);
  });

  it('checks the accept modal open', async () => {
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    useIsMobileSpy.mockReturnValue(false);
    await renderComponent(false, true, 'delegators');
    const codeInput = result.queryAllByPlaceholderText('-');
    const confirmAcceptButton = result.getByText('deleghe.accept');
    const closeButton = result.getByText(/button.indietro/i);
    expect(mockDispatchFn).toBeCalledTimes(2);
    expect(result.baseElement).toHaveTextContent(/deleghe.accept_title/i);
    expect(codeInput).toHaveLength(5);
    codeInput.forEach((input) => {
      fireEvent.change(input, { target: { value: '1' } });
    });
    await waitFor(() => {
      fireEvent.click(confirmAcceptButton);
    });
    expect(mockDispatchFn).toBeCalledTimes(5);
    fireEvent.click(closeButton);
    expect(mockDispatchFn).toBeCalledTimes(6);
  });

  it('checks the accept modal error state', async () => {
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    useIsMobileSpy.mockReturnValue(false);
    const setState = jest.fn();
    // We affect the initial value of a state only if is ''. 
    // The aim is to set the value for the errorText state in Deleghe **only**.
    // If we changed useState without this restriction, then the test would fail because
    // also the state in the CodeModal component (in pn-commons) would be affected.
    //
    // This trick makes the test work for the moment.
    // Of course, whenever Deleghe would involve in the future some state whose initial value is '', 
    // then this test would be at risk.
    // -----------------------------------------
    // Carlos Lombardi, 2022.12.13
    // -----------------------------------------
    const setStateFn: any = (initialValue) => [initialValue === '' ? 'Accept mandate error' : initialValue, setState];
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementation(setStateFn);
    await renderComponent(false, true, 'delegators', true);
    expect(result.baseElement).toHaveTextContent('Accept mandate error');

    useStateSpy.mockRestore();
  });
});
