import { vi } from 'vitest';

import {
  digitalAddressesPecValidation,
  digitalLegalAddresses,
  digitalLegalAddressesSercq,
} from '../../../__mocks__/Contacts.mock';
import { render, waitFor, within } from '../../../__test__/test-utils';
import { ChannelType } from '../../../models/contacts';
import LegalContacts from '../LegalContacts';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string, options?: { returnObjects: boolean }) =>
      options?.returnObjects ? [str] : str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

const defaultPecAddress = digitalLegalAddresses.find(
  (addr) => addr.senderId === 'default' && addr.pecValid && addr.channelType === ChannelType.PEC
);

describe('LegalContacts Component', async () => {
  it('renders component - PEC enabled', () => {
    // render component
    const { container, getByTestId, getByText } = render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddresses } },
    });
    expect(container).toHaveTextContent('legal-contacts.title');
    expect(container).toHaveTextContent('legal-contacts.sub-title');
    const pecContact = getByTestId(`default_pecContact`);
    const pecInput = pecContact.querySelector(`[name="default_pec"]`);
    expect(pecInput).not.toBeInTheDocument();
    const pec = getByText(defaultPecAddress!.value);
    expect(pec).toBeInTheDocument();
    const pecButtons = within(pecContact).getAllByRole('button');
    expect(pecButtons[0]).toBeEnabled();
    expect(pecButtons[1]).toBeEnabled();
    expect(pecButtons[0].textContent).toMatch('button.modifica');
    expect(pecButtons[1].textContent).toMatch('button.elimina');
    const sercqSendContact = getByTestId(`default_sercqSendContact`);
    expect(sercqSendContact).toBeInTheDocument();
    const activateButton = within(sercqSendContact).getByTestId('activateButton');
    expect(activateButton).toBeInTheDocument();
    expect(activateButton).toHaveTextContent('legal-contacts.sercq-send-active-pec-enabled');
    const descriptionText = getByText('legal-contacts.sercq-send-description-pec-enabled');
    expect(descriptionText).toBeInTheDocument();
  });

  it('renders component - SERCQ enabled', async () => {
    const { container, getByTestId, queryByTestId } = render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddressesSercq } },
    });
    expect(container).toHaveTextContent('legal-contacts.title');
    expect(container).toHaveTextContent('legal-contacts.sub-title');
    // check contacts
    const pecContact = queryByTestId(`default_pecContact`);
    // TODO Temporary fix
    // Should add .not.toBeInTheDocument() when the LegalContacts component is reworked
    expect(pecContact).toBeInTheDocument();
    const sercqSendContact = getByTestId(`default_sercqSendContact`);
    expect(sercqSendContact).toBeInTheDocument();
    expect(sercqSendContact).toHaveTextContent('legal-contacts.sercq-send-enabled');
    const disableButton = within(sercqSendContact).getByRole('button', { name: 'button.disable' });
    expect(disableButton).toBeInTheDocument();
  });

  it('renders component - no contacts', async () => {
    const { container, getByTestId } = render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: [] } },
    });
    expect(container).toHaveTextContent('legal-contacts.title');
    expect(container).toHaveTextContent('legal-contacts.sub-title');
    // check contacts
    const pecContact = getByTestId(`default_pecContact`);
    const pecInput = pecContact.querySelector(`[name="default_pec"]`);
    expect(pecInput).toBeInTheDocument();
    expect(pecInput).toHaveValue('');
    const button = within(pecContact).getByRole('button', { name: 'button.attiva' });
    await waitFor(() => {
      expect(button).toBeEnabled();
    });
    const sercqSendContact = getByTestId(`default_sercqSendContact`);
    expect(sercqSendContact).toBeInTheDocument();
    const activateButton = within(sercqSendContact).getByTestId('activateButton');
    expect(activateButton).toBeInTheDocument();
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
