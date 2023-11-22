import * as React from 'react';
import { vi } from 'vitest';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import { RenderResult, act, axe, render } from '../../../__test__/test-utils';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
import LegalContactsList from '../LegalContactsList';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

const defaultAddress = digitalAddresses.legal.find(
  (addr) => addr.senderId === 'default' && addr.pecValid
);

describe('LegalContactsList Component - accessibility tests', () => {
  it('does not have basic accessibility issues - pec valid', async () => {
    let result: RenderResult | undefined;

    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <LegalContactsList
            recipientId="mocked-recipientId"
            legalAddresses={digitalAddresses.legal}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });

  it('does not have basic accessibility issues - pec validating', async () => {
    let result: RenderResult | undefined;

    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <LegalContactsList
            recipientId="mocked-recipientId"
            legalAddresses={[{ ...defaultAddress!, pecValid: false }]}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });
});
