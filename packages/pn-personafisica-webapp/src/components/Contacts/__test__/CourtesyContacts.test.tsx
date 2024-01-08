import MockAdapter from 'axios-mock-adapter';
import * as React from 'react';
import { vi } from 'vitest';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import {
  RenderResult,
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import { COURTESY_CONTACT } from '../../../api/contacts/contacts.routes';
import { CourtesyChannelType } from '../../../models/contacts';
import CourtesyContactItem, { CourtesyFieldType } from '../CourtesyContactItem';
import CourtesyContacts from '../CourtesyContacts';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';

// this is needed because there is a bug when vi.mock is used
// https://github.com/vitest-dev/vitest/issues/3300
// maybe with vitest 1, we can remove the workaround
const apiClients = await import('../../../api/apiClients');
const testUtils = await import('../../../__test__/test-utils');

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

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

const defaultEmailAddress = digitalAddresses.courtesy.find(
  (addr) => addr.senderId === 'default' && addr.channelType === CourtesyChannelType.EMAIL
);

const defaultPhoneAddress = digitalAddresses.courtesy.find(
  (addr) => addr.senderId === 'default' && addr.channelType === CourtesyChannelType.SMS
);

describe('CourtesyContacts Component', () => {
  let mock: MockAdapter;
  let result: RenderResult | undefined;

  beforeAll(() => {
    mock = new MockAdapter(apiClients.apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders component - no contacts', async () => {
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContacts recipientId={defaultPhoneAddress!.recipientId} contacts={[]} />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const avatar = result?.getByText('Email');
    expect(avatar).toBeInTheDocument();
    const title = result?.getByRole('heading');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('courtesy-contacts.subtitle');
    const body = result?.getByTestId('DigitalContactsCardBody');
    expect(body).toHaveTextContent('courtesy-contacts.title');
    expect(body).toHaveTextContent('courtesy-contacts.description');
    const disclaimer = result?.getByTestId('contacts disclaimer');
    expect(disclaimer).toBeInTheDocument();
    // check inputs
    const phoneInput = result?.container.querySelector(`[name="${CourtesyFieldType.PHONE}"]`);
    const emailInput = result?.container.querySelector(`[name="${CourtesyFieldType.EMAIL}"]`);
    expect(phoneInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
  });

  it('add new phone number', async () => {
    const phoneValue = '3333333333';
    mock
      .onPost(COURTESY_CONTACT('default', CourtesyChannelType.SMS), {
        value: '+39' + phoneValue,
      })
      .reply(200);
    mock
      .onPost(COURTESY_CONTACT('default', CourtesyChannelType.SMS), {
        value: '+39' + phoneValue,
        verificationCode: '01234',
      })
      .reply(204);
    const result = render(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContactItem
          recipientId={defaultPhoneAddress!.recipientId}
          type={CourtesyFieldType.PHONE}
          value=""
        />
      </DigitalContactsCodeVerificationProvider>
    );
    const input = result.container.querySelector(`[name="${CourtesyFieldType.PHONE}"]`);
    expect(input).toHaveValue('');
    fireEvent.change(input!, { target: { value: phoneValue } });
    await waitFor(() => expect(input!).toHaveValue(phoneValue));
    const button = result.getByRole('button');
    expect(button).toBeEnabled();
    // save the phone
    fireEvent.click(button!);
    // Confirms the disclaimer dialog
    const disclaimerCheckbox = await waitFor(() => result.getByTestId('disclaimer-checkbox'));
    fireEvent.click(disclaimerCheckbox);
    const disclaimerConfirmButton = result.getByTestId('disclaimer-confirm-button');
    fireEvent.click(disclaimerConfirmButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: '+39' + phoneValue,
      });
    });
    const dialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: '+39' + phoneValue,
        verificationCode: '01234',
      });
    });
    expect(dialog).not.toBeInTheDocument();
    expect(testUtils.testStore.getState().contactsState.digitalAddresses.courtesy).toStrictEqual([
      {
        ...defaultPhoneAddress,
        senderName: undefined,
        value: '+39' + phoneValue,
      },
    ]);
    // simulate rerendering due to redux changes
    result.rerender(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContactItem
          recipientId={defaultPhoneAddress!.recipientId}
          type={CourtesyFieldType.PHONE}
          value={'+39' + phoneValue}
        />
      </DigitalContactsCodeVerificationProvider>
    );
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
      expect(result.container).toHaveTextContent('+39' + phoneValue);
    });
  });

  it('override an existing phone number with a new one', async () => {
    const phoneValue = '+393333333334';
    mock
      .onPost(COURTESY_CONTACT('default', CourtesyChannelType.SMS), {
        value: phoneValue,
      })
      .reply(200);
    mock
      .onPost(COURTESY_CONTACT('default', CourtesyChannelType.SMS), {
        value: phoneValue,
        verificationCode: '01234',
      })
      .reply(204);
    const result = render(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContactItem
          recipientId={defaultPhoneAddress!.recipientId}
          type={CourtesyFieldType.PHONE}
          value={defaultPhoneAddress!.value}
        />
      </DigitalContactsCodeVerificationProvider>,
      {
        preloadedState: {
          contactsState: { digitalAddresses: { courtesy: [defaultPhoneAddress], legal: [] } },
        },
      }
    );
    const editButton = result.getByRole('button', { name: 'button.modifica' });
    fireEvent.click(editButton);
    const input = result.container.querySelector(`[name="${CourtesyFieldType.PHONE}"]`);
    fireEvent.change(input!, { target: { value: phoneValue } });
    await waitFor(() => {
      expect(input!).toHaveValue(phoneValue);
    });
    const saveButton = result.getByRole('button', { name: 'button.salva' });
    fireEvent.click(saveButton);
    // Confirms the disclaimer dialog
    const disclaimerCheckbox = await waitFor(() => result.getByTestId('disclaimer-checkbox'));
    fireEvent.click(disclaimerCheckbox);
    const disclaimerConfirmButton = result.getByTestId('disclaimer-confirm-button');
    fireEvent.click(disclaimerConfirmButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: phoneValue,
      });
    });
    const dialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: phoneValue,
        verificationCode: '01234',
      });
    });
    expect(dialog).not.toBeInTheDocument();
    expect(testUtils.testStore.getState().contactsState.digitalAddresses.courtesy).toStrictEqual([
      {
        ...defaultPhoneAddress,
        senderName: undefined,
        value: phoneValue,
      },
    ]);
    // simulate rerendering due to redux changes
    result.rerender(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContactItem
          recipientId={defaultPhoneAddress!.recipientId}
          type={CourtesyFieldType.PHONE}
          value={phoneValue}
        />
      </DigitalContactsCodeVerificationProvider>
    );
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
      expect(result.container).toHaveTextContent(phoneValue);
    });
  });

  it('delete phone number', async () => {
    mock.onDelete(COURTESY_CONTACT('default', CourtesyChannelType.SMS)).reply(204);
    const phoneValue = defaultPhoneAddress!.value;
    const result = render(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContactItem
          recipientId={defaultPhoneAddress!.recipientId}
          type={CourtesyFieldType.PHONE}
          value={phoneValue}
        />
      </DigitalContactsCodeVerificationProvider>,
      {
        preloadedState: {
          contactsState: { digitalAddresses: { courtesy: [defaultPhoneAddress], legal: [] } },
        },
      }
    );
    const phoneText = result.getByText(phoneValue);
    expect(phoneText).toBeInTheDocument();
    const deleteButton = result.getByRole('button', { name: 'button.elimina' });
    fireEvent.click(deleteButton);
    // find confirmation dialog and its buttons
    const dialogBox = result.getByRole('dialog', { name: /courtesy-contacts.remove\b/ });
    expect(dialogBox).toBeVisible();
    const cancelButton = within(dialogBox).getByRole('button', { name: 'button.annulla' });
    const confirmButton = within(dialogBox).getByRole('button', { name: 'button.conferma' });
    // cancel delete and verify the dialog hides
    fireEvent.click(cancelButton);
    expect(dialogBox).not.toBeVisible();
    // delete the number
    fireEvent.click(deleteButton);
    expect(dialogBox).toBeVisible();
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(dialogBox).not.toBeVisible();
      expect(mock.history.delete).toHaveLength(1);
    });
    expect(testUtils.testStore.getState().contactsState.digitalAddresses.courtesy).toStrictEqual(
      []
    );
    // simulate rerendering due to redux changes
    result.rerender(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContactItem
          recipientId={defaultPhoneAddress!.recipientId}
          type={CourtesyFieldType.PHONE}
          value=""
        />
      </DigitalContactsCodeVerificationProvider>
    );
    await waitFor(() => {
      const input = result.container.querySelector(`[name="${CourtesyFieldType.PHONE}"]`);
      expect(input).toBeInTheDocument();
      expect(result.container).not.toHaveTextContent(phoneValue);
    });
  });

  it('add new email', async () => {
    const mailValue = 'nome.cognome@mail.it';
    mock
      .onPost(COURTESY_CONTACT('default', CourtesyChannelType.EMAIL), { value: mailValue })
      .reply(200);
    mock
      .onPost(COURTESY_CONTACT('default', CourtesyChannelType.EMAIL), {
        value: mailValue,
        verificationCode: '01234',
      })
      .reply(204);
    const result = render(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContactItem
          recipientId={defaultEmailAddress!.recipientId}
          type={CourtesyFieldType.EMAIL}
          value=""
        />
      </DigitalContactsCodeVerificationProvider>
    );
    const input = result.container.querySelector(`[name="${CourtesyFieldType.EMAIL}"]`);
    expect(input).toHaveValue('');
    fireEvent.change(input!, { target: { value: mailValue } });
    await waitFor(() => expect(input!).toHaveValue(mailValue));
    const button = result.getByRole('button');
    expect(button).toBeEnabled();
    // save the email
    fireEvent.click(button!);
    // Confirms the disclaimer dialog
    const disclaimerCheckbox = await waitFor(() => result.getByTestId('disclaimer-checkbox'));
    fireEvent.click(disclaimerCheckbox);
    const disclaimerConfirmButton = result.getByTestId('disclaimer-confirm-button');
    fireEvent.click(disclaimerConfirmButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: mailValue,
      });
    });
    const dialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: mailValue,
        verificationCode: '01234',
      });
    });
    expect(dialog).not.toBeInTheDocument();
    expect(testUtils.testStore.getState().contactsState.digitalAddresses.courtesy).toStrictEqual([
      {
        ...defaultEmailAddress,
        senderName: undefined,
        value: mailValue,
      },
    ]);
    // simulate rerendering due to redux changes
    result.rerender(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContactItem
          recipientId={defaultEmailAddress!.recipientId}
          type={CourtesyFieldType.EMAIL}
          value={mailValue}
        />
      </DigitalContactsCodeVerificationProvider>
    );
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
      expect(result.container).toHaveTextContent(mailValue);
    });
  });

  it('override an existing email with a new one', async () => {
    const emailValue = 'nome.cognome-modified@mail.com';
    mock
      .onPost(COURTESY_CONTACT('default', CourtesyChannelType.EMAIL), {
        value: emailValue,
      })
      .reply(200);
    mock
      .onPost(COURTESY_CONTACT('default', CourtesyChannelType.EMAIL), {
        value: emailValue,
        verificationCode: '01234',
      })
      .reply(204);
    const result = render(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContactItem
          recipientId={defaultEmailAddress!.recipientId}
          type={CourtesyFieldType.EMAIL}
          value={emailValue}
        />
      </DigitalContactsCodeVerificationProvider>,
      {
        preloadedState: {
          contactsState: { digitalAddresses: { courtesy: [defaultEmailAddress], legal: [] } },
        },
      }
    );
    const editButton = result.getByRole('button', { name: 'button.modifica' });
    fireEvent.click(editButton);
    const input = result.container.querySelector(`[name="${CourtesyFieldType.EMAIL}"]`);
    fireEvent.change(input!, { target: { value: emailValue } });
    await waitFor(() => expect(input!).toHaveValue(emailValue));
    const saveButton = result.getByRole('button', { name: 'button.salva' });
    fireEvent.click(saveButton);
    // Confirms the disclaimer dialog
    const disclaimerCheckbox = await waitFor(() => result.getByTestId('disclaimer-checkbox'));
    fireEvent.click(disclaimerCheckbox);
    const disclaimerConfirmButton = result.getByTestId('disclaimer-confirm-button');
    fireEvent.click(disclaimerConfirmButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: emailValue,
      });
    });
    const dialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: emailValue,
        verificationCode: '01234',
      });
    });
    expect(dialog).not.toBeInTheDocument();
    expect(testUtils.testStore.getState().contactsState.digitalAddresses.courtesy).toStrictEqual([
      {
        ...defaultEmailAddress,
        senderName: undefined,
        value: emailValue,
      },
    ]);
    // simulate rerendering due to redux changes
    result.rerender(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContactItem
          recipientId={defaultEmailAddress!.recipientId}
          type={CourtesyFieldType.EMAIL}
          value={emailValue}
        />
      </DigitalContactsCodeVerificationProvider>
    );
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
      expect(result.container).toHaveTextContent(emailValue);
    });
  });

  it('delete email', async () => {
    mock.onDelete(COURTESY_CONTACT('default', CourtesyChannelType.EMAIL)).reply(204);
    const emailValue = defaultEmailAddress!.value;
    const result = render(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContactItem
          recipientId={defaultPhoneAddress!.recipientId}
          type={CourtesyFieldType.EMAIL}
          value={emailValue}
        />
      </DigitalContactsCodeVerificationProvider>,
      {
        preloadedState: {
          contactsState: { digitalAddresses: { courtesy: [defaultEmailAddress], legal: [] } },
        },
      }
    );
    const phoneText = result.getByText(emailValue);
    expect(phoneText).toBeInTheDocument();
    const deleteButton = result.getByRole('button', { name: 'button.elimina' });
    fireEvent.click(deleteButton);
    // find confirmation dialog and its buttons
    const dialogBox = result.getByRole('dialog', { name: /courtesy-contacts.remove\b/ });
    expect(dialogBox).toBeVisible();
    const cancelButton = within(dialogBox).getByRole('button', { name: 'button.annulla' });
    const confirmButton = within(dialogBox).getByRole('button', { name: 'button.conferma' });
    // cancel delete and verify the dialog hides
    fireEvent.click(cancelButton);
    expect(dialogBox).not.toBeVisible();
    // delete the number
    fireEvent.click(deleteButton);
    expect(dialogBox).toBeVisible();
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(dialogBox).not.toBeVisible();
      expect(mock.history.delete).toHaveLength(1);
    });
    expect(testUtils.testStore.getState().contactsState.digitalAddresses.courtesy).toStrictEqual(
      []
    );
    // simulate rerendering due to redux changes
    result.rerender(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContactItem
          recipientId={defaultEmailAddress!.recipientId}
          type={CourtesyFieldType.EMAIL}
          value=""
        />
      </DigitalContactsCodeVerificationProvider>
    );
    await waitFor(() => {
      const input = result.container.querySelector(`[name="${CourtesyFieldType.EMAIL}"]`);
      expect(input).toBeInTheDocument();
      expect(result.container).not.toHaveTextContent(emailValue);
    });
  });
});
