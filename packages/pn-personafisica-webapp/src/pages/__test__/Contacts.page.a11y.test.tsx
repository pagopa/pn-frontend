import React from 'react';
import { axe, mockApi, render, act, RenderResult } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { CONTACTS_LIST } from '../../api/contacts/contacts.routes';
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
    const mock = mockApi(apiClient, 'GET', CONTACTS_LIST(), 200, undefined, []);
    let result: RenderResult | undefined;
    await act(async () => {
      result = render(<Contacts />, initialState);
    });

    if (result) {
      const { container } = result;
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  }, 15000);
});
