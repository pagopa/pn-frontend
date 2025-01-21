import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import {
  digitalAddresses,
  digitalAddressesPecValidation,
  digitalLegalAddresses,
  digitalLegalAddressesSercq,
} from '../../../__mocks__/Contacts.mock';
import {
  fireEvent,
  getByRole,
  queryAllByTestId,
  render,
  screen,
  testStore,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import LegalContacts from '../LegalContacts';

const defaultPecAddress = digitalLegalAddresses.find(
  (addr) => addr.senderId === 'default' && addr.pecValid && addr.channelType === ChannelType.PEC
);
const assignFn = vi.fn();

describe('LegalContacts Component', async () => {
  let mock: MockAdapter;
  const originalLocation = window.location;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { assign: assignFn },
    });
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
  });

  it('renders component - PEC enabled', async () => {
    // render component
    const { container, getByText, getByTestId } = render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddresses } },
    });

    expect(container).toHaveTextContent('legal-contacts.title');
    expect(container).toHaveTextContent('status.active');
    const pecContact = getByTestId(`default_pecContact`);
    expect(pecContact).toBeInTheDocument();
    const pecInput = pecContact.querySelector(`[name="default_pec"]`);
    expect(pecInput).not.toBeInTheDocument();
    const pec = getByText(defaultPecAddress!.value);
    expect(pec).toBeInTheDocument();
    const pecButtons = within(pecContact).getAllByRole('button');
    expect(pecButtons[0]).toBeEnabled();
    expect(pecButtons[0].textContent).toMatch('button.modifica');
    const descriptionText = getByText('legal-contacts.pec-description');
    expect(descriptionText).toBeInTheDocument();

    const manageBtn = getByRole(container, 'button', { name: 'button.manage' });
    expect(manageBtn).toBeInTheDocument();
    const disableBtn = getByRole(container, 'button', { name: 'button.disable' });
    expect(disableBtn).toBeInTheDocument();

    // verify digital domicile could not be disabled
    fireEvent.click(disableBtn);
    const dialog = await waitFor(() => screen.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();

    const dialogTitle = getByText('legal-contacts.block-remove-digital-domicile-title');
    expect(dialogTitle).toBeInTheDocument();
    const dialogMessage = getByText('legal-contacts.block-remove-digital-domicile-message');
    expect(dialogMessage).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: 'button.understand' });
    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });

    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(
      digitalLegalAddresses
    );
  });

  it('renders component - SERCQ enabled', async () => {
    const { container } = render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddressesSercq } },
    });

    expect(container).toHaveTextContent('legal-contacts.title');
    expect(container).toHaveTextContent('status.active');
    expect(container).toHaveTextContent('legal-contacts.sercq_send-title');
    expect(container).toHaveTextContent('legal-contacts.sercq_send-description');

    const manageBtn = getByRole(container, 'button', { name: 'button.manage' });
    expect(manageBtn).toBeInTheDocument();
    const disableBtn = getByRole(container, 'button', { name: 'button.disable' });
    expect(disableBtn).toBeInTheDocument();

    const defaultPecContacts = queryAllByTestId(container, `default_pecContact`);
    expect(defaultPecContacts).toHaveLength(0);
  });

  it('renders component - no contacts', async () => {
    const { container, getByRole, getByTestId } = render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: [] } },
    });

    expect(container).toHaveTextContent('legal-contacts.title');
    expect(container).toHaveTextContent('status.inactive');
    expect(container).toHaveTextContent('legal-contacts.sercq-send-info-advantages');

    const digitalNotificationsIcon = getByTestId('LaptopChromebookIcon');
    expect(digitalNotificationsIcon).toBeInTheDocument();
    const savingsIcon = getByTestId('SavingsIcon');
    expect(savingsIcon).toBeInTheDocument();
    const allInOnePlaceIcon = getByTestId('TouchAppIcon');
    expect(allInOnePlaceIcon).toBeInTheDocument();
    const startButton = getByRole('button', { name: 'button.start' });
    expect(startButton).toBeInTheDocument();
  });

  it('renders component - SERCQ enabled and validating PEC', async () => {
    const { container, getByTestId, getByText } = render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalAddressesPecValidation() } },
    });

    expect(container).toHaveTextContent('legal-contacts.title');
    expect(container).toHaveTextContent('status.pec-validation');
    // check contacts
    const pecValidationItem = getByTestId('default_pecContact');
    expect(pecValidationItem).toBeInTheDocument();
    const closeIcon = getByTestId('CloseIcon');
    expect(closeIcon).toBeInTheDocument();
    const cancelValidationButton = getByText('legal-contacts.cancel-pec-validation');
    expect(cancelValidationButton).toBeInTheDocument();
    const pecDescription = getByText('legal-contacts.pec-description');
    expect(pecDescription).toBeInTheDocument();
  });

  it('renders component - SERCQ disabled and validating PEC', async () => {
    const { container, getByTestId, getByText } = render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalAddressesPecValidation(false) } },
    });

    expect(container).toHaveTextContent('legal-contacts.title');
    expect(container).toHaveTextContent('status.pec-validation');
    // check contacts
    const pecValidationItem = getByTestId('default_pecContact');
    expect(pecValidationItem).toBeInTheDocument();
    const closeIcon = getByTestId('CloseIcon');
    expect(closeIcon).toBeInTheDocument();
    const cancelValidationButton = getByText('legal-contacts.cancel-pec-validation');
    expect(cancelValidationButton).toBeInTheDocument();
    const pecDescription = getByText('legal-contacts.pec-description');
    expect(pecDescription).toBeInTheDocument();
  });

  it('disable digital domicile', async () => {
    mock.onDelete('bff/v1/addresses/LEGAL/default/PEC').reply(200);
    const initialAddresses = digitalAddresses.filter(
      (addr) => addr.addressType !== AddressType.LEGAL || addr.senderId === 'default'
    );
    const { container, getByTestId, getByText } = render(<LegalContacts />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: initialAddresses,
        },
      },
    });

    expect(container).toHaveTextContent('legal-contacts.title');
    expect(container).toHaveTextContent('status.active');
    const pecContact = getByTestId(`default_pecContact`);
    expect(pecContact).toBeInTheDocument();
    const pecInput = pecContact.querySelector(`[name="default_pec"]`);
    expect(pecInput).not.toBeInTheDocument();
    const pec = getByText(defaultPecAddress!.value);
    expect(pec).toBeInTheDocument();
    const pecButtons = within(pecContact).getAllByRole('button');
    expect(pecButtons[0]).toBeEnabled();
    expect(pecButtons[0].textContent).toMatch('button.modifica');
    const descriptionText = getByText('legal-contacts.pec-description');
    expect(descriptionText).toBeInTheDocument();

    const manageBtn = getByRole(container, 'button', { name: 'button.manage' });
    expect(manageBtn).toBeInTheDocument();
    const disableBtn = getByRole(container, 'button', { name: 'button.disable' });
    expect(disableBtn).toBeInTheDocument();

    fireEvent.click(disableBtn);
    const dialog = await waitFor(() => screen.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();

    const dialogTitle = getByText('legal-contacts.remove-pec-title');
    expect(dialogTitle).toBeInTheDocument();
    const dialogMessage = getByText('legal-contacts.remove-pec-message');
    expect(dialogMessage).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: 'button.annulla' });
    expect(cancelBtn).toBeInTheDocument();
    const confirmBtn = screen.getByRole('button', { name: 'button.conferma' });
    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mock.history.delete).toHaveLength(1);
    });

    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual(
      initialAddresses.filter((addr) => addr.addressType !== AddressType.LEGAL)
    );
  });
});
