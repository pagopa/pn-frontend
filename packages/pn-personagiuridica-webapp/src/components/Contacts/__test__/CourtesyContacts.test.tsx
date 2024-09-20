import { vi } from 'vitest';

import { digitalCourtesyAddresses } from '../../../__mocks__/Contacts.mock';
import { render, waitFor, within } from '../../../__test__/test-utils';
import { ChannelType } from '../../../models/contacts';
import CourtesyContacts from '../CourtesyContacts';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string, options?: { returnObjects: boolean }) =>
      options?.returnObjects ? [str] : str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('CourtesyContacts Component', async () => {
  it('renders component - no contacts', async () => {
    const { container, getByTestId } = render(<CourtesyContacts />);
    expect(container).toHaveTextContent('courtesy-contacts.title');
    expect(container).toHaveTextContent('courtesy-contacts.sub-title');
    // check contacts
    const phoneContact = getByTestId(`default_smsContact`);
    const phoneInput = phoneContact.querySelector(`[name="default_sms"]`);
    const emailContact = getByTestId(`default_emailContact`);
    const emailInput = emailContact.querySelector(`[name="default_email"]`);
    expect(phoneContact).toBeInTheDocument();
    expect(emailContact).toBeInTheDocument();
    expect(phoneInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(phoneInput).toHaveValue('');
    const phoneButton = await waitFor(() =>
      within(phoneContact).getByRole('button', {
        name: 'courtesy-contacts.sms-add',
      })
    );
    expect(phoneButton).toBeDisabled();
    expect(emailInput).toHaveValue('');
    const emaileButton = await waitFor(() =>
      within(emailContact).getByRole('button', {
        name: 'courtesy-contacts.email-add',
      })
    );
    expect(emaileButton).toBeDisabled();
  });

  it('renders components - contacts', async () => {
    const { getByText, getByTestId } = render(<CourtesyContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalCourtesyAddresses } },
    });
    const defaultPhone = digitalCourtesyAddresses.find(
      (addr) => addr.channelType === ChannelType.SMS && addr.senderId === 'default'
    );
    const defaultEmail = digitalCourtesyAddresses.find(
      (addr) => addr.channelType === ChannelType.EMAIL && addr.senderId === 'default'
    );
    const phoneContact = getByTestId(`default_smsContact`);
    const phoneInput = phoneContact.querySelector(`[name="default_sms"]`);
    const emailContact = getByTestId(`default_emailContact`);
    const emailInput = emailContact.querySelector(`[name="default_email"]`);
    expect(phoneInput).not.toBeInTheDocument();
    expect(emailInput).not.toBeInTheDocument();
    const phoneNumber = getByText(defaultPhone!.value);
    expect(phoneNumber).toBeInTheDocument();
    const email = getByText(defaultEmail!.value);
    expect(email).toBeInTheDocument();
    const emailButtons = within(emailContact).getAllByRole('button');
    expect(emailButtons[0]).toBeEnabled();
    expect(emailButtons[1]).toBeEnabled();
    expect(emailButtons[0].textContent).toMatch('button.modifica');
    expect(emailButtons[1].textContent).toMatch('button.elimina');
    const phoneButtons = within(phoneContact).getAllByRole('button');
    expect(phoneButtons[0]).toBeEnabled();
    expect(phoneButtons[1]).toBeEnabled();
    expect(phoneButtons[0].textContent).toMatch('button.modifica');
    expect(phoneButtons[1].textContent).toMatch('button.elimina');
  });
});
