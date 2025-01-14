import { digitalCourtesyAddresses } from '../../../__mocks__/Contacts.mock';
import { fireEvent, getByText, render, waitFor, within } from '../../../__test__/test-utils';
import { ChannelType } from '../../../models/contacts';
import CourtesyContacts from '../CourtesyContacts';

describe('CourtesyContacts Component', async () => {
  it('renders component - no contacts', async () => {
    const { container, getByTestId, getByRole } = render(<CourtesyContacts />);
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

  it('renders components - contacts', () => {
    const { getByText, getByTestId } = render(<CourtesyContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalCourtesyAddresses } },
    });
    const defaultPhone = digitalCourtesyAddresses.find(
      (addr) => addr.channelType === ChannelType.SMS && addr.senderId === 'default'
    );
    const defaultEmail = digitalCourtesyAddresses.find(
      (addr) => addr.channelType === ChannelType.EMAIL && addr.senderId === 'default'
    );
    const emailContact = getByTestId(`default_emailContact`);
    const emailInput = emailContact.querySelector(`[name="default_email"]`);
    expect(emailInput).not.toBeInTheDocument();
    const email = getByText(defaultEmail!.value);
    expect(email).toBeInTheDocument();
    const emailButtons = within(emailContact).getAllByRole('button');
    expect(emailButtons).toHaveLength(1);
    expect(emailButtons[0]).toBeEnabled();
    expect(emailButtons[0].textContent).toMatch('button.modifica');
    const emailDisableBtn = getByTestId('disable-email');
    expect(emailDisableBtn).toBeInTheDocument();
    expect(emailDisableBtn).toHaveTextContent('disable');

    const phoneContact = getByTestId(`default_smsContact`);
    const phoneInput = phoneContact.querySelector(`[name="default_sms"]`);
    expect(phoneInput).not.toBeInTheDocument();
    const phoneNumber = getByText(defaultPhone!.value);
    expect(phoneNumber).toBeInTheDocument();
    const phoneButtons = within(phoneContact).getAllByRole('button');
    expect(phoneButtons).toHaveLength(1);
    expect(phoneButtons[0]).toBeEnabled();
    expect(phoneButtons[0].textContent).toMatch('button.modifica');
    const smsDisableBtn = getByTestId('disable-sms');
    expect(smsDisableBtn).toBeInTheDocument();
    expect(smsDisableBtn).toHaveTextContent('disable');
  });
});
