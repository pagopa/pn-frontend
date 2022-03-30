import react from 'react';
import * as redux from 'react-redux';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { LegalChannelType } from '../../../models/contacts';
import { render } from '../../../__test__/test-utils';
import * as actions from '../../../redux/contact/actions';
import LegalContactsButton from '../LegalContactsButton';

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
  Trans: () => 'legal-contacts.pec-verify-descr',
}));

describe('LegalContactsButton Component', () => {
  let useStateSpy: jest.SpyInstance;

  const Component = ({open}: {open: boolean}) => {
    useStateSpy = jest.spyOn(react, 'useState');
    const setState = jest.fn();
    useStateSpy.mockImplementationOnce(() => [open, setState]);
    return (
      <LegalContactsButton
        recipientId="mocked-recipientId"
        senderId="mocked-senderId"
        digitalDomicileType={LegalChannelType.PEC}
        pec="mocked-pec"
        successMessage="mocked-successMessage"
      >
        <button>Click me</button>
      </LegalContactsButton>
    );
  };

  afterEach(() => {
    useStateSpy.mockRestore();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('renders LegalContactsButton (modal closed)', () => {
    // render component
    const result = render(<Component open={false}/>);
    const button = result?.container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    const dialog = screen.queryByTestId('codeDialog');
    expect(dialog).not.toBeInTheDocument();
  });

  it('renders LegalContactsButton (modal opened)', () => {
    // render component
    render(<Component open/>);
    const dialog = screen.queryByTestId('codeDialog');
    expect(dialog).toBeInTheDocument();
    const title = dialog?.querySelector('#dialog-title');
    expect(title).toHaveTextContent('legal-contacts.pec-verify');
    const subtitle = dialog?.querySelector('#dialog-description');
    expect(subtitle).toHaveTextContent('legal-contacts.pec-verify-descr');
    expect(dialog).toHaveTextContent('legal-contacts.insert-code');
    const codeInputs = dialog?.querySelectorAll('input');
    expect(codeInputs).toHaveLength(5);
    codeInputs?.forEach(input => {
      expect(input).toHaveValue('');
    });
    const buttons = dialog?.querySelectorAll('button');
    expect(buttons![0]).toHaveTextContent('button.annulla');
    expect(buttons![1]).toHaveTextContent('button.conferma');
  });

  it('clicks on confirm button', async () => {
    // mock action
    const mockActionFn = jest.fn();
    const actionSpy = jest.spyOn(actions, 'createOrUpdateLegalAddress');
    actionSpy.mockImplementation(mockActionFn);
    // mock dispatch
    const mockDispatchFn = jest.fn(() => ({
      unwrap: () => ({
        then: () => ({
          catch: () => {}
        })
      })
    }));
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    // render component
    render(<Component open/>);
    const dialog = screen.queryByTestId('codeDialog');
    const codeInputs = dialog?.querySelectorAll('input');
    // fill inputs with values
    codeInputs?.forEach((input, index) => {
      fireEvent.change(input, {target: {value: index.toString()}});
    });
    const buttons = dialog?.querySelectorAll('button');
    await waitFor(() => {
      fireEvent.click(buttons![1]);
    });
    expect(mockDispatchFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledTimes(1);
    expect(mockActionFn).toBeCalledWith({
      recipientId: 'mocked-recipientId',
      senderId: 'mocked-senderId',
      channelType: LegalChannelType.PEC,
      value: 'mocked-pec',
      code: '01234',
    });
  })
});
