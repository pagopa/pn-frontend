import { vi } from 'vitest';

import { digitalAddresses, digitalAddressesSercq } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, within } from '../../../__test__/test-utils';
import { AddressType } from '../../../models/contacts';
import ContactsSummaryCards from '../ContactsSummaryCards';
import { sortAddresses } from '../../../utility/contacts.utility';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('ContactsSummaryCards component', () => {
  it('renders component - no contacts', () => {
    const { getByTestId } = render(<ContactsSummaryCards />, {
      preloadedState: { contactsState: { digitalAddresses: [] } },
    });

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
    const { getByTestId } = render(<ContactsSummaryCards />, {
      preloadedState: { contactsState: { digitalAddresses } },
    });

    const legalContacts = getByTestId('legalContactsCard');
    const courtesyContacts = getByTestId('courtesyContactsCard');
    expect(legalContacts).toBeInTheDocument();
    expect(courtesyContacts).toBeInTheDocument();

    const legalIcon = within(legalContacts).getByTestId('verifiedIcon');
    expect(legalIcon).toBeInTheDocument();
    const legalTitle = within(legalContacts).getByTestId('cardTitle');
    expect(legalTitle).toHaveTextContent('summary-card.legal-title');
    const legalDescription = within(legalContacts).getByTestId('cardDescription');
    expect(legalDescription).toHaveTextContent('summary-card.PEC');

    const courtesyIcon = within(courtesyContacts).getByTestId('verifiedIcon');
    expect(courtesyIcon).toBeInTheDocument();
    const courtesyTitle = within(courtesyContacts).getByTestId('cardTitle');
    expect(courtesyTitle).toHaveTextContent('summary-card.courtesy-title');
    const courtesyDescription = within(courtesyContacts).getByTestId('cardDescription');
    expect(courtesyDescription).toHaveTextContent('summary-card.EMAIL, summary-card.SMS');
  });

  it('should show warningIcon if there is a SERCQ SEND contact and no courtesy contact', () => {
    const { getByTestId } = render(<ContactsSummaryCards />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: sortAddresses(
            digitalAddressesSercq.filter((addr) => addr.addressType === AddressType.LEGAL)
          ),
        },
      },
    });

    const legalContacts = getByTestId('legalContactsCard');
    const courtesyContacts = getByTestId('courtesyContactsCard');
    expect(legalContacts).toBeInTheDocument();
    expect(courtesyContacts).toBeInTheDocument();

    const legalIcon = within(legalContacts).getByTestId('verifiedIcon');
    expect(legalIcon).toBeInTheDocument();
    const legalTitle = within(legalContacts).getByTestId('cardTitle');
    expect(legalTitle).toHaveTextContent('summary-card.legal-title');
    const legalDescription = within(legalContacts).getByTestId('cardDescription');
    expect(legalDescription).toHaveTextContent('summary-card.SERCQ_SEND, summary-card.PEC');

    const courtesyIcon = within(courtesyContacts).getByTestId('warningIcon');
    expect(courtesyIcon).toBeInTheDocument();
    const courtesyTitle = within(courtesyContacts).getByTestId('cardTitle');
    expect(courtesyTitle).toHaveTextContent('summary-card.courtesy-title');
    const courtesyDescription = within(courtesyContacts).getByTestId('cardDescription');
    expect(courtesyDescription).toHaveTextContent('summary-card.no-address');
  });

  it('should scroll to section', () => {
    const { getByTestId } = render(<ContactsSummaryCards />, {
      preloadedState: { contactsState: { digitalAddresses } },
    });

    const legalContacts = getByTestId('legalContactsCard');
    const courtesyContacts = getByTestId('courtesyContactsCard');
    expect(legalContacts).toBeInTheDocument();
    expect(courtesyContacts).toBeInTheDocument();

    const scrollIntoViewMock = vi.fn();
    const focusMock = vi.fn();
    document.getElementById = vi.fn().mockReturnValue({
      scrollIntoView: scrollIntoViewMock,
      focus: focusMock,
    });

    fireEvent.click(within(legalContacts).getByRole('button'));
    expect(document.getElementById).toHaveBeenCalledWith('legalContactsSection');
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    expect(focusMock).toHaveBeenCalled();

    fireEvent.click(within(courtesyContacts).getByRole('button'));
    expect(document.getElementById).toHaveBeenCalledWith('courtesyContactsSection');
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    expect(focusMock).toHaveBeenCalled();
  });
});
