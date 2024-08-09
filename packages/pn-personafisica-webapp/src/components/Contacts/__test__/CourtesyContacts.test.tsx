import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { digitalCourtesyAddresses } from '../../../__mocks__/Contacts.mock';
import { render } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { ChannelType } from '../../../models/contacts';
import CourtesyContacts from '../CourtesyContacts';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('CourtesyContacts Component', async () => {
  let mock: MockAdapter;
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
    const { container, getByText, getByRole, getByTestId } = render(
      <CourtesyContacts contacts={[]} />
    );
    const avatar = getByText('Email');
    expect(avatar).toBeInTheDocument();
    const title = getByRole('heading');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('courtesy-contacts.subtitle');
    const body = getByTestId('DigitalContactsCardBody');
    expect(body).toHaveTextContent('courtesy-contacts.title');
    expect(body).toHaveTextContent('courtesy-contacts.description');
    const disclaimer = getByTestId('contacts disclaimer');
    expect(disclaimer).toBeInTheDocument();
    // check inputs
    const phoneInput = container.querySelector(`[name="sms"]`);
    const emailInput = container.querySelector(`[name="email"]`);
    expect(phoneInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
  });

  it('renders components - contacts', async () => {
    const { container, getByText, getAllByRole } = render(
      <CourtesyContacts contacts={digitalCourtesyAddresses} />
    );
    const defaultPhone = digitalCourtesyAddresses.find(
      (addr) => addr.channelType === ChannelType.SMS && addr.senderId === 'default'
    );
    const defaultEmail = digitalCourtesyAddresses.find(
      (addr) => addr.channelType === ChannelType.EMAIL && addr.senderId === 'default'
    );
    const phoneInput = container.querySelector(`[name="sms"]`);
    const emailInput = container.querySelector(`[name="email"]`);
    expect(phoneInput).not.toBeInTheDocument();
    expect(emailInput).not.toBeInTheDocument();
    const phoneNumber = getByText(defaultPhone!.value);
    expect(phoneNumber).toBeInTheDocument();
    const email = getByText(defaultEmail!.value);
    expect(email).toBeInTheDocument();
    const buttons = getAllByRole('button');
    expect(buttons[0]).toBeEnabled();
    expect(buttons[1]).toBeEnabled();
    expect(buttons[0].textContent).toMatch('button.modifica');
    expect(buttons[1].textContent).toMatch('button.elimina');
    expect(buttons[2]).toBeEnabled();
    expect(buttons[3]).toBeEnabled();
    expect(buttons[2].textContent).toMatch('button.modifica');
    expect(buttons[3].textContent).toMatch('button.elimina');
  });
});
