import * as React from 'react';
import { act, RenderResult } from '@testing-library/react';

import { DigitalAddress, LegalChannelType } from '../../../models/contacts';
import { axe, render } from '../../../__test__/test-utils';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
import LegalContactsList from '../LegalContactsList';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: {i18nKey: string}) => props.i18nKey,
}));

const legalAddresses: Array<DigitalAddress> = [
  {
    addressType: 'legal',
    recipientId: 'mocked-recipientId',
    senderId: 'default',
    channelType: LegalChannelType.PEC,
    value: 'mocked@mail.it',
    code: '12345',
  },
];

describe('LegalContactsList Component - accessibility tests', () => {
  it('does not have basic accessibility issues', async () => {
    // eslint-disable-next-line functional/no-let
    let result: RenderResult | undefined;

    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <LegalContactsList recipientId="mocked-recipientId" legalAddresses={legalAddresses} />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail("render() returned undefined!");
    }
  });
});
