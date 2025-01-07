import {
  digitalAddressesPecValidation,
  digitalLegalAddresses,
  digitalLegalAddressesSercq,
} from '../../../__mocks__/Contacts.mock';
import { queryAllByTestId, render, screen, within } from '../../../__test__/test-utils';
import { ChannelType } from '../../../models/contacts';
import LegalContacts from '../LegalContacts';

const defaultPecAddress = digitalLegalAddresses.find(
  (addr) => addr.senderId === 'default' && addr.pecValid && addr.channelType === ChannelType.PEC
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
    // TODO check that actions are in the document
  });

  it('renders component - SERCQ enabled', async () => {
    // const { container, getByTestId, queryByTestId } = render(<LegalContacts />, {
    const { container } = render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddressesSercq } },
    });

    screen.debug();
    expect(container).toHaveTextContent('legal-contacts.title');
    expect(container).toHaveTextContent('status.active');
    expect(container).toHaveTextContent('legal-contacts.sercq-send-title');
    expect(container).toHaveTextContent('legal-contacts.sercq-send-description');
    // TODO check that actions are in the document

    // TODO Temporary fix
    // expect(pecContact).toBeInTheDocument();
    // Should add .not.toBeInTheDocument() when the LegalContacts component is reworked
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
    expect(container).toHaveTextContent('legal-contacts.sub-title');
    // check contacts
    const pecValidationItem = getByTestId('default_pecContact');
    expect(pecValidationItem).toBeInTheDocument();
    const closeIcon = getByTestId('CloseIcon');
    expect(closeIcon).toBeInTheDocument();
    const cancelValidationButton = getByText('legal-contacts.cancel-pec-validation');
    expect(cancelValidationButton).toBeInTheDocument();

    const sercqSendContact = getByTestId(`default_sercqSendContact`);
    expect(sercqSendContact).toBeInTheDocument();
    expect(sercqSendContact).toHaveTextContent('legal-contacts.sercq-send-enabled');

    const disableButton = within(sercqSendContact).getByRole('button', { name: 'button.disable' });
    expect(disableButton).toBeInTheDocument();
    expect(disableButton).toBeDisabled();

    const banner = within(container).getByTestId('PecVerificationAlert');
    expect(banner).toBeInTheDocument();
    const alertIcon = within(banner).getByTestId('InfoOutlinedIcon');
    expect(alertIcon).toBeInTheDocument();
    expect(banner).toHaveTextContent('legal-contacts.pec-validation-banner.title');
    expect(banner).toHaveTextContent('legal-contacts.pec-validation-banner.dod-enabled-message');
  });

  it('renders component - SERCQ disabled and validating PEC', async () => {
    const { container, getByTestId, getByText } = render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalAddressesPecValidation(false) } },
    });
    expect(container).toHaveTextContent('legal-contacts.title');
    expect(container).toHaveTextContent('legal-contacts.sub-title');
    // check contacts
    const pecValidationItem = getByTestId('default_pecContact');
    expect(pecValidationItem).toBeInTheDocument();
    const closeIcon = getByTestId('CloseIcon');
    expect(closeIcon).toBeInTheDocument();
    const cancelValidationButton = getByText('legal-contacts.cancel-pec-validation');
    expect(cancelValidationButton).toBeInTheDocument();

    const sercqSendContact = getByTestId(`default_sercqSendContact`);
    expect(sercqSendContact).toBeInTheDocument();
    const enableButton = within(sercqSendContact).getByText('legal-contacts.sercq-send-active');
    expect(enableButton).toBeInTheDocument();
    expect(enableButton).toBeDisabled();

    const banner = within(container).getByTestId('PecVerificationAlert');
    expect(banner).toBeInTheDocument();
    const alertIcon = within(banner).getByTestId('InfoOutlinedIcon');
    expect(alertIcon).toBeInTheDocument();
    expect(banner).toHaveTextContent('legal-contacts.pec-validation-banner.title');
    expect(banner).toHaveTextContent('legal-contacts.pec-validation-banner.dod-disabled-message');
  });
});
