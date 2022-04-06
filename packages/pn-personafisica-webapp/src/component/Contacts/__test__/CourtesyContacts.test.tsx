import { render, screen } from "@testing-library/react";
import CourtesyContacts from "../CourtesyContacts";

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
      t: (str: string) => str,
    }),
}));

// mock CourtesyContactsList Component
jest.mock('../CourtesyContactsList', () => () => <div>CourtesyContactsList</div>);

describe('CourtesyContacts Component', () => {
  it('renders correctly', () => {
    render(<CourtesyContacts />);
    const avatar = screen.getByText('Sms');
    expect(avatar).toBeInTheDocument();
    const subtitle = screen.getByTestId(/DigitalContactsCardBody/).getElementsByTagName('p')[0];
    expect(subtitle).toHaveTextContent('courtesy-contacts.title');
    const title = screen.getByRole('heading');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("courtesy-contacts.subtitle");
    const descriptions = screen.getAllByText('courtesy-contacts.description');
    expect(descriptions[0]).toBeInTheDocument();
    expect(descriptions).toHaveLength(1);
    const courtesyContactsListComponents = screen.getAllByText('CourtesyContactsList');
    expect(courtesyContactsListComponents[0]).toBeInTheDocument();
    expect(courtesyContactsListComponents).toHaveLength(1);
    const checkbox = screen.getByRole('checkbox', {name: /courtesy-contacts.io-enable/});
    expect(checkbox).toBeDisabled();
  });
});