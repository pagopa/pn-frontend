import * as React from 'react';
import { render, axe } from "../../../__test__/test-utils";
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
  it('does not have basic accessibility issues', async () => {
    const { container } = render(<CourtesyContacts recipientId="mock-recipient" contacts={[]}/>);
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
