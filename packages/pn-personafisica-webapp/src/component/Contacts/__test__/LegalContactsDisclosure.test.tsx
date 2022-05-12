import { axe, render } from '../../../__test__/test-utils';
import LegalContactsDisclosure from "../LegalContactsDisclosure";

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  }
}));

describe('LegalContactsDisclosure Component', () => {

  it('renders LegalContactsDisclosure', () => {
    // render component
    const result = render(<LegalContactsDisclosure />);
    expect(result.container).toHaveTextContent(/legal-contacts.save-money/i);
    expect(result.container).toHaveTextContent(/legal-contacts.avoid-waste/i);
    expect(result.container).toHaveTextContent(/legal-contacts.fast-notification/i);
  });

  it('does not have basic accessibility issues', async () => {
    const { container } = render(<LegalContactsDisclosure />);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});