import * as React from 'react';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import { RenderResult, act, axe, render } from '../../../__test__/test-utils';
import CourtesyContacts from '../CourtesyContacts';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('CourtesyContacts Component', async () => {
  let result: RenderResult | undefined;

  it('does not have basic accessibility issues - no contacts', async () => {
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContacts recipientId="mock-recipient" contacts={[]} />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  });

  it('does not have basic accessibility issues - contacts', async () => {
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContacts recipientId="mock-recipient" contacts={digitalAddresses.courtesy} />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  });
});
