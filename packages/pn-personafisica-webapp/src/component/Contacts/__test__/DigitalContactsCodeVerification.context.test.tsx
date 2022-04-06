import { ReactNode } from 'react';
import * as redux from 'react-redux';
import { fireEvent, RenderResult, screen, waitFor } from '@testing-library/react';

import { LegalChannelType } from '../../../models/contacts';
import { render } from '../../../__test__/test-utils';
import * as actions from '../../../redux/contact/actions';
import {
  DigitalContactsCodeVerificationProvider,
  useDigitalContactsCodeVerificationContext,
} from '../DigitalContactsCodeVerification.context';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
  Trans: () => 'legal-contacts.pec-verify-descr',
}));

const Wrapper = ({ children }: { children: ReactNode }) => (
  <DigitalContactsCodeVerificationProvider>{children}</DigitalContactsCodeVerificationProvider>
);

const Component = () => {
  const { initValidation } = useDigitalContactsCodeVerificationContext();

  const handleButtonClick = () => {
    initValidation(LegalChannelType.PEC, 'mocked-value', 'mocked-recipientId', 'mocked-senderId');
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Click me</button>
    </div>
  );
};

const showDialog = async (
  result: RenderResult,
  mockDispatchFn: jest.Mock,
  mockActionFn: jest.Mock
): Promise<HTMLElement | null> => {
  const button = result.container.querySelector('button');
  fireEvent.click(button!);
  await waitFor(() => {
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({
      recipientId: 'mocked-recipientId',
      senderId: 'mocked-senderId',
      channelType: LegalChannelType.PEC,
      value: 'mocked-value',
      code: undefined,
    });
  });
  return waitFor(() => screen.queryByTestId('codeDialog'));
};

describe('DigitalContactsCodeVerification Context', () => {
  let result: RenderResult | undefined;
  let mockDispatchFn: jest.Mock;
  let mockActionFn: jest.Mock;

  beforeEach(() => {
    // mock action
    mockActionFn = jest.fn();
    const actionSpy = jest.spyOn(actions, 'createOrUpdateLegalAddress');
    actionSpy.mockImplementation(mockActionFn as any);
    // mock dispatch
    mockDispatchFn = jest.fn(() => ({
      unwrap: () => Promise.resolve(),
    }));
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    // render component
    result = render(
      <Wrapper>
        <Component />
      </Wrapper>
    );
  });

  afterEach(() => {
    result = undefined;
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('renders CodeModal (modal closed)', () => {
    const button = result?.container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    const dialog = screen.queryByTestId('codeDialog');
    expect(dialog).not.toBeInTheDocument();
  });

  it('renders CodeModal (modal opened)', async () => {
    const dialog = await showDialog(result!, mockDispatchFn, mockActionFn);
    expect(dialog).toBeInTheDocument();
    const title = dialog?.querySelector('#dialog-title');
    expect(title).toHaveTextContent('legal-contacts.pec-verify mocked-value');
    const subtitle = dialog?.querySelector('#dialog-description');
    expect(subtitle).toHaveTextContent('legal-contacts.pec-verify-descr');
    expect(dialog).toHaveTextContent('legal-contacts.insert-code');
    const codeInputs = dialog?.querySelectorAll('input');
    expect(codeInputs).toHaveLength(5);
    codeInputs?.forEach((input) => {
      expect(input).toHaveValue('');
    });
    const buttons = dialog?.querySelectorAll('button');
    expect(buttons![0]).toHaveTextContent('button.annulla');
    expect(buttons![1]).toHaveTextContent('button.conferma');
  });

  it('clicks on confirm button', async () => {
    const dialog = await showDialog(result!, mockDispatchFn, mockActionFn);
    const codeInputs = dialog?.querySelectorAll('input');
    // fill inputs with values
    codeInputs?.forEach((input, index) => {
      fireEvent.change(input, { target: { value: index.toString() } });
    });
    const buttons = dialog?.querySelectorAll('button');
    // clear mocks
    mockActionFn.mockClear();
    mockActionFn.mockReset();
    mockDispatchFn.mockReset();
    mockDispatchFn.mockClear();
    mockDispatchFn.mockImplementation(jest.fn(() => ({
      unwrap: () => Promise.resolve({code: '01234'}),
    })));
    fireEvent.click(buttons![1]);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith({
        recipientId: 'mocked-recipientId',
        senderId: 'mocked-senderId',
        channelType: LegalChannelType.PEC,
        value: 'mocked-value',
        code: '01234',
      });
    });
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
  });
});
