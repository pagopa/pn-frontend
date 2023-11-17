import * as React from 'react';
import { vi } from 'vitest';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import {
  RenderResult,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import * as api from '../../../api/contacts/Contacts.api';
import { CourtesyChannelType, DigitalAddress, LegalChannelType } from '../../../models/contacts';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
import {
  Component,
  emailValue,
  pecValue,
  pecValueToVerify,
  senderId,
  showDialog,
} from './DigitalContactsCodeVerification.context.test-utils';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

/*
In questo test viene testato solo il rendering dei componenti e non il flusso.
Il flusso completo viene testato nei singoli componenti, dove si potrà testare anche il cambio di stato di redux e le api.
Per questo motivo non è necessario mockare le api, ma va bene anche usare lo spyOn.

Andrea Cimini - 11/09/2023
*/
describe('DigitalContactsCodeVerification Context', () => {
  let result: RenderResult | undefined;

  afterEach(() => {
    result = undefined;
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('code modal', async () => {
    vi.spyOn(api.ContactsApi, 'createOrUpdateLegalAddress').mockResolvedValueOnce(void 0);
    // render component
    result = render(
      <DigitalContactsCodeVerificationProvider>
        <Component type={LegalChannelType.PEC} value={pecValue} senderId={senderId} />
      </DigitalContactsCodeVerificationProvider>
    );
    const dialog = await showDialog(result!);
    expect(dialog).toBeInTheDocument();
    const title = dialog?.querySelector('#dialog-title');
    expect(title).toHaveTextContent(`legal-contacts.pec-verify ${pecValue}`);
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
    // close modal
    fireEvent.click(buttons![0]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
  });

  it('validation modal - pec to verify', async () => {
    vi
      .spyOn(api.ContactsApi, 'createOrUpdateLegalAddress')
      .mockResolvedValueOnce(void 0)
      .mockResolvedValueOnce({ pecValid: false } as DigitalAddress);
    // render component
    result = render(
      <DigitalContactsCodeVerificationProvider>
        <Component type={LegalChannelType.PEC} value={pecValueToVerify} senderId={senderId} />
      </DigitalContactsCodeVerificationProvider>
    );
    const dialog = await showDialog(result!);
    const codeInputs = dialog?.querySelectorAll('input');
    // fill inputs with values
    codeInputs?.forEach((input, index) => {
      fireEvent.change(input, { target: { value: index.toString() } });
    });
    const buttons = dialog?.querySelectorAll('button');
    fireEvent.click(buttons![1]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    const validationDialog = result.getByTestId('validationDialog');
    expect(validationDialog).toBeInTheDocument();
    expect(validationDialog).toHaveTextContent('legal-contacts.validation-progress-title');
    expect(validationDialog).toHaveTextContent('legal-contacts.validation-progress-content');
    // close dialog
    const button = validationDialog.querySelector('button');
    fireEvent.click(button!);
    await waitFor(() => {
      expect(validationDialog).not.toBeInTheDocument();
    });
  });

  it('validation modal - pec verified', async () => {
    vi
      .spyOn(api.ContactsApi, 'createOrUpdateLegalAddress')
      .mockResolvedValueOnce(void 0)
      .mockResolvedValueOnce({ pecValid: true } as DigitalAddress);
    // render component
    result = render(
      <DigitalContactsCodeVerificationProvider>
        <Component type={LegalChannelType.PEC} value={pecValue} senderId={senderId} />
      </DigitalContactsCodeVerificationProvider>
    );
    const dialog = await showDialog(result!);
    const codeInputs = dialog?.querySelectorAll('input');
    // fill inputs with values
    codeInputs?.forEach((input, index) => {
      fireEvent.change(input, { target: { value: index.toString() } });
    });
    const buttons = dialog?.querySelectorAll('button');
    fireEvent.click(buttons![1]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    const validationDialog = result.queryByTestId('validationDialog');
    expect(validationDialog).not.toBeInTheDocument();
  });

  it('disclaimer modal', async () => {
    vi.spyOn(api.ContactsApi, 'createOrUpdateCourtesyAddress').mockResolvedValueOnce(void 0);
    // render component
    result = render(
      <DigitalContactsCodeVerificationProvider>
        <Component type={CourtesyChannelType.EMAIL} value={emailValue} />
      </DigitalContactsCodeVerificationProvider>
    );
    const button = result.container.querySelector('button');
    fireEvent.click(button!);
    // show disclaimer modal
    const disclaimerDialog = await waitFor(() => result?.getByTestId('disclaimerDialog'));
    expect(disclaimerDialog).toBeInTheDocument();
    const confirmButton = within(disclaimerDialog!).getByTestId('disclaimer-confirm-button');
    expect(confirmButton).toBeDisabled();
    const checkbox = result.getByRole('checkbox');
    fireEvent.click(checkbox);
    // open code dialog
    await waitFor(() => {
      expect(confirmButton).toBeEnabled();
    });
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(disclaimerDialog).not.toBeInTheDocument();
    });
    const dialog = screen.queryByTestId('codeDialog');
    expect(dialog).toBeInTheDocument();
  });

  it('already existing contact modal', async () => {
    vi.spyOn(api.ContactsApi, 'createOrUpdateCourtesyAddress').mockResolvedValueOnce(void 0);
    // render component
    result = render(
      <DigitalContactsCodeVerificationProvider>
        <Component
          type={CourtesyChannelType.EMAIL}
          value={digitalAddresses.courtesy[0].value}
          senderId={'another-sender-id'}
        />
      </DigitalContactsCodeVerificationProvider>,
      { preloadedState: { contactsState: { digitalAddresses } } }
    );
    const button = screen.getByRole('button', { name: 'Click me' });
    fireEvent.click(button);
    const duplicateDialog = await waitFor(() => result?.getByTestId('duplicateDialog'));
    expect(duplicateDialog).toBeInTheDocument();
    const confirmButton = within(duplicateDialog!).getByRole('button', { name: 'button.conferma' });
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(duplicateDialog).not.toBeInTheDocument();
    });
    const dialog = await waitFor(() => screen.queryByTestId('codeDialog'));
    expect(dialog).toBeInTheDocument();
  });
});
