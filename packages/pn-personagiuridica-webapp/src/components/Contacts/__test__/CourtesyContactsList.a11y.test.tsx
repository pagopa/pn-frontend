import { fail } from 'assert';
import * as React from 'react';

import { RenderResult, act } from '@testing-library/react';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import { axe, render } from '../../../__test__/test-utils';
import CourtesyContactsList from '../CourtesyContactsList';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('CourtesyContactsList Component', () => {
  let result: RenderResult | undefined;

  it('does not have basic accessibility issues (empty store)', async () => {
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactsList recipientId="mock-recipient" contacts={[]} />
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

  it('does not have basic accessibility issues (data in store)', async () => {
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactsList recipientId="mock-recipient" contacts={digitalAddresses.courtesy} />
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
