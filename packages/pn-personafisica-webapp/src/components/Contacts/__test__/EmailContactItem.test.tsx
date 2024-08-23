import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { digitalCourtesyAddresses } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, screen, testStore, waitFor } from '../../../__test__/test-utils';
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

const defaultEmailAddress = digitalCourtesyAddresses.find(
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
      preloadedState: { contactsState: { digitalAddresses: [defaultEmailAddress] } },
    });
    const form = container.querySelector('form');
    const phoneValue = getById(form!, 'default_email-typography');
    expect(phoneValue).toHaveTextContent(defaultEmailAddress?.value!);
    const editButton = getByRole('button', { name: 'button.modifica' });
    fireEvent.click(editButton);
    const input = container.querySelector(`[name="default_email"]`);
    const saveButton = getByRole('button', { name: 'button.salva' });
    expect(input).toHaveValue(defaultEmailAddress?.value!);
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
        ...defaultEmailAddress,
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
    const editButton = getById(form!, 'modifyContact-default');
    expect(editButton).toBeInTheDocument();
    const deleteButton = getById(form!, 'cancelContact-default');
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
      preloadedState: { contactsState: { digitalAddresses: [defaultEmailAddress] } },
    });
    // edit value
    const form = result.container.querySelector('form');
    let mailValue = getById(form!, 'default_email-typography');
    expect(mailValue).toHaveTextContent(defaultEmailAddress!.value);
    let editButton = result.getByRole('button', { name: 'button.modifica' });
    fireEvent.click(editButton);
    const input = result.container.querySelector(`[name="default_email"]`);
    const saveButton = result.getByRole('button', { name: 'button.salva' });
    expect(input).toHaveValue(defaultEmailAddress!.value);
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
        ...defaultEmailAddress,
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
    editButton = getById(form!, 'modifyContact-default');
    expect(editButton).toBeInTheDocument();
    const deleteButton = getById(form!, 'cancelContact-default');
    expect(deleteButton).toBeInTheDocument();
  });

  it('delete email', async () => {
    mock.onDelete('/bff/v1/addresses/COURTESY/default/EMAIL').reply(204);
    const result = render(<EmailContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: [defaultEmailAddress] } },
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
});
