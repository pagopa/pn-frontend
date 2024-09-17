import { vi } from 'vitest';

import {
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
    expect(container).toHaveTextContent('legal-contacts.list');
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
  });

  it('renders component - SERCQ enabled', async () => {
    const { container, getByTestId } = render(<LegalContacts />, {
      preloadedState: { contactsState: { digitalAddresses: digitalLegalAddressesSercq } },
    });
    expect(container).toHaveTextContent('legal-contacts.title');
    expect(container).toHaveTextContent('legal-contacts.list');
    const pecContact = getByTestId(`default_pecContact`);
    const pecInput = pecContact.querySelector(`[name="default_pec"]`);
    expect(pecInput).toBeInTheDocument();
    expect(pecInput).toHaveValue('');
    const button = await waitFor(() =>
      within(pecContact).getByRole('button', { name: 'button.conferma' })
    );
    expect(button).toBeDisabled();

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
    expect(container).toHaveTextContent('legal-contacts.list');
    // check contacts
    const pecContact = getByTestId(`default_pecContact`);
    const pecInput = pecContact.querySelector(`[name="default_pec"]`);
    expect(pecInput).toBeInTheDocument();
    expect(pecInput).toHaveValue('');
    const button = await waitFor(() =>
      within(pecContact).getByRole('button', { name: 'button.conferma' })
    );
    expect(button).toBeDisabled();
    const sercqSendContact = getByTestId(`default_sercqSendContact`);
    expect(sercqSendContact).toBeInTheDocument();
    const activateButton = within(sercqSendContact).getByTestId('activateButton');
    expect(activateButton).toBeInTheDocument();
  });
});
