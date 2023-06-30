import * as React from 'react';

import { render } from '../../../__test__/test-utils';
import CourtesyContacts from '../CourtesyContacts';

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
    const result = render(<CourtesyContacts recipientId="mock-recipient" contacts={[]} />);
    const avatar = result.getByText('Email');
    expect(avatar).toBeInTheDocument();
    const subtitle = result.getByTestId(/DigitalContactsCardBody/).getElementsByTagName('p')[0];
    expect(subtitle).toHaveTextContent('courtesy-contacts.title');
    const title = result.getByRole('heading');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('courtesy-contacts.subtitle');
    const descriptions = result.getAllByText('courtesy-contacts.description');
    expect(descriptions[0]).toBeInTheDocument();
    expect(descriptions).toHaveLength(1);
    const courtesyContactsListComponents = result.getAllByText('CourtesyContactsList');
    expect(courtesyContactsListComponents[0]).toBeInTheDocument();
    expect(courtesyContactsListComponents).toHaveLength(1);
  });
});
