import * as React from 'react';
import * as redux from 'react-redux';
import { act, RenderResult } from '@testing-library/react';

import { axe, render } from '../../../__test__/test-utils';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
import SpecialContacts from '../SpecialContacts';
import { courtesyAddresses, legalAddresses, initialState } from './SpecialContacts.test-utils';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));


describe('SpecialContacts Component - accessibility tests', () => {
  it('does not have basic accessibility issues', async () => {
    const mockDispatchFn = jest.fn(() => ({
      unwrap: () => Promise.resolve(),
    }));
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);

    // eslint-disable-next-line functional/no-let
    let result: RenderResult | undefined;

    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContacts
            recipientId="mocked-recipientId"
            legalAddresses={legalAddresses}
            courtesyAddresses={courtesyAddresses}
          />
        </DigitalContactsCodeVerificationProvider>,
        {
          preloadedState: initialState,
        }
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

