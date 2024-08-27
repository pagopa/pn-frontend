import { vi } from 'vitest';

import { digitalCourtesyAddresses, digitalLegalAddresses } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, within } from '../../../__test__/test-utils';
import ContactsSummaryCards from '../ContactsSummaryCards';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('ContactsSummaryCards component', () => {
  it('renders component - no contacts', () => {
    const { getByTestId } = render(
      <ContactsSummaryCards legalAddresses={[]} courtesyAddresses={[]} />
    );

    const legalContacts = getByTestId('legalContactsCard');
    const courtesyContacts = getByTestId('courtesyContactsCard');
    expect(legalContacts).toBeInTheDocument();
    expect(courtesyContacts).toBeInTheDocument();

    const legalIcon = within(legalContacts).getByTestId('addIcon');
    expect(legalIcon).toBeInTheDocument();
    const legalTitle = within(legalContacts).getByTestId('cardTitle');
    expect(legalTitle).toHaveTextContent('summary-card.legal-title');
    const legalDescription = within(legalContacts).getByTestId('cardDescription');
    expect(legalDescription).toHaveTextContent('summary-card.no-address');

    const courtesyIcon = within(courtesyContacts).getByTestId('addIcon');
    expect(courtesyIcon).toBeInTheDocument();
    const courtesyTitle = within(courtesyContacts).getByTestId('cardTitle');
    expect(courtesyTitle).toHaveTextContent('summary-card.courtesy-title');
    const courtesyDescription = within(courtesyContacts).getByTestId('cardDescription');
    expect(courtesyDescription).toHaveTextContent('summary-card.no-address');
  });

  it('renders component - with contacts', () => {
    const { getByTestId } = render(
      <ContactsSummaryCards
        legalAddresses={digitalLegalAddresses}
        courtesyAddresses={digitalCourtesyAddresses}
      />
    );

    const legalContacts = getByTestId('legalContactsCard');
    const courtesyContacts = getByTestId('courtesyContactsCard');
    expect(legalContacts).toBeInTheDocument();
    expect(courtesyContacts).toBeInTheDocument();

    const legalIcon = within(legalContacts).getByTestId('verifiedIcon');
    expect(legalIcon).toBeInTheDocument();
    const legalTitle = within(legalContacts).getByTestId('cardTitle');
    expect(legalTitle).toHaveTextContent('summary-card.legal-title');
    const legalDescription = within(legalContacts).getByTestId('cardDescription');
    expect(legalDescription).toHaveTextContent(
      digitalLegalAddresses.map((contact) => `summary-card.${contact.channelType}`).join(', ')
    );

    const courtesyIcon = within(courtesyContacts).getByTestId('verifiedIcon');
    expect(courtesyIcon).toBeInTheDocument();
    const courtesyTitle = within(courtesyContacts).getByTestId('cardTitle');
    expect(courtesyTitle).toHaveTextContent('summary-card.courtesy-title');
    const courtesyDescription = within(courtesyContacts).getByTestId('cardDescription');
    expect(courtesyDescription).toHaveTextContent(
      digitalCourtesyAddresses.map((contact) => `summary-card.${contact.channelType}`).join(', ')
    );
  });

  it('should show warningIcon if there is a SERCQ contant and no courtesy contact', () => {
    const { getByTestId } = render(
      <ContactsSummaryCards legalAddresses={digitalLegalAddresses} courtesyAddresses={[]} />
    );
    const legalContacts = getByTestId('legalContactsCard');
    const courtesyContacts = getByTestId('courtesyContactsCard');
    expect(legalContacts).toBeInTheDocument();
    expect(courtesyContacts).toBeInTheDocument();

    const legalIcon = within(legalContacts).getByTestId('verifiedIcon');
    expect(legalIcon).toBeInTheDocument();
    const legalTitle = within(legalContacts).getByTestId('cardTitle');
    expect(legalTitle).toHaveTextContent('summary-card.legal-title');
    const legalDescription = within(legalContacts).getByTestId('cardDescription');
    expect(legalDescription).toHaveTextContent(
      digitalLegalAddresses.map((contact) => `summary-card.${contact.channelType}`).join(', ')
    );

    const courtesyIcon = within(courtesyContacts).getByTestId('warningIcon');
    expect(courtesyIcon).toBeInTheDocument();
    const courtesyTitle = within(courtesyContacts).getByTestId('cardTitle');
    expect(courtesyTitle).toHaveTextContent('summary-card.courtesy-title');
    const courtesyDescription = within(courtesyContacts).getByTestId('cardDescription');
    expect(courtesyDescription).toHaveTextContent('summary-card.no-address');
  });

  it('should scroll to section', () => {
    const { getByTestId } = render(
      <ContactsSummaryCards legalAddresses={digitalLegalAddresses} courtesyAddresses={[]} />
    );
    const legalContacts = getByTestId('legalContactsCard');
    const courtesyContacts = getByTestId('courtesyContactsCard');
    expect(legalContacts).toBeInTheDocument();
    expect(courtesyContacts).toBeInTheDocument();

    const scrollIntoViewMock = vi.fn();
    document.getElementById = vi.fn().mockReturnValue({
      scrollIntoView: scrollIntoViewMock,
    });

    fireEvent.click(legalContacts);
    expect(document.getElementById).toHaveBeenCalledWith('legalContactsSection');
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    fireEvent.click(courtesyContacts);
    expect(document.getElementById).toHaveBeenCalledWith('courtesyContactsSection');
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
  });
});
