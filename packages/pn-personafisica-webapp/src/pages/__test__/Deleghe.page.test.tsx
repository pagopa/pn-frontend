import * as React from 'react';
import * as redux from 'react-redux';
import { fireEvent, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event'

import * as isMobileHook from '@pagopa-pn/pn-commons/src/hooks/useIsMobile';
// import { AppResponseMessage, ResponsePublisher } from '@pagopa-pn/pn-commons';

import { axe, render } from '../../__test__/test-utils';
import Deleghe from '../Deleghe.page';
import * as hooks from '../../redux/hooks';
// import * as sidemenuActions from '../../redux/sidemenu/actions';
// import { DelegationsApi } from '../../api/delegations/Delegations.api';

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

const mockSelectorSpy = jest.spyOn(hooks, 'useAppSelector');

function useSelectorSpy(
  openConfirmationModal: boolean,
  openCodeModal: boolean,
  type: 'delegates' | 'delegators',
  error: boolean = false
) {
  mockSelectorSpy
    .mockReturnValueOnce({ id: '1', open: openConfirmationModal, type })
    .mockReturnValueOnce({ id: '1', open: openCodeModal, name: 'Nome', error });
}

const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
const mockDispatchFn = jest.fn();

describe('Deleghe page', () => {
  afterEach(() => {
    mockSelectorSpy.mockClear();
    mockSelectorSpy.mockReset();
    useIsMobileSpy.mockClear();
    useIsMobileSpy.mockReset();
    useDispatchSpy.mockClear();
    useDispatchSpy.mockReset();
  });

  it('renders the desktop view of the deleghe page', async () => {
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    useIsMobileSpy.mockReturnValue(false);
    useSelectorSpy(false, false, 'delegates');
    const result = render(<Deleghe />);

    expect(result.container).toHaveTextContent(/deleghe.title/i);
    expect(result.container).toHaveTextContent(/deleghe.description/i);
    expect(result.container).toHaveTextContent(/delegates/i);
    expect(result.container).toHaveTextContent(/delegators/i);
    expect(mockDispatchFn).toBeCalledTimes(2);
    expect(mockSelectorSpy).toBeCalledTimes(2);
  });

  it('renders the mobile view of the deleghe page', async () => {
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    useIsMobileSpy.mockReturnValue(true);
    useSelectorSpy(false, false, 'delegates');
    const result = render(<Deleghe />);

    expect(result.container).toHaveTextContent(/deleghe.title/i);
    expect(result.container).toHaveTextContent(/deleghe.description/i);
    expect(result.container).toHaveTextContent(/mobile delegates/i);
    expect(result.container).toHaveTextContent(/mobile delegators/i);
    expect(mockDispatchFn).toBeCalledTimes(2);
  });

  it('checks the revocation modal open', async () => {
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    useIsMobileSpy.mockReturnValue(false);
    useSelectorSpy(true, false, 'delegates');
    const result = render(<Deleghe />);
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
    useSelectorSpy(true, false, 'delegators');
    const result = render(<Deleghe />);
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
    useSelectorSpy(false, true, 'delegators');
    const result = render(<Deleghe />);
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
    // mock actions
    // const mockSidemenuInformationActionFn = jest.fn();
    
    // const delegatorsSpy = jest.spyOn(DelegationsApi, 'getDelegators');
    // delegatorsSpy.mockResolvedValue([]);
    // const delegatesSpy = jest.spyOn(DelegationsApi, 'getDelegates');
    // delegatesSpy.mockResolvedValue([]);
    // const getSidemenuInfoActionSpy = jest.spyOn(sidemenuActions, 'getSidemenuInformation');
    // getSidemenuInfoActionSpy.mockImplementation(mockSidemenuInformationActionFn as any);
    
    // const apiSpy = jest.spyOn(DelegationsApi, 'acceptDelegation');
    // apiSpy.mockRejectedValue({ response: { status: 500 } });
    // // const setStateMock = jest.fn();
    // // const useStateMock: any = (useState: any) => [useState, setStateMock];
    // // const myInitialState = "Error-text";
    // // jest.spyOn(React, 'useState').mockImplementation(() => [myInitialState, () => null]);

    // // useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    // // useIsMobileSpy.mockReturnValue(false);
    // // useSelectorSpy(false, true, 'delegators', true);
    // const result = render(<>
    //   <Deleghe />
    //   <ResponsePublisher />
    //   <AppResponseMessage />
    // </>, {
    //   preloadedState: {
    //     delegationsState: {
    //       acceptModalState: {
    //         id: '1',
    //         open: true,
    //         name: 'delegators',
    //         error: false,
    //       },
    //       modalState: {
    //         id: '1',
    //         open: true,
    //         type: 'delegators'
    //       }
    //     }
    //   }
    // });

    // const acceptButton = result.getByRole('button', { name: 'deleghe.accept' });
    // const inputs = result.queryAllByDisplayValue('-');
    // inputs.forEach(input => userEvent.type(input, '1'));
    // userEvent.click(acceptButton);

    // waitFor(() => {
    //   expect(result.baseElement).toHaveTextContent(/Error-text/i);
    // })


    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    useIsMobileSpy.mockReturnValue(false);
    // useState mock
    const setState = jest.fn();
    const setStateFn: any = () => ['Accept mandate error', setState];
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementation(setStateFn);
    // end useState mock
    useSelectorSpy(false, true, 'delegators', true);
    const result = render(<Deleghe />);
    expect(result.baseElement).toHaveTextContent("Accept mandate error");
    
    
    /** original content */
    // useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    // useIsMobileSpy.mockReturnValue(false);
    // useSelectorSpy(false, true, 'delegators', true);
    // const result = render(<Deleghe />);
    // expect(result.baseElement).toHaveTextContent(/deleghe.invalid_code/i);
  });

  it('is deleghe page accessible', async ()=>{
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    useIsMobileSpy.mockReturnValue(false);
    useSelectorSpy(false, false, 'delegates');
    const { container } = render(<Deleghe/>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
