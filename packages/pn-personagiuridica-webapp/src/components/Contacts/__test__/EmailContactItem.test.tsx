import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { getById, testAutocomplete } from '@pagopa-pn/pn-commons/src/test-utils';

import { digitalCourtesyAddresses } from '../../../__mocks__/Contacts.mock';
import { parties } from '../../../__mocks__/ExternalRegistry.mock';
import {
  fireEvent,
  render,
  screen,
  testStore,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import EmailContactItem from '../EmailContactItem';
import { fillCodeDialog } from './test-utils';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

const defaultAddress = digitalCourtesyAddresses.find(
  (addr) => addr.channelType === ChannelType.EMAIL && addr.senderId === 'default'
);

describe('testing EmailContactItem', () => {
  let mock: MockAdapter;
  const INVALID_EMAIL = 'testpagopa.it';
  const VALID_EMAIL = 'mail@valid.it';

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
    expect(container).toHaveTextContent('courtesy-contacts.email-description');
    const form = container.querySelector('form');
    const input = form!.querySelector(`[name="default_email"]`);
    // set invalid values
    fireEvent.change(input!, { target: { value: INVALID_EMAIL } });
    await waitFor(() => expect(input).toHaveValue(INVALID_EMAIL));
    const errorMessage = form!.querySelector(`#default_email-helper-text`);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('courtesy-contacts.valid-email');
    const buttons = form!.querySelectorAll('button');
    expect(buttons[0]).toBeDisabled();
    fireEvent.change(input!, { target: { value: '' } });
    await waitFor(() => expect(input!).toHaveValue(''));
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('courtesy-contacts.valid-email');
  });

  it('type in an invalid email while in "edit mode"', async () => {
    const { container, getByRole } = render(<EmailContactItem />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [defaultAddress],
        },
      },
    });
    const form = container.querySelector('form');
    const phoneValue = getById(form!, 'default_email-typography');
    expect(phoneValue).toHaveTextContent(defaultAddress?.value!);
    const editButton = getByRole('button', { name: 'button.modifica' });
    fireEvent.click(editButton);
    const input = container.querySelector(`[name="default_email"]`);
    const saveButton = getByRole('button', { name: 'button.salva' });
    expect(input).toHaveValue(defaultAddress?.value!);
    expect(saveButton).toBeEnabled();
    fireEvent.change(input!, { target: { value: INVALID_EMAIL } });
    await waitFor(() => {
      expect(input).toHaveValue(INVALID_EMAIL);
    });
    expect(saveButton).toBeDisabled();
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
    const deleteButton = getById(form!, 'cancelContact-default_email');
    expect(deleteButton).toBeInTheDocument();
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
      preloadedState: {
        contactsState: {
          digitalAddresses: [defaultAddress],
        },
      },
    });
    // edit value
    const form = result.container.querySelector('form');
    let mailValue = getById(form!, 'default_email-typography');
    expect(mailValue).toHaveTextContent(defaultAddress!.value);
    let editButton = result.getByRole('button', { name: 'button.modifica' });
    fireEvent.click(editButton);
    const input = result.container.querySelector(`[name="default_email"]`);
    const saveButton = result.getByRole('button', { name: 'button.salva' });
    expect(input).toHaveValue(defaultAddress!.value);
    expect(saveButton).toBeEnabled();
    fireEvent.change(input!, { target: { value: emailValue } });
    await waitFor(() => expect(input!).toHaveValue(emailValue));
    // confirm new value
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
    const deleteButton = getById(form!, 'cancelContact-default_email');
    expect(deleteButton).toBeInTheDocument();
  });

  it('delete email', async () => {
    mock.onDelete('/bff/v1/addresses/COURTESY/default/EMAIL').reply(204);
    const result = render(<EmailContactItem />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [defaultAddress],
        },
      },
    });
    const buttons = result.container.querySelectorAll('button');
    // click on cancel
    fireEvent.click(buttons[1]);
    let dialog = await waitFor(() => screen.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();
    let dialogButtons = dialog.querySelectorAll('button');
    // cancel remove operation
    fireEvent.click(dialogButtons[0]);
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    // click on confirm
    fireEvent.click(buttons[1]);
    dialog = await waitFor(() => screen.getByRole('dialog'));
    dialogButtons = dialog.querySelectorAll('button');
    fireEvent.click(dialogButtons[1]);
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

  it('add special contact', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    mock
      .onPost(`/bff/v1/addresses/COURTESY/${parties[1].id}/EMAIL`, {
        value: VALID_EMAIL,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
    mock
      .onPost(`/bff/v1/addresses/COURTESY/${parties[1].id}/EMAIL`, {
        value: VALID_EMAIL,
        verificationCode: '01234',
      })
      .reply(204);
    // render component
    const result = render(<EmailContactItem />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [defaultAddress],
        },
      },
    });
    const specialPecContact = result.getByTestId('special_emailContact');
    expect(specialPecContact).toBeInTheDocument();
    const button = within(specialPecContact).getByTestId('addMoreButton');
    fireEvent.click(button);
    const addSpecialContactDialog = await waitFor(() =>
      result.getByTestId('addSpecialContactDialog')
    );
    expect(addSpecialContactDialog).toBeInTheDocument();
    // fill input
    const input = getById(addSpecialContactDialog, 's_value');
    fireEvent.change(input, { target: { value: VALID_EMAIL } });
    await waitFor(() => {
      expect(input).toHaveValue(VALID_EMAIL);
    });
    // select sender
    await testAutocomplete(addSpecialContactDialog, 'sender', parties, true, 1, true);
    // confirm addition
    const confirmButton = within(addSpecialContactDialog).getByText('button.conferma');
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: VALID_EMAIL,
      });
    });
    // inser otp and confirm
    const dialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: VALID_EMAIL,
        verificationCode: '01234',
      });
    });
    // check that contact has been added
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual([
      defaultAddress,
      {
        value: VALID_EMAIL,
        addressType: AddressType.COURTESY,
        channelType: ChannelType.EMAIL,
        senderName: parties[1].name,
        senderId: parties[1].id,
      },
    ]);
    // wait rerendering due to redux changes
    const specialContactForms = await waitFor(() => result.getAllByTestId(`special_email`));
    expect(specialContactForms).toHaveLength(1);
    expect(specialContactForms[0]).toHaveTextContent(VALID_EMAIL);
    const editButton = within(specialContactForms[0]).getByTestId(`modifyContact-special_email`);
    expect(editButton).toBeInTheDocument();
    const deleteButton = within(specialContactForms[0]).getByTestId(`cancelContact-special_email`);
    expect(deleteButton).toBeInTheDocument();
    expect(specialContactForms[0]).toHaveTextContent(parties[1].name);
  });

  it('edit special contact', async () => {
    const VALID_MODIFIED_EMAIL = 'mail-modified@valid.it';
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    mock
      .onPost(`/bff/v1/addresses/COURTESY/${parties[1].id}/EMAIL`, {
        value: VALID_MODIFIED_EMAIL,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
    mock
      .onPost(`/bff/v1/addresses/COURTESY/${parties[1].id}/EMAIL`, {
        value: VALID_MODIFIED_EMAIL,
        verificationCode: '01234',
      })
      .reply(204);
    // render component
    const result = render(<EmailContactItem />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            defaultAddress,
            {
              value: VALID_EMAIL,
              addressType: AddressType.COURTESY,
              channelType: ChannelType.EMAIL,
              senderName: parties[1].name,
              senderId: parties[1].id,
            },
          ],
        },
      },
    });
    let specialContactForms = await waitFor(() => result.getAllByTestId(`special_email`));
    expect(specialContactForms).toHaveLength(1);
    expect(specialContactForms[0]).toHaveTextContent(VALID_EMAIL);
    const editButton = within(specialContactForms[0]).getByTestId(`modifyContact-special_email`);
    fireEvent.click(editButton);
    const addSpecialContactDialog = await waitFor(() =>
      result.getByTestId('addSpecialContactDialog')
    );
    expect(addSpecialContactDialog).toBeInTheDocument();
    // fill input
    const input = getById(addSpecialContactDialog, 's_value');
    fireEvent.change(input, { target: { value: VALID_MODIFIED_EMAIL } });
    await waitFor(() => {
      expect(input).toHaveValue(VALID_MODIFIED_EMAIL);
    });
    // select sender
    await testAutocomplete(addSpecialContactDialog, 'sender', parties, true, 0, true);
    // confirm addition
    const confirmButton = within(addSpecialContactDialog).getByText('button.conferma');
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: VALID_MODIFIED_EMAIL,
      });
    });
    // inser otp and confirm
    const dialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: VALID_MODIFIED_EMAIL,
        verificationCode: '01234',
      });
    });
    // check that contact has been edited
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual([
      defaultAddress,
      {
        value: VALID_MODIFIED_EMAIL,
        addressType: AddressType.COURTESY,
        channelType: ChannelType.EMAIL,
        senderName: parties[1].name,
        senderId: parties[1].id,
      },
    ]);
    // wait rerendering due to redux changes
    specialContactForms = await waitFor(() => result.getAllByTestId(`special_email`));
    expect(specialContactForms[0]).toHaveTextContent(VALID_MODIFIED_EMAIL);
    expect(specialContactForms[0]).toHaveTextContent(parties[1].name);
  });

  it('remove special contact', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    mock.onDelete(`/bff/v1/addresses/COURTESY/${parties[1].id}/EMAIL`).reply(204);
    // render component
    const result = render(<EmailContactItem />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            defaultAddress,
            {
              value: VALID_EMAIL,
              addressType: AddressType.COURTESY,
              channelType: ChannelType.EMAIL,
              senderName: parties[1].name,
              senderId: parties[1].id,
            },
          ],
        },
      },
    });
    let specialContactForms = await waitFor(() => result.getAllByTestId(`special_email`));
    expect(specialContactForms).toHaveLength(1);
    expect(specialContactForms[0]).toHaveTextContent(VALID_EMAIL);
    const deleteButton = within(specialContactForms[0]).getByTestId(`cancelContact-special_email`);
    fireEvent.click(deleteButton);
    const dialog = await waitFor(() => screen.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();
    const buttons = dialog.querySelectorAll('button');
    // click on confirm
    fireEvent.click(buttons[1]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(mock.history.delete).toHaveLength(1);
    });
    // check that contact has been removed
    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual([defaultAddress]);
    // wait rerendering due to redux changes
    specialContactForms = await waitFor(() => result.queryAllByTestId(`special_email`));
    expect(specialContactForms).toHaveLength(0);
  });
});
