import * as React from 'react';
import { act, RenderResult } from "@testing-library/react";
import { fail } from 'assert';

import { CourtesyChannelType, DigitalAddress } from '../../../models/contacts';
import { axe, render } from "../../../__test__/test-utils";
import CourtesyContactsList from "../CourtesyContactsList";
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const mockedContacts: Array<DigitalAddress> = [{
  addressType: 'courtesy',
  recipientId: 'recipient1',
  senderId: 'default',
  channelType: CourtesyChannelType.SMS,
  value: '3331234567',
  code: '12345',
}, {
  addressType: 'courtesy',
  recipientId: 'recipient1',
  senderId: 'default',
  channelType: CourtesyChannelType.EMAIL,
  value: 'test@test.com',
  code: '54321',
},
];

describe('CourtesyContactsList Component', () => {
  // eslint-disable-next-line functional/no-let
  let result: RenderResult | undefined;

  it('does not have basic accessibility issues (empty store)', async () => {
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactsList recipientId="mock-recipient" contacts={[]} />
        </DigitalContactsCodeVerificationProvider>
      );
    });

    if(result){
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail("render() returned undefined!");
    }
  });

  it('does not have basic accessibility issues (data in store)', async () => {
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactsList recipientId="mock-recipient" contacts={mockedContacts} />
        </DigitalContactsCodeVerificationProvider>
      );
    });

    if(result){
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail("render() returned undefined!");
    }
  });
});
