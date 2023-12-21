import React from 'react';
import { vi } from 'vitest';

import { TextField } from '@mui/material';

import {
  RenderResult,
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../__test__/test-utils';
import * as api from '../../../api/contacts/Contacts.api';
import { DigitalAddress, LegalChannelType } from '../../../models/contacts';
import { TrackEventType } from '../../../utility/events';
import * as trackingFunctions from '../../../utility/mixpanel';
import DigitalContactElem from '../DigitalContactElem';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

const fields = [
  {
    id: 'label',
    component: 'PEC',
    size: 'variable' as 'variable' | 'auto',
  },
  {
    id: 'value',
    component: (
      <TextField
        id="pec"
        fullWidth
        name="pec"
        label="PEC"
        variant="outlined"
        size="small"
        value="mocked@pec.it"
        data-testid="field"
      />
    ),
    size: 'auto' as 'variable' | 'auto',
    isEditable: true,
  },
];

const mockResetModifyValue = vi.fn();
const mockDeleteCbk = vi.fn();
const mockOnConfirm = vi.fn();

/*
In questo test viene testato solo il rendering dei componenti e non il flusso.
Il flusso completo viene testato nei singoli componenti, dove si potrà testare anche il cambio di stato di redux e le api.
Per questo motivo non è necessario mockare le api, ma va bene anche usare lo spyOn.

Andrea Cimini - 6/09/2023
*/
describe('DigitalContactElem Component', () => {
  let result: RenderResult | undefined;

  afterEach(() => {
    result = undefined;
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('renders component', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <DigitalContactElem
            fields={fields}
            removeModalTitle="mocked-title"
            removeModalBody="mocked-body"
            recipientId="mocked-recipientId"
            senderId="mocked-senderId"
            value="mocked@pec.it"
            contactType={LegalChannelType.PEC}
            onConfirmClick={mockOnConfirm}
            resetModifyValue={mockResetModifyValue}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    expect(result?.container).toHaveTextContent('PEC');
    expect(result?.container).toHaveTextContent('mocked@pec.it');
    const input = result?.queryByTestId('field');
    expect(input).not.toBeInTheDocument();
    const buttons = result?.container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons![0]).toHaveTextContent('button.modifica');
    expect(buttons![1]).toHaveTextContent('button.elimina');
  });

  it('edits contact', async () => {
    vi
      .spyOn(api.ContactsApi, 'createOrUpdateLegalAddress')
      .mockResolvedValueOnce({ pecValid: true } as DigitalAddress);
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <DigitalContactElem
            fields={fields}
            removeModalTitle="mocked-title"
            removeModalBody="mocked-body"
            recipientId="mocked-recipientId"
            senderId="mocked-senderId"
            value="mocked@pec.it"
            contactType={LegalChannelType.PEC}
            onConfirmClick={mockOnConfirm}
            resetModifyValue={mockResetModifyValue}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const buttons = result?.container.querySelectorAll('button');
    fireEvent.click(buttons![0]);
    let input = await waitFor(() => result?.container.querySelector('[name="pec"]'));
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('mocked@pec.it');
    const newButtons = result?.container.querySelectorAll('button');
    expect(newButtons).toHaveLength(2);
    expect(newButtons![0]).toHaveTextContent('button.salva');
    expect(newButtons![1]).toHaveTextContent('button.annulla');
    // cancel edit
    fireEvent.click(newButtons![1]);
    await waitFor(() => {
      expect(mockResetModifyValue).toBeCalledTimes(1);
    });
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
    // confirm edit
    fireEvent.click(buttons![0]);
    input = await waitFor(() => result?.container.querySelector('[name="pec"]'));
    fireEvent.click(newButtons![0]);
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(mockOnConfirm).toBeCalledTimes(1);
    });
  });

  it('remove contact', async () => {
    vi.spyOn(api.ContactsApi, 'deleteLegalAddress').mockResolvedValueOnce('mocked-senderId');
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <DigitalContactElem
            fields={fields}
            removeModalTitle="mocked-title"
            removeModalBody="mocked-body"
            recipientId="mocked-recipientId"
            senderId="mocked-senderId"
            value="mocked@pec.it"
            contactType={LegalChannelType.PEC}
            onConfirmClick={mockOnConfirm}
            resetModifyValue={mockResetModifyValue}
            onDeleteCbk={mockDeleteCbk}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const buttons = result?.container.querySelectorAll('button');
    fireEvent.click(buttons![1]);
    let dialog = await waitFor(() => screen.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('mocked-title');
    expect(dialog).toHaveTextContent('mocked-body');
    let dialogButtons = dialog?.querySelectorAll('button');
    expect(dialogButtons).toHaveLength(2);
    expect(dialogButtons![0]).toHaveTextContent('button.annulla');
    expect(dialogButtons![1]).toHaveTextContent('button.conferma');
    // click on cancel
    fireEvent.click(dialogButtons![0]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    // click on confirm
    fireEvent.click(buttons![1]);
    dialog = await waitFor(() => screen.getByRole('dialog'));
    dialogButtons = dialog?.querySelectorAll('button');
    fireEvent.click(dialogButtons![1]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(mockDeleteCbk).toBeCalledTimes(1);
    });
  });

  it('delete contacts blocked', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <DigitalContactElem
            fields={fields}
            removeModalTitle="mocked-title"
            removeModalBody="mocked-body"
            recipientId="mocked-recipientId"
            senderId="mocked-senderId"
            value="mocked@pec.it"
            contactType={LegalChannelType.PEC}
            onConfirmClick={mockOnConfirm}
            resetModifyValue={mockResetModifyValue}
            blockDelete
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const buttons = result?.container.querySelectorAll('button');
    fireEvent.click(buttons![1]);
    const dialog = await waitFor(() => screen.getByRole('dialog'));
    const dialogButtons = dialog?.querySelectorAll('button');
    expect(dialogButtons).toHaveLength(1);
    expect(dialogButtons![0]).toHaveTextContent('button.close');
  });

  it('save disabled', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <DigitalContactElem
            fields={fields}
            removeModalTitle="mocked-title"
            removeModalBody="mocked-body"
            recipientId="mocked-recipientId"
            senderId="mocked-senderId"
            value="mocked@pec.it"
            contactType={LegalChannelType.PEC}
            onConfirmClick={mockOnConfirm}
            resetModifyValue={mockResetModifyValue}
            saveDisabled
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const buttons = result?.container.querySelectorAll('button');
    fireEvent.click(buttons![0]);
    const newButtons = await waitFor(() => result?.container.querySelectorAll('button'));
    expect(newButtons).toHaveLength(2);
    expect(newButtons![0]).toHaveTextContent('button.salva');
    expect(newButtons![0]).toBeDisabled();
    expect(newButtons![1]).toHaveTextContent('button.annulla');
  });

  it('edit disabled', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <DigitalContactElem
            fields={fields}
            removeModalTitle="mocked-title"
            removeModalBody="mocked-body"
            recipientId="mocked-recipientId"
            senderId="mocked-senderId"
            value="mocked@pec.it"
            contactType={LegalChannelType.PEC}
            onConfirmClick={mockOnConfirm}
            resetModifyValue={mockResetModifyValue}
            editDisabled
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const buttons = result?.container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons![0]).toHaveTextContent('button.modifica');
    expect(buttons![0]).toBeDisabled();
    expect(buttons![1]).toHaveTextContent('button.elimina');
  });
});
