import MockAdapter from 'axios-mock-adapter';
import * as React from 'react';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import {
  RenderResult,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { CourtesyChannelType, LegalChannelType } from '../../../models/contacts';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
import {
  Component,
  emailValue,
  mockContactsApi,
  pecValue,
  pecValueToVerify,
  senderId,
  showDialog,
} from './DigitalContactsCodeVerification.context.test-utils';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

/*
In questo test viene testato solo il rendering dei componenti e non il flusso.
Il flusso completo viene testato nella pagina dei contatti, dove si può testare anche il cambio di stato di redux e le api

Andrea Cimini - 6/09/2023
*/
describe('DigitalContactsCodeVerification Context', () => {
  let result: RenderResult | undefined;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    result = undefined;
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders CodeModal (modal closed)', () => {
    // render component
    result = render(
      <DigitalContactsCodeVerificationProvider>
        <Component type={LegalChannelType.PEC} value={pecValue} senderId={senderId} />
      </DigitalContactsCodeVerificationProvider>
    );
    const button = result?.container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    const dialog = screen.queryByTestId('codeDialog');
    expect(dialog).not.toBeInTheDocument();
  });

  it('renders CodeModal (modal opened)', async () => {
    mockContactsApi(mock, LegalChannelType.PEC, pecValue, senderId);
    // render component
    result = render(
      <DigitalContactsCodeVerificationProvider>
        <Component type={LegalChannelType.PEC} value={pecValue} senderId={senderId} />
      </DigitalContactsCodeVerificationProvider>
    );
    const dialog = await showDialog(result!, mock, pecValue);
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
    mockContactsApi(mock, LegalChannelType.PEC, pecValueToVerify, senderId, true);
    // render component
    result = render(
      <DigitalContactsCodeVerificationProvider>
        <Component type={LegalChannelType.PEC} value={pecValueToVerify} senderId={senderId} />
      </DigitalContactsCodeVerificationProvider>
    );
    const dialog = await showDialog(result!, mock, pecValueToVerify);
    const codeInputs = dialog?.querySelectorAll('input');
    // fill inputs with values
    codeInputs?.forEach((input, index) => {
      fireEvent.change(input, { target: { value: index.toString() } });
    });
    const buttons = dialog?.querySelectorAll('button');
    fireEvent.click(buttons![1]);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: pecValueToVerify,
        verificationCode: '01234',
      });
    });
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
    mockContactsApi(mock, LegalChannelType.PEC, pecValue, senderId);
    // render component
    result = render(
      <DigitalContactsCodeVerificationProvider>
        <Component type={LegalChannelType.PEC} value={pecValue} senderId={senderId} />
      </DigitalContactsCodeVerificationProvider>
    );
    const dialog = await showDialog(result!, mock, pecValue);
    const codeInputs = dialog?.querySelectorAll('input');
    // fill inputs with values
    codeInputs?.forEach((input, index) => {
      fireEvent.change(input, { target: { value: index.toString() } });
    });
    const buttons = dialog?.querySelectorAll('button');
    fireEvent.click(buttons![1]);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: pecValue,
        verificationCode: '01234',
      });
    });
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    const validationDialog = result.queryByTestId('validationDialog');
    expect(validationDialog).not.toBeInTheDocument();
  });

  it('disclaimer modal', async () => {
    mockContactsApi(mock, CourtesyChannelType.EMAIL, emailValue);
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
    mockContactsApi(
      mock,
      CourtesyChannelType.EMAIL,
      digitalAddresses.courtesy[0].value,
      'another-sender-id'
    );
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
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: digitalAddresses.courtesy[0].value,
      });
    });
    const dialog = await waitFor(() => screen.queryByTestId('codeDialog'));
    expect(dialog).toBeInTheDocument();
  });
});
