import { digitalCourtesyAddresses } from '../../../__mocks__/Contacts.mock';
import {
  fireEvent,
  getByText,
  render,
  screen,
  testStore,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import { ChannelType } from '../../../models/contacts';
import CourtesyContacts from '../CourtesyContacts';

const defaultEmailAddress = digitalCourtesyAddresses.find(
  (addr) => addr.senderId === 'default' && addr.channelType === ChannelType.EMAIL
);

const defaultSmsAddress = digitalCourtesyAddresses.find(
  (addr) => addr.senderId === 'default' && addr.channelType === ChannelType.SMS
);

describe('CourtesyContacts Component', async () => {
  it('renders component - no contacts', async () => {
    const { container, getByTestId, getByRole } = render(<CourtesyContacts />);
    // check contacts
    const emailContact = getByTestId(`default_emailContact`);
    const emailInput = emailContact.querySelector(`[name="default_email"]`);
    const smsUpdateDescription = getByText(container, 'courtesy-contacts.email-sms-updates');
    const smsAddButton = getByRole('button', { name: 'courtesy-contacts.email-sms-add' });
    expect(smsUpdateDescription).toBeInTheDocument();
    expect(smsAddButton).toBeInTheDocument();
    expect(emailContact).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    fireEvent.click(smsAddButton);
    const phoneContact = getByTestId(`default_smsContact`);
    const phoneInput = phoneContact.querySelector(`[name="default_sms"]`);
    expect(phoneInput).toBeInTheDocument();
    expect(phoneInput).toHaveValue('');
    const phoneButton = await waitFor(() =>
      within(phoneContact).getByRole('button', {
        name: 'courtesy-contacts.sms-add',
      })
    );
    expect(phoneButton).toBeEnabled();
    expect(emailInput).toHaveValue('');
    const emailButton = await waitFor(() =>
      within(emailContact).getByRole('button', {
        name: 'courtesy-contacts.email-add',
      })
    );
    expect(emailButton).toBeEnabled();
  });

  it('renders components - contacts', async () => {
    const { getByText, getByTestId } = render(<CourtesyContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalCourtesyAddresses } },
    });
    const emailContact = getByTestId(`default_emailContact`);
    const emailInput = emailContact.querySelector(`[name="default_email"]`);
    expect(emailInput).not.toBeInTheDocument();
    const email = getByText(defaultEmailAddress!.value);
    expect(email).toBeInTheDocument();
    const emailButton = within(emailContact).getByRole('button');
    expect(emailButton).toBeEnabled();
    expect(emailButton.textContent).toMatch('button.modifica');
    const emailDisableBtn = getByTestId('disable-email');
    expect(emailDisableBtn).toBeInTheDocument();
    expect(emailDisableBtn).toHaveTextContent('disable');

    const phoneContact = getByTestId(`default_smsContact`);
    const phoneInput = phoneContact.querySelector(`[name="default_sms"]`);
    expect(phoneInput).not.toBeInTheDocument();
    const phoneNumber = getByText(defaultSmsAddress!.value);
    expect(phoneNumber).toBeInTheDocument();
    const phoneButton = within(phoneContact).getByRole('button');
    expect(phoneButton).toBeEnabled();
    expect(phoneButton.textContent).toMatch('button.modifica');
    const smsDisableBtn = getByTestId('disable-sms');
    expect(smsDisableBtn).toBeInTheDocument();
    expect(smsDisableBtn).toHaveTextContent('disable');
  });

  it('renders component - Email enabled', async () => {
    // render component
    const { getByText, getByTestId } = render(<CourtesyContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalCourtesyAddresses } },
    });
    const emailContact = getByTestId(`default_emailContact`);
    expect(emailContact).toBeInTheDocument();
    const emailInput = emailContact.querySelector(`[name="default_email"]`);
    expect(emailInput).not.toBeInTheDocument();
    const email = getByText(defaultEmailAddress!.value);
    expect(email).toBeInTheDocument();
    const emailButton = within(emailContact).getByRole('button');
    expect(emailButton).toBeEnabled();
    expect(emailButton.textContent).toMatch('button.modifica');

    const disableBtn = getByTestId('disable-email');
    expect(disableBtn).toBeInTheDocument();
    expect(disableBtn).toHaveTextContent('disable');

    // verify email could not be disabled
    fireEvent.click(disableBtn);
    const dialog = await waitFor(() => screen.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();

    const dialogTitle = getByText('courtesy-contacts.block-remove-email-title');
    expect(dialogTitle).toBeInTheDocument();
    const dialogMessage = getByText('courtesy-contacts.block-remove-email-message');
    expect(dialogMessage).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: 'button.understand' });
    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });

    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(
      digitalCourtesyAddresses
    );
  });

  it('renders component - Sms enabled', async () => {
    // render component
    const { getByText, getByTestId } = render(<CourtesyContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalCourtesyAddresses } },
    });
    const smsContact = getByTestId(`default_smsContact`);
    expect(smsContact).toBeInTheDocument();
    const smsInput = smsContact.querySelector(`[name="default_sms"]`);
    expect(smsInput).not.toBeInTheDocument();
    const sms = getByText(defaultSmsAddress!.value);
    expect(sms).toBeInTheDocument();
    const smsButton = within(smsContact).getByRole('button');
    expect(smsButton).toBeEnabled();
    expect(smsButton.textContent).toMatch('button.modifica');

    const disableBtn = getByTestId('disable-sms');
    expect(disableBtn).toBeInTheDocument();
    expect(disableBtn).toHaveTextContent('disable');
    expect(disableBtn).toBeInTheDocument();

    // verify email could not be disabled
    fireEvent.click(disableBtn);
    const dialog = await waitFor(() => screen.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();

    const dialogTitle = getByText('courtesy-contacts.block-remove-sms-title');
    expect(dialogTitle).toBeInTheDocument();
    const dialogMessage = getByText('courtesy-contacts.block-remove-sms-message');
    expect(dialogMessage).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: 'button.understand' });
    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });

    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(
      digitalCourtesyAddresses
    );
  });
});
