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

const Wrapper = ({ children }: { children: ReactNode }) => (
  <DigitalContactsCodeVerificationProvider>{children}</DigitalContactsCodeVerificationProvider>
);

const Component = () => {
  const { setProps } = useDigitalContactsCodeVerificationContext();

  const handleButtonClick = () => {
    setProps({
      title: 'mocked-title',
      subtitle: 'mocked-subtitle',
      initialValues: new Array(5).fill(''),
      codeSectionTitle: 'mocked-sectionTitle',
      codeSectionAdditional: 'mocked-sectionAdditional',
      cancelLabel: 'mocked-cancelLabel',
      confirmLabel: 'mocked-confirmLabel',
      errorMessage: 'mocked-errorMessage',
      recipientId: 'mocked-recipientId',
      senderId: 'mocked-senderId',
      digitalDomicileType: LegalChannelType.PEC,
      value: 'mocked-value',
      successMessage: 'mocked-successMessage',
      actionToBeDispatched: actions.createOrUpdateLegalAddress,
    });
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

  it('renders LegalContactsButton (modal closed)', () => {
    const button = result?.container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    const dialog = screen.queryByTestId('codeDialog');
    expect(dialog).not.toBeInTheDocument();
  });

  it('renders LegalContactsButton (modal opened)', async () => {
    const dialog = await showDialog(result!, mockDispatchFn, mockActionFn);
    expect(dialog).toBeInTheDocument();
    const title = dialog?.querySelector('#dialog-title');
    expect(title).toHaveTextContent('mocked-title');
    const subtitle = dialog?.querySelector('#dialog-description');
    expect(subtitle).toHaveTextContent('mocked-subtitle');
    expect(dialog).toHaveTextContent('mocked-sectionTitle');
    const codeInputs = dialog?.querySelectorAll('input');
    expect(codeInputs).toHaveLength(5);
    codeInputs?.forEach((input) => {
      expect(input).toHaveValue('');
    });
    const buttons = dialog?.querySelectorAll('button');
    expect(buttons![0]).toHaveTextContent('mocked-cancelLabel');
    expect(buttons![1]).toHaveTextContent('mocked-confirmLabel');
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
