import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { digitalLegalAddresses } from '../../../__mocks__/Contacts.mock';
import { render, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import LegalContacts from '../LegalContacts';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

const defaultAddress = digitalLegalAddresses.find(
  (addr) => addr.senderId === 'default' && addr.pecValid
);

describe('LegalContacts Component', async () => {
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

  it('renders component', () => {
    // render component
    const { container, getByTestId } = render(
      <LegalContacts legalAddresses={digitalLegalAddresses} />
    );
    expect(container).toHaveTextContent('legal-contacts.title');
    expect(container).toHaveTextContent('legal-contacts.subtitle-2');
    const form = container.querySelector('form');
    expect(form!).toBeInTheDocument();
    expect(form!).toHaveTextContent('legal-contacts.pec-added');
    expect(form!).toHaveTextContent(defaultAddress!.value);
    const buttons = form?.querySelectorAll('button');
    expect(buttons!).toHaveLength(2);
    expect(buttons![0]).toHaveTextContent('button.modifica');
    expect(buttons![1]).toHaveTextContent('button.elimina');
    const disclaimer = getByTestId('legal-contact-disclaimer');
    expect(disclaimer).toBeInTheDocument();
  });

  it('renders component - no contacts', async () => {
    const { container, getByRole, getByTestId } = render(<LegalContacts legalAddresses={[]} />);
    expect(container).toHaveTextContent('legal-contacts.title');
    expect(container).toHaveTextContent('legal-contacts.subtitle');
    expect(container).toHaveTextContent('legal-contacts.description');
    const form = container.querySelector('form');
    const pecInput = form?.querySelector('input[id="default_pec"]');
    expect(pecInput!).toHaveValue('');
    const button = await waitFor(() => getByRole('button', { name: 'button.conferma' }));
    expect(button).toBeDisabled();
    const disclaimer = getByTestId('legal-contact-disclaimer');
    expect(disclaimer).toBeInTheDocument();
  });
});
