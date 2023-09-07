import * as React from 'react';

import { SpecialContactsProvider } from '@pagopa-pn/pn-commons';

import { RenderResult, act, axe, render } from '../../../__test__/test-utils';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
import SpecialContactElem from '../SpecialContactElem';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('SpecialContactElem Component - accessibility tests', () => {
  let result: RenderResult | undefined;

  it('does not have basic accessibility issues', async () => {
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactsProvider>
            <SpecialContactElem
              address={{
                senderId: 'mocked-senderId',
                senderName: 'Mocked Sender',
                mail: 'mocked@mail.it',
                pec: 'mocked@pec.it',
              }}
              recipientId="mocked-recipientId"
            />
          </SpecialContactsProvider>
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
