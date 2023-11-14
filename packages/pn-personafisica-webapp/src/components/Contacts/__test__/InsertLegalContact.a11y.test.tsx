import * as React from 'react';
import { vi } from 'vitest';

import { RenderResult, act, axe, render } from '../../../__test__/test-utils';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
import InsertLegalContact from '../InsertLegalContact';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('InsertLegalContact component', () => {
  let result: RenderResult | undefined;

  it('does not have basic accessibility issues', async () => {
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <InsertLegalContact recipientId={'mocked-recipientId'} />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  }, 10000);
});
