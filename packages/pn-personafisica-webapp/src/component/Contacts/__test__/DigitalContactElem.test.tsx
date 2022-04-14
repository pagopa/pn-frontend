import { fireEvent, RenderResult, waitFor, screen } from '@testing-library/react';
import * as redux from 'react-redux';
import { TextField } from '@mui/material';

import { render } from '../../../__test__/test-utils';
import * as actions from '../../../redux/contact/actions';
import { LegalChannelType } from '../../../models/contacts';
import DigitalContactElem from '../DigitalContactElem';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
  Trans: () => 'legal-contacts.pec-verify-descr',
}));

const fields = [
  {
    id: '1',
    component: 'Campo 1',
    size: 'variable' as 'variable' | 'auto',
  },
  {
    id: '2',
    component: (
      <TextField
        id="campo-2"
        fullWidth
        name="campo-2"
        label="campo-2"
        variant="outlined"
        size="small"
        value="Campo 2"
        data-testid="field"
      ></TextField>
    ),
    size: 'auto' as 'variable' | 'auto',
    isEditable: true,
  },
];

const deleteMockActionFn = jest.fn();
const mockDispatchFn = jest.fn();

describe('DigitalContactElem Component', () => {
  let result: RenderResult | undefined;

  beforeEach(() => {
    // mock action
    const deleteActionSpy = jest.spyOn(actions, 'deleteLegalAddress');
    deleteActionSpy.mockImplementation(deleteMockActionFn as any);
    // mock dispatch
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    // render component
    result = render(
      <DigitalContactsCodeVerificationProvider>
        <DigitalContactElem
          fields={fields}
          removeModalTitle="mocked-title"
          removeModalBody="mocked-body"
          recipientId="mocked-recipientId"
          senderId="mocked-senderId"
          value="mocked-value"
          contactType={LegalChannelType.PEC}
          onConfirmClick={() => {}}
        />
      </DigitalContactsCodeVerificationProvider>
    );
  });

  afterEach(() => {
    result = undefined;
  });

  it('renders DigitalContactElem (no edit mode)', () => {
    expect(result?.container).toHaveTextContent('Campo 1');
    expect(result?.container).toHaveTextContent('Campo 2');
    const input = result?.queryByTestId('field');
    expect(input).not.toBeInTheDocument();
    const buttons = result?.container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons![0]).toHaveTextContent('button.modifica');
    expect(buttons![1]).toHaveTextContent('button.rimuovi');
  });

  it('renders DigitalContactElem (edit mode)', async () => {
    const buttons = result?.container.querySelectorAll('button');
    fireEvent.click(buttons![0]);
    await waitFor(() => {
      const input = result?.queryByTestId('field');
      expect(input).toBeInTheDocument();
      const newButtons = result?.container.querySelectorAll('button');
      expect(newButtons).toHaveLength(2);
      expect(newButtons![0]).toHaveTextContent('button.salva');
    });
  });

  it('shows remove modal', async () => {
    const buttons = result?.container.querySelectorAll('button');
    fireEvent.click(buttons![1]);
    const dialog = await waitFor(() => screen.queryByRole('dialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('mocked-title');
    expect(dialog).toHaveTextContent('mocked-body');
    const dialogButtons = dialog?.querySelectorAll('button');
    expect(dialogButtons).toHaveLength(2);
    expect(dialogButtons![0]).toHaveTextContent('button.annulla');
    expect(dialogButtons![1]).toHaveTextContent('button.conferma');
  });

  it('closes remove modal (clicks on cancel)', async () => {
    const buttons = result?.container.querySelectorAll('button');
    fireEvent.click(buttons![1]);
    const dialog = await waitFor(() => screen.queryByRole('dialog'));
    expect(dialog).toBeInTheDocument();
    const dialogButtons = dialog?.querySelectorAll('button');
    fireEvent.click(dialogButtons![0]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
  });

  it('closes remove modal (clicks on confirm)', async () => {
    const buttons = result?.container.querySelectorAll('button');
    fireEvent.click(buttons![1]);
    const dialog = await waitFor(() => screen.queryByRole('dialog'));
    expect(dialog).toBeInTheDocument();
    const dialogButtons = dialog?.querySelectorAll('button');
    fireEvent.click(dialogButtons![1]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
      expect(deleteMockActionFn).toBeCalledTimes(1);
      expect(deleteMockActionFn).toBeCalledWith({
        recipientId: 'mocked-recipientId',
        senderId: 'mocked-senderId',
        channelType: LegalChannelType.PEC,
      });
    });
  });
});
