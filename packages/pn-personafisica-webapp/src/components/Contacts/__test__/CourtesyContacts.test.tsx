import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { digitalCourtesyAddresses } from '../../../__mocks__/Contacts.mock';
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
import { AddressType, CourtesyChannelType } from '../../../models/contacts';
import { CourtesyFieldType } from '../CourtesyContactItem';
import CourtesyContacts from '../CourtesyContacts';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';

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
  fireEvent.click(dialogButtons[1]);
  return dialog;
};

const defaultEmailAddress = digitalCourtesyAddresses.find(
  (addr) => addr.channelType === CourtesyChannelType.EMAIL && addr.senderId === 'default'
);

const defaultPhoneAddress = digitalCourtesyAddresses.find(
  (addr) => addr.channelType === CourtesyChannelType.SMS && addr.senderId === 'default'
);

describe('CourtesyContacts Component', async () => {
  let mock: MockAdapter;
  let result: RenderResult;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
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
          <CourtesyContacts contacts={[]} />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const avatar = result.getByText('Email');
    expect(avatar).toBeInTheDocument();
    const title = result.getByRole('heading');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('courtesy-contacts.subtitle');
    const body = result.getByTestId('DigitalContactsCardBody');
    expect(body).toHaveTextContent('courtesy-contacts.title');
    expect(body).toHaveTextContent('courtesy-contacts.description');
    const disclaimer = result.getByTestId('contacts disclaimer');
    expect(disclaimer).toBeInTheDocument();
    // check inputs
    const phoneInput = result.container.querySelector(`[name="${CourtesyFieldType.PHONE}"]`);
    const emailInput = result.container.querySelector(`[name="${CourtesyFieldType.EMAIL}"]`);
    expect(phoneInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
  });

  it('renders components - contacts', async () => {
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContacts contacts={digitalCourtesyAddresses} />
        </DigitalContactsCodeVerificationProvider>
      );
    });

    const defaultPhone = digitalCourtesyAddresses.find(
      (addr) => addr.channelType === CourtesyChannelType.SMS && addr.senderId === 'default'
    );

    const defaultEmail = digitalCourtesyAddresses.find(
      (addr) => addr.channelType === CourtesyChannelType.EMAIL && addr.senderId === 'default'
    );

    const phoneInput = result?.container.querySelector(`[name="${CourtesyFieldType.PHONE}"]`);
    const emailInput = result?.container.querySelector(`[name="${CourtesyFieldType.EMAIL}"]`);
    expect(phoneInput).not.toBeInTheDocument();
    expect(emailInput).not.toBeInTheDocument();
    const phoneNumber = result?.getByText(defaultPhone!.value);
    expect(phoneNumber).toBeInTheDocument();
    const email = result?.getByText(defaultEmail!.value);
    expect(email).toBeInTheDocument();
    const buttons = result?.getAllByRole('button');
    expect(buttons![0]).toBeEnabled();
    expect(buttons![1]).toBeEnabled();
    expect(buttons![0].textContent).toMatch('button.modifica');
    expect(buttons![1].textContent).toMatch('button.elimina');
    expect(buttons![2]).toBeEnabled();
    expect(buttons![3]).toBeEnabled();
    expect(buttons![2].textContent).toMatch('button.modifica');
    expect(buttons![3].textContent).toMatch('button.elimina');
  });

  it('add new phone number', async () => {
    const phoneValue = '3333333333';
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: '+39' + phoneValue,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: '+39' + phoneValue,
        verificationCode: '01234',
      })
      .reply(204);
    const result = render(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContacts contacts={[]} />
      </DigitalContactsCodeVerificationProvider>
    );
    const input = result.container.querySelector(`[name="${CourtesyFieldType.PHONE}"]`);
    expect(input).toHaveValue('');
    fireEvent.change(input!, { target: { value: phoneValue } });
    await waitFor(() => expect(input!).toHaveValue(phoneValue));
    const button = result.getByTestId('courtesy-phone-button');
    expect(button).toBeEnabled();
    // save the phone
    fireEvent.click(button);

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
    expect(
      testStore
        .getState()
        .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.COURTESY)
    ).toStrictEqual([
      {
        ...defaultPhoneAddress,
        senderName: undefined,
        value: '+39' + phoneValue,
      },
    ]);
    // simulate rerendering due to redux changes
    result.rerender(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContacts contacts={digitalCourtesyAddresses} />
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
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: phoneValue,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: phoneValue,
        verificationCode: '01234',
      })
      .reply(204);
    const result = render(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContacts contacts={digitalCourtesyAddresses} />
      </DigitalContactsCodeVerificationProvider>,
      {
        preloadedState: {
          contactsState: { digitalAddresses: [defaultPhoneAddress] },
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
    expect(
      testStore
        .getState()
        .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.COURTESY)
    ).toStrictEqual([
      {
        ...defaultPhoneAddress,
        senderName: undefined,
        value: phoneValue,
      },
    ]);
    // simulate rerendering due to redux changes
    const updatedDigitalCourtesyAddresses = [
      {
        addressType: AddressType.COURTESY,
        senderId: 'default',
        channelType: CourtesyChannelType.EMAIL,
        value: 'nome.utente@mail.it',
      },
      {
        addressType: AddressType.COURTESY,
        senderId: 'default',
        channelType: CourtesyChannelType.SMS,
        value: '3333333334',
      },
    ];
    result.rerender(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContacts contacts={updatedDigitalCourtesyAddresses} />
      </DigitalContactsCodeVerificationProvider>
    );
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
      expect(result.container).toHaveTextContent(phoneValue);
    });
  });

  it('delete phone number', async () => {
    mock.onDelete('/bff/v1/addresses/COURTESY/default/SMS').reply(204);
    const phoneValue = defaultPhoneAddress!.value;
    const result = render(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContacts contacts={digitalCourtesyAddresses} />
      </DigitalContactsCodeVerificationProvider>,
      {
        preloadedState: {
          contactsState: { digitalAddresses: [defaultPhoneAddress] },
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
    expect(
      testStore
        .getState()
        .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.COURTESY)
    ).toStrictEqual([]);
    // simulate rerendering due to redux changes
    result.rerender(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContacts contacts={[]} />
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
    mock.onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: mailValue }).reply(200, {
      result: 'CODE_VERIFICATION_REQUIRED',
    });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', {
        value: mailValue,
        verificationCode: '01234',
      })
      .reply(204);
    const result = render(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContacts contacts={[]} />
      </DigitalContactsCodeVerificationProvider>
    );
    const input = result.container.querySelector(`[name="${CourtesyFieldType.EMAIL}"]`);
    expect(input).toHaveValue('');
    fireEvent.change(input!, { target: { value: mailValue } });
    await waitFor(() => expect(input!).toHaveValue(mailValue));
    const button = result.getByRole('button');
    expect(button).toBeEnabled();
    // save the email
    fireEvent.click(button);
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
    expect(
      testStore
        .getState()
        .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.COURTESY)
    ).toStrictEqual([
      {
        ...defaultEmailAddress,
        senderName: undefined,
        value: mailValue,
      },
    ]);
    // simulate rerendering due to redux changes
    result.rerender(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContacts contacts={digitalCourtesyAddresses} />
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
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', {
        value: emailValue,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', {
        value: emailValue,
        verificationCode: '01234',
      })
      .reply(204);
    const result = render(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContacts contacts={digitalCourtesyAddresses} />
      </DigitalContactsCodeVerificationProvider>,
      {
        preloadedState: {
          contactsState: { digitalAddresses: [defaultEmailAddress] },
        },
      }
    );
    const emailForm = result.getByTestId(`courtesyContacts-${CourtesyFieldType.EMAIL}`);
    const editButton = within(emailForm).getByRole('button', { name: 'button.modifica' });
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
    expect(
      testStore
        .getState()
        .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.COURTESY)
    ).toStrictEqual([
      {
        ...defaultEmailAddress,
        senderName: undefined,
        value: emailValue,
      },
    ]);
    // simulate rerendering due to redux changes
    result.rerender(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContacts contacts={digitalCourtesyAddresses} />
      </DigitalContactsCodeVerificationProvider>
    );
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
      expect(result.container).toHaveTextContent(emailValue);
    });
  });

  it('delete email', async () => {
    mock.onDelete('/bff/v1/addresses/COURTESY/default/EMAIL').reply(204);
    const emailValue = defaultEmailAddress!.value;
    const result = render(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContacts contacts={digitalCourtesyAddresses} />
      </DigitalContactsCodeVerificationProvider>,
      {
        preloadedState: {
          contactsState: { digitalAddresses: [defaultEmailAddress] },
        },
      }
    );
    const emailText = result.getByText(emailValue);
    expect(emailText).toBeInTheDocument();
    const emailForm = result.getByTestId(`courtesyContacts-${CourtesyFieldType.EMAIL}`);
    const deleteButton = within(emailForm).getByRole('button', { name: 'button.elimina' });
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
    expect(
      testStore
        .getState()
        .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.COURTESY)
    ).toStrictEqual([]);
    // simulate rerendering due to redux changes
    result.rerender(
      <DigitalContactsCodeVerificationProvider>
        <CourtesyContacts contacts={[]} />
      </DigitalContactsCodeVerificationProvider>
    );
    await waitFor(() => {
      const input = result.container.querySelector(`[name="${CourtesyFieldType.EMAIL}"]`);
      expect(input).toBeInTheDocument();
      expect(result.container).not.toHaveTextContent(emailValue);
    });
  });
});
