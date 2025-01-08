import {
  digitalAddressesPecValidation,
  digitalLegalAddresses,
  digitalLegalAddressesSercq,
} from '../../../__mocks__/Contacts.mock';
import { getByRole, queryAllByTestId, render, within } from '../../../__test__/test-utils';
import LegalContacts from '../LegalContacts';

const defaultPecAddress = digitalLegalAddresses.find(
  (addr) => addr.senderId === 'default' && addr.pecValid
);

describe('LegalContacts Component', async () => {
  it('renders component - PEC enabled', () => {
    // render component
    const { container, getByText } = render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddresses } },
    });

    expect(container).toHaveTextContent('legal-contacts.title');
    expect(container).toHaveTextContent('status.active');
    const pecContact = queryAllByTestId(container, `default_pecContact`)[0];
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

    const manageBtn = getByRole(container, 'button', { name: 'manage' });
    expect(manageBtn).toBeInTheDocument();
    const disableBtn = getByRole(container, 'button', { name: 'disable' });
    expect(disableBtn).toBeInTheDocument();
  });

  it('renders component - SERCQ enabled', async () => {
    const { container } = render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddressesSercq } },
    });

    expect(container).toHaveTextContent('legal-contacts.title');
    expect(container).toHaveTextContent('status.active');
    expect(container).toHaveTextContent('legal-contacts.sercq-send-title');
    expect(container).toHaveTextContent('legal-contacts.sercq-send-description');

    const manageBtn = getByRole(container, 'button', { name: 'manage' });
    expect(manageBtn).toBeInTheDocument();
    const disableBtn = getByRole(container, 'button', { name: 'disable' });
    expect(disableBtn).toBeInTheDocument();

    const defaultPecContacts = queryAllByTestId(container, `default_pecContact`);
    expect(defaultPecContacts).toHaveLength(0);
  });

  it('renders component - no contacts', async () => {
    const { container, getByRole } = render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: [] } },
    });

    expect(container).toHaveTextContent('legal-contacts.title');
    expect(container).toHaveTextContent('status.inactive');
    expect(container).toHaveTextContent('legal-contacts.sercq-send-info-advantages');

    // TODO: find a way to access sercq-send-info-list translations to test the EmptyLegalContacts content
    const startButton = getByRole('button', { name: 'legal-contacts.sercq-send-start' });
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

    // TODO: add banner check during the rework of the specific feature
    // const banner = within(container).getByTestId('PecVerificationAlert');
    // expect(banner).toBeInTheDocument();
    // const alertIcon = within(banner).getByTestId('InfoOutlinedIcon');
    // expect(alertIcon).toBeInTheDocument();
    // expect(banner).toHaveTextContent('legal-contacts.pec-validation-banner.title');
    // expect(banner).toHaveTextContent('legal-contacts.pec-validation-banner.dod-enabled-message');
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
});
