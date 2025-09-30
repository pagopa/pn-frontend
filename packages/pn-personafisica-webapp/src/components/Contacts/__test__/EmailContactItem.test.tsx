import MockAdapter from 'axios-mock-adapter';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { digitalAddressesSercq, digitalCourtesyAddresses } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, testStore, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import EmailContactItem from '../EmailContactItem';
import { fillCodeDialog } from './test-utils';

const defaultAddress = digitalCourtesyAddresses.find(
  (addr) => addr.channelType === ChannelType.EMAIL && addr.senderId === 'default'
);

describe('testing EmailContactItem', () => {
  let mock: MockAdapter;
  const INVALID_EMAIL = 'testpagopa.it';

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('type in an invalid email', async () => {
    // render component
    const { container } = render(<EmailContactItem />);
    expect(container).toHaveTextContent('courtesy-contacts.email-title');
    expect(container).toHaveTextContent('status.inactive');
    expect(container).toHaveTextContent('courtesy-contacts.email-empty-description');
    expect(container).toHaveTextContent('courtesy-contacts.email-sms-updates');
    expect(container).toHaveTextContent('courtesy-contacts.email-sms-add');
    const form = container.querySelector('form');
    const input = form!.querySelector(`[name="default_email"]`);
    // set invalid values
    fireEvent.change(input!, { target: { value: INVALID_EMAIL } });
    await waitFor(() => expect(input).toHaveValue(INVALID_EMAIL));
    const errorMessage = form!.querySelector(`#default_email-helper-text`);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('courtesy-contacts.valid-email');
    const buttons = form!.querySelectorAll('button');
    expect(buttons[0]).toBeEnabled();
    fireEvent.change(input!, { target: { value: '' } });
    await waitFor(() => expect(input!).toHaveValue(''));
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('courtesy-contacts.valid-email');
  });

  it('type in an invalid email while in "edit mode"', async () => {
    const { container, getByRole } = render(<EmailContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: [defaultAddress] } },
    });
    const form = container.querySelector('form');
    const phoneValue = getById(form!, 'default_email-typography');
    expect(phoneValue).toHaveTextContent(defaultAddress?.value!);
    const editButton = getByRole('button', { name: 'button.modifica' });
    fireEvent.click(editButton);
    const input = container.querySelector(`[name="default_email"]`);
    const saveButton = getByRole('button', { name: 'button.conferma' });
    expect(input).toHaveValue(defaultAddress?.value);
    expect(saveButton).toBeEnabled();
    fireEvent.change(input!, { target: { value: INVALID_EMAIL } });
    await waitFor(() => {
      expect(input).toHaveValue(INVALID_EMAIL);
    });
    expect(saveButton).toBeEnabled();
    const inputError = container.querySelector(`#default_email-helper-text`);
    expect(inputError).toHaveTextContent('courtesy-contacts.valid-email');
  });

  it('add new email', async () => {
    const mailValue = 'nome.utente@mail.it';
    mock.onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: mailValue }).reply(200, {
      result: 'CODE_VERIFICATION_REQUIRED',
    });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', {
        value: mailValue,
        verificationCode: '01234',
      })
      .reply(204);
    const result = render(<EmailContactItem />);
    // insert new email
    const form = result.container.querySelector('form');
    const input = form!.querySelector(`[name="default_email"]`);
    fireEvent.change(input!, { target: { value: mailValue } });
    await waitFor(() => expect(input!).toHaveValue(mailValue));
    const errorMessage = form?.querySelector('#default_email-helper-text');
    expect(errorMessage).not.toBeInTheDocument();
    const button = result.getByTestId('default_email-button');
    expect(button).toBeEnabled();
    fireEvent.click(button);
    // Confirms the informative dialog
    const informativeDialog = await waitFor(() => result.getByTestId('informativeDialog'));
    expect(informativeDialog).toBeInTheDocument();
    const understandButton = result.getByTestId('understandButton');
    expect(understandButton).toBeInTheDocument();
    fireEvent.click(understandButton);
    await waitFor(() => {
      expect(informativeDialog).not.toBeVisible();
    });
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: mailValue,
      });
    });
    // inser otp and confirm
    const dialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: mailValue,
        verificationCode: '01234',
      });
    });
    // check that contact has been added
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    expect(
      testStore
        .getState()
        .contactsState.digitalAddresses.filter(
          (addr) => addr.addressType === AddressType.COURTESY && addr.senderId === 'default'
        )
    ).toStrictEqual([
      {
        ...defaultAddress,
        senderName: undefined,
        value: mailValue,
      },
    ]);
    // wait rerendering due to redux changes
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
    const emailValue = getById(form!, 'default_email-typography');
    expect(emailValue).toBeInTheDocument();
    expect(emailValue).toHaveTextContent(mailValue);
    const editButton = getById(form!, 'modifyContact-default_email');
    expect(editButton).toBeInTheDocument();
    const disableBtn = result.getByRole('button', { name: 'button.disable' });
    expect(disableBtn).toBeInTheDocument();
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
    // render component
    const result = render(<EmailContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: [defaultAddress] } },
    });
    // edit value
    const form = result.container.querySelector('form');
    let mailValue = getById(form!, 'default_email-typography');
    expect(mailValue).toHaveTextContent(defaultAddress!.value);
    let editButton = result.getByRole('button', { name: 'button.modifica' });
    fireEvent.click(editButton);
    const input = result.container.querySelector(`[name="default_email"]`);
    const saveButton = result.getByRole('button', { name: 'button.conferma' });
    expect(input).toHaveValue(defaultAddress!.value);
    expect(saveButton).toBeEnabled();
    fireEvent.change(input!, { target: { value: emailValue } });
    await waitFor(() => expect(input!).toHaveValue(emailValue));
    // confirm new value
    fireEvent.click(saveButton);
    // Confirms the informative dialog
    const informativeDialog = await waitFor(() => result.getByTestId('informativeDialog'));
    expect(informativeDialog).toBeInTheDocument();
    const understandButton = result.getByTestId('understandButton');
    expect(understandButton).toBeInTheDocument();
    fireEvent.click(understandButton);
    await waitFor(() => {
      expect(informativeDialog).not.toBeVisible();
    });
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: emailValue,
      });
    });
    // inser otp and confirm
    const dialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: emailValue,
        verificationCode: '01234',
      });
    });
    // check that contact has been added
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    expect(
      testStore
        .getState()
        .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.COURTESY)
    ).toStrictEqual([
      {
        ...defaultAddress,
        senderName: undefined,
        value: emailValue,
      },
    ]);
    // wait rerendering due to redux changes
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
    mailValue = getById(form!, 'default_email-typography');
    expect(mailValue).toBeInTheDocument();
    expect(mailValue).toHaveTextContent(emailValue);
    editButton = getById(form!, 'modifyContact-default_email');
    expect(editButton).toBeInTheDocument();
    const disableBtn = result.getByRole('button', { name: 'button.disable' });
    expect(disableBtn).toBeInTheDocument();
  });

  it('delete email - SERCQ disabled', async () => {
    mock.onDelete('/bff/v1/addresses/COURTESY/default/EMAIL').reply(204);
    const result = render(<EmailContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: [defaultAddress] } },
    });

    const disableBtn = result.getByRole('button', { name: 'button.disable' });
    expect(disableBtn).toBeInTheDocument();
    // click on cancel
    fireEvent.click(disableBtn);
    let dialog = await waitFor(() => result.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();

    // verify dialog copy and buttons
    expect(dialog).toHaveTextContent('courtesy-contacts.remove-email');
    expect(dialog).toHaveTextContent('courtesy-contacts.remove-email-message');
    const cancelBtn = result.getByRole('button', { name: 'button.annulla' });
    const confirmBtn = result.getByRole('button', { name: 'button.conferma' });
    expect(cancelBtn).toBeInTheDocument();
    expect(confirmBtn).toBeInTheDocument();

    // cancel remove operation
    fireEvent.click(cancelBtn);
    await waitFor(() => expect(dialog).not.toBeInTheDocument());

    // click on confirm
    fireEvent.click(disableBtn);
    dialog = await waitFor(() => result.getByRole('dialog'));
    fireEvent.click(result.getByRole('button', { name: 'button.conferma' }));

    await waitFor(() => {
      expect(dialog).not.toBeVisible();
    });
    await waitFor(() => {
      expect(mock.history.delete).toHaveLength(1);
    });
    await waitFor(() => {
      expect(
        testStore
          .getState()
          .contactsState.digitalAddresses.filter(
            (addr) => addr.addressType === AddressType.COURTESY
          )
      ).toStrictEqual([]);
    });

    // wait rerendering due to redux changes
    await waitFor(() => {
      const input = result.container.querySelector(`[name="default_email"]`);
      expect(input).toBeInTheDocument();
      expect(result.container).not.toHaveTextContent('');
    });
  });

  it('delete email - SERCQ enabled as default', async () => {
    const sercqEnabledNoSpecials = digitalAddressesSercq.filter(
      (addr) =>
        !(
          addr.addressType === AddressType.COURTESY &&
          addr.channelType === ChannelType.EMAIL &&
          addr.senderId !== 'default'
        )
    );

    const result = render(<EmailContactItem />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: sercqEnabledNoSpecials,
        },
      },
    });

    const disableBtn = result.getByRole('button', { name: 'button.disable' });
    expect(disableBtn).toBeInTheDocument();
    fireEvent.click(disableBtn);

    const dialog = await waitFor(() => result.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();

    expect(dialog).toHaveTextContent('courtesy-contacts.remove-email-title-dod-enabled');
    expect(dialog).toHaveTextContent('courtesy-contacts.remove-email-message-dod-enabled');

    const dialogButtons = dialog.querySelectorAll('button');
    expect(dialogButtons.length).toBe(1);
    expect(dialogButtons[0]).toHaveTextContent('button.understand');

    fireEvent.click(dialogButtons[0]);

    // delete API should not be called
    await waitFor(() => {
      expect(mock.history.delete).toHaveLength(0);
    });

    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    const form = result.container.querySelector('form')!;
    const emailTypography = getById(form, 'default_email-typography');
    expect(emailTypography).toBeInTheDocument();
    expect(emailTypography.textContent).toBeTruthy();
  });

  it('delete email - SERCQ enabled as special contact', async () => {
    const sercqEnabledNoSpecialEmails = digitalAddressesSercq.filter(
      (addr) =>
        !(
          addr.addressType === AddressType.COURTESY &&
          addr.channelType === ChannelType.EMAIL &&
          addr.senderId !== 'default'
        )
    );

    const sercqOnSpecial = sercqEnabledNoSpecialEmails.map((addr) =>
      addr.channelType === ChannelType.SERCQ_SEND
        ? {
            ...addr,
            senderId: 'tribunale-milano',
            senderName: 'Tribunale di Milano',
          }
        : addr
    );

    const result = render(<EmailContactItem />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [defaultAddress, ...sercqOnSpecial],
        },
      },
    });

    const disableBtn = result.getByRole('button', { name: 'button.disable' });
    expect(disableBtn).toBeInTheDocument();
    fireEvent.click(disableBtn);

    const dialog = await waitFor(() => result.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();

    expect(dialog).toHaveTextContent('courtesy-contacts.remove-email-title-dod-enabled');
    expect(dialog).toHaveTextContent('courtesy-contacts.remove-email-message-dod-enabled');

    const dialogButtons = dialog.querySelectorAll('button');
    expect(dialogButtons.length).toBe(1);
    expect(dialogButtons[0]).toHaveTextContent('button.understand');

    fireEvent.click(dialogButtons[0]);

    // delete API should not be called
    await waitFor(() => {
      expect(mock.history.delete).toHaveLength(0);
    });

    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    const form = result.container.querySelector('form')!;
    const emailTypography = getById(form, 'default_email-typography');
    expect(emailTypography).toBeInTheDocument();
    expect(emailTypography.textContent).toBeTruthy();
  });

  it('delete email - special email address set', async () => {
    const result = render(<EmailContactItem />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: digitalCourtesyAddresses,
        },
      },
    });

    const disableBtn = result.getByRole('button', { name: 'button.disable' });
    expect(disableBtn).toBeInTheDocument();
    fireEvent.click(disableBtn);

    const dialog = await waitFor(() => result.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();

    expect(dialog).toHaveTextContent('courtesy-contacts.block-remove-email-title');
    expect(dialog).toHaveTextContent('courtesy-contacts.block-remove-email-message');

    const dialogButtons = dialog.querySelectorAll('button');
    expect(dialogButtons.length).toBe(1);
    expect(dialogButtons[0]).toHaveTextContent('button.understand');

    fireEvent.click(dialogButtons[0]);

    // delete API should not be called
    await waitFor(() => {
      expect(mock.history.delete).toHaveLength(0);
    });

    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    const form = result.container.querySelector('form')!;
    const emailTypography = getById(form, 'default_email-typography');
    expect(emailTypography).toBeInTheDocument();
    expect(emailTypography.textContent).toBeTruthy();
  });

  it('show special contact section - without default sms address', () => {
    const { getAllByTestId } = render(<EmailContactItem />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: digitalCourtesyAddresses.filter(
            (addr) =>
              addr.channelType !== ChannelType.SMS ||
              (addr.channelType === ChannelType.SMS && addr.senderId !== 'default')
          ),
        },
      },
    });
    const specialEmailContactForms = getAllByTestId(/^[a-zA-Z0-9-]+_emailSpecialContact$/);
    expect(specialEmailContactForms).toHaveLength(
      digitalCourtesyAddresses.filter(
        (addr) => addr.channelType === ChannelType.EMAIL && addr.senderId !== 'default'
      ).length
    );
    const specialSmsContactForms = getAllByTestId(/^[a-zA-Z0-9-]+_smsSpecialContact$/);
    expect(specialSmsContactForms).toHaveLength(
      digitalCourtesyAddresses.filter(
        (addr) => addr.channelType === ChannelType.SMS && addr.senderId !== 'default'
      ).length
    );
  });

  it('show special contact section - with default sms address', () => {
    const { getAllByTestId, queryAllByTestId } = render(<EmailContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: digitalCourtesyAddresses } },
    });
    const specialEmailContactForms = getAllByTestId(/^[a-zA-Z0-9-]+_emailSpecialContact$/);
    expect(specialEmailContactForms).toHaveLength(
      digitalCourtesyAddresses.filter(
        (addr) => addr.channelType === ChannelType.EMAIL && addr.senderId !== 'default'
      ).length
    );
    const specialSmsContactForms = queryAllByTestId(/^[a-zA-Z0-9-]+_smsSpecialContact$/);
    expect(specialSmsContactForms).toHaveLength(0);
  });
});
