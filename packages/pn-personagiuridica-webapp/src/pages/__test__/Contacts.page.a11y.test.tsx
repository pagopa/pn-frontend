import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { vi } from 'vitest';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { digitalAddresses } from '../../../../pn-personafisica-webapp/src/__mocks__/Contacts.mock';
import { RenderResult, act, axe, render } from '../../__test__/test-utils';
import { CONTACTS_LIST } from '../../api/contacts/contacts.routes';
import Contacts from '../Contacts.page';

// this is needed because there is a bug when vi.mock is used
// https://github.com/vitest-dev/vitest/issues/3300
// maybe with vitest 1, we can remove the workaround
const apiClients = await import('../../api/apiClients');

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('Contacts page - accessibility tests', () => {
  let mock: MockAdapter;
  let result: RenderResult;

  beforeAll(() => {
    mock = new MockAdapter(apiClients.apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('is contact page accessible - no contacts', async () => {
    mock.onGet(CONTACTS_LIST()).reply(200, []);
    await act(async () => {
      result = render(<Contacts />);
    });

    if (result) {
      const { container } = result;
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  }, 15000);

  it('is contact page accessible - contacts', async () => {
    mock.onGet(CONTACTS_LIST()).reply(200, digitalAddresses);
    await act(async () => {
      result = render(<Contacts />);
    });

    if (result) {
      const { container } = result;
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  }, 15000);

  it('is contact page accessible - API error', async () => {
    mock.onGet(CONTACTS_LIST()).reply(500);
    await act(async () => {
      result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <Contacts />
        </>
      );
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
