import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import {
  RenderResult,
  act,
  fireEvent,
  render,
  testStore,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { LEGAL_CONTACT } from '../../../api/contacts/contacts.routes';
import { DigitalAddress, LegalChannelType } from '../../../models/contacts';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
import InsertLegalContact from '../InsertLegalContact';
import LegalContactsList from '../LegalContactsList';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

const defaultAddress = digitalAddresses.legal.find(
  (addr) => addr.senderId === 'default' && addr.pecValid
);

const fillCodeDialog = async (result: RenderResult) => {
  const dialog = await waitFor(() => result.getByTestId('codeDialog'));
  expect(dialog).toBeInTheDocument();
  const codeInputs = dialog?.querySelectorAll('input');
  // fill inputs with values
  codeInputs?.forEach((codeInput, index) => {
    fireEvent.change(codeInput, { target: { value: index.toString() } });
  });
  // confirm the addition
  const dialogButtons = dialog?.querySelectorAll('button');
  fireEvent.click(dialogButtons![1]);
  return dialog;
};

const IntegrationComponent = ({
  digitalAddresses,
}: {
  digitalAddresses: Array<DigitalAddress>;
}) => (
  <DigitalContactsCodeVerificationProvider>
    {digitalAddresses.length === 0 ? (
      <InsertLegalContact recipientId={defaultAddress!.recipientId} />
    ) : (
      <LegalContactsList
        recipientId={defaultAddress!.recipientId}
        legalAddresses={digitalAddresses}
      />
    )}
  </DigitalContactsCodeVerificationProvider>
);

describe('LegalContactsList Component', () => {
  let mock: MockAdapter;
  let result: RenderResult | undefined;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders component', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <LegalContactsList
            recipientId={defaultAddress!.recipientId}
            legalAddresses={digitalAddresses.legal}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    expect(result?.container).toHaveTextContent('legal-contacts.title');
    expect(result?.container).toHaveTextContent('legal-contacts.subtitle-2');
    const form = result?.container.querySelector('form');
    expect(form!).toBeInTheDocument();
    expect(form!).toHaveTextContent('legal-contacts.pec-added');
    expect(form!).toHaveTextContent(defaultAddress!.value);
    const buttons = form?.querySelectorAll('button');
    expect(buttons!).toHaveLength(2);
    expect(buttons![0]).toHaveTextContent('button.modifica');
    expect(buttons![1]).toHaveTextContent('button.elimina');
    const disclaimer = result?.getByTestId('legal-contact-disclaimer');
    expect(disclaimer).toBeInTheDocument();
  });

  it('adds pec, checks validation and removes it', async () => {
    const pecValue = defaultAddress!.value;
    mock
      .onPost(LEGAL_CONTACT('default', LegalChannelType.PEC), {
        value: pecValue,
      })
      .reply(200);
    mock
      .onPost(LEGAL_CONTACT('default', LegalChannelType.PEC), {
        value: pecValue,
        verificationCode: '01234',
      })
      .reply(200, { result: 'PEC_VALIDATION_REQUIRED' });
    await act(async () => {
      result = await render(<IntegrationComponent digitalAddresses={[]} />);
    });
    // insert new pec
    let insertLegalContact = result?.getByTestId('insertLegalContact');
    const input = insertLegalContact?.querySelector('input[name="pec"]');
    fireEvent.change(input!, { target: { value: pecValue } });
    const button = within(insertLegalContact!).getByTestId('addContact');
    await waitFor(() => {
      expect(button).toBeEnabled();
    });
    fireEvent.click(button);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: pecValue,
      });
    });
    // inser otp and confirm
    const dialog = await fillCodeDialog(result!);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: pecValue,
        verificationCode: '01234',
      });
    });
    // validation dialog must be shown
    const validationDialog = await waitFor(() => result?.getByTestId('validationDialog'));
    expect(validationDialog).toBeInTheDocument();
    expect(dialog).not.toBeInTheDocument();
    const confirmButton = within(validationDialog!).getByRole('button');
    // close validation dialog and check that the corrent component is shown
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(validationDialog).not.toBeInTheDocument();
    });
    expect(testStore.getState().contactsState.digitalAddresses.legal).toStrictEqual([
      { ...defaultAddress, pecValid: false, value: '', senderName: undefined },
    ]);
    // simulate rerendering due to redux changes
    result?.rerender(
      <IntegrationComponent digitalAddresses={[{ ...defaultAddress!, pecValid: false }]} />
    );
    await waitFor(() => {
      expect(insertLegalContact).not.toBeInTheDocument();
    });
    const legalContacts = result?.getByTestId('legalContacts');
    expect(legalContacts).toBeInTheDocument();
    expect(legalContacts).toHaveTextContent('legal-contacts.pec-validating');
    expect(legalContacts).toHaveTextContent('legal-contacts.validation-in-progress');
    // cancel validation
    const cancelValidationBtn = within(legalContacts!).getByRole('button');
    fireEvent.click(cancelValidationBtn!);
    const cancelVerificationModal = await waitFor(() =>
      result?.getByTestId('cancelVerificationModal')
    );
    const buttons = within(cancelVerificationModal!).getAllByRole('button');
    fireEvent.click(buttons[1]);
    await waitFor(() => {
      expect(testStore.getState().contactsState.digitalAddresses.legal).toStrictEqual([]);
    });
    // simulate rerendering due to redux changes
    result?.rerender(<IntegrationComponent digitalAddresses={[]} />);
    await waitFor(() => {
      expect(legalContacts).not.toBeInTheDocument();
      insertLegalContact = result?.getByTestId('insertLegalContact');
      expect(insertLegalContact).toBeInTheDocument();
    });
  });

  it('edits pec', async () => {
    const pecValue = 'nome.utente-modificata@pec.it';
    mock
      .onPost(LEGAL_CONTACT('default', LegalChannelType.PEC), {
        value: pecValue,
      })
      .reply(200);
    mock
      .onPost(LEGAL_CONTACT('default', LegalChannelType.PEC), {
        value: pecValue,
        verificationCode: '01234',
      })
      .reply(204);
    await act(async () => {
      result = await render(<IntegrationComponent digitalAddresses={[defaultAddress!]} />, {
        preloadedState: {
          contactsState: { digitalAddresses: { legal: [defaultAddress], courtesy: [] } },
        },
      });
    });
    const legalContacts = result?.getByTestId('legalContacts');
    const editButton = within(legalContacts!).getByRole('button', { name: 'button.modifica' });
    fireEvent.click(editButton);
    // edit pec
    const input = legalContacts?.querySelector('input[name="pec"]');
    fireEvent.change(input!, { target: { value: pecValue } });
    await waitFor(() => expect(input!).toHaveValue(pecValue));
    const saveButton = within(legalContacts!).getByRole('button', { name: 'button.salva' });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: pecValue,
      });
    });
    const dialog = await fillCodeDialog(result!);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: pecValue,
        verificationCode: '01234',
      });
    });
    expect(dialog).not.toBeInTheDocument();
    expect(testStore.getState().contactsState.digitalAddresses.legal).toStrictEqual([
      {
        ...defaultAddress,
        value: pecValue,
        senderName: undefined,
      },
    ]);
    // simulate rerendering due to redux changes
    result?.rerender(
      <IntegrationComponent digitalAddresses={[{ ...defaultAddress!, value: pecValue }]} />
    );
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
      expect(result?.container).toHaveTextContent(pecValue);
    });
  });

  it('delete pec', async () => {
    mock.onDelete(LEGAL_CONTACT('default', LegalChannelType.PEC)).reply(204);
    const result = render(<IntegrationComponent digitalAddresses={[defaultAddress!]} />, {
      preloadedState: {
        contactsState: { digitalAddresses: { legal: [defaultAddress], courtesy: [] } },
      },
    });
    const legalContacts = result?.getByTestId('legalContacts');
    const phoneText = within(legalContacts!).getByText(defaultAddress!.value);
    expect(phoneText).toBeInTheDocument();
    const deleteButton = within(legalContacts!).getByRole('button', { name: 'button.elimina' });
    fireEvent.click(deleteButton);
    // find confirmation dialog and its buttons
    const dialogBox = result.getByRole('dialog', { name: /legal-contacts.remove\b/ });
    expect(dialogBox).toBeVisible();
    const cancelButton = within(dialogBox).getByRole('button', { name: 'button.annulla' });
    const confirmButton = within(dialogBox).getByRole('button', { name: 'button.conferma' });
    // cancel delete and verify the dialog hides
    fireEvent.click(cancelButton);
    expect(dialogBox).not.toBeVisible();
    // delete the pec
    fireEvent.click(deleteButton);
    expect(dialogBox).toBeVisible();
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(dialogBox).not.toBeVisible();
      expect(mock.history.delete).toHaveLength(1);
    });
    expect(testStore.getState().contactsState.digitalAddresses.legal).toStrictEqual([]);
    // simulate rerendering due to redux changes
    result.rerender(<IntegrationComponent digitalAddresses={[]} />);
    await waitFor(() => {
      const insertLegalContact = result?.getByTestId('insertLegalContact');
      expect(insertLegalContact).toBeInTheDocument();
      expect(result.container).not.toHaveTextContent(defaultAddress!.value);
    });
  });

  it('checks invalid pec', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <LegalContactsList
            recipientId="mocked-recipientId"
            legalAddresses={digitalAddresses.legal}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const form = result?.container.querySelector('form');
    const buttons = form?.querySelectorAll('button');
    fireEvent.click(buttons![0]);
    const input = form?.querySelector('input[name="pec"]');
    // add invalid values
    fireEvent.change(input!, { target: { value: 'mail-errata' } });
    await waitFor(() => expect(input!).toHaveValue('mail-errata'));
    let errorMessage = form?.querySelector('#pec-helper-text');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('legal-contacts.valid-pec');
    const newButtons = form?.querySelectorAll('button');
    expect(newButtons![0]).toBeDisabled();
    fireEvent.change(input!, { target: { value: '' } });
    await waitFor(() => expect(input!).toHaveValue(''));
    errorMessage = form?.querySelector('#pec-helper-text');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('legal-contacts.valid-pec');
  });
});
