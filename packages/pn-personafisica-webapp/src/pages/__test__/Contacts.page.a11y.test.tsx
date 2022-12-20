import React from 'react';
import { act, RenderResult } from '@testing-library/react';
import * as redux from 'react-redux';
import { axe, render } from '../../__test__/test-utils';
import Contacts from '../Contacts.page';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: () => 'mocked verify description',
}));

const initialState = {
  preloadedState: {
    userState: {
      user: {
        uid: 'mocked-recipientId',
      },
    },
    contactsState: {
      digitalAddresses: {
        legal: [],
        courtesy: [],
      },
    },
  },
};

describe('Contacts page - accessibility tests', () => {
  it('is contact page accessible', async () => {
    // mock dispatch
    const mockDispatchFn = jest.fn(() => ({
      then: () => Promise.resolve(),
    }));
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
  
    // eslint-disable-next-line functional/no-let
    let result: RenderResult | undefined;
    await act(async () => {
      result = render(<Contacts />, initialState);
    });

    if (result) {
      const { container } = result;
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    } else {
      fail("render() returned undefined!");
    }
  }, 15000);
});
