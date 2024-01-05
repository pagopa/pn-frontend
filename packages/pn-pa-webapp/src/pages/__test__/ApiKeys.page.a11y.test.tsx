import MockAdapter from 'axios-mock-adapter';
import * as React from 'react';
import { vi } from 'vitest';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { mockApiKeysDTO, mockGroups } from '../../__mocks__/ApiKeys.mock';
import { RenderResult, act, axe, render } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { APIKEY_LIST } from '../../api/apiKeys/apiKeys.routes';
import { GET_USER_GROUPS } from '../../api/notifications/notifications.routes';
import ApiKeys from '../ApiKeys.page';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const reduxInitialState = {
  apiKeysState: {
    loading: false,
    apiKeys: { items: [], total: 0 },
    pagination: {
      size: 10,
      page: 0,
      nextPagesKey: [],
    },
  },
};

describe('ApiKeys Page - accessibility tests', () => {
  let mock: MockAdapter;
  let result: RenderResult | undefined;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    result = undefined;
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('empty list', async () => {
    mock.onGet(APIKEY_LIST({ limit: 10 })).reply(200, []);
    mock.onGet(GET_USER_GROUPS()).reply(200, mockGroups);
    await act(async () => {
      result = render(<ApiKeys />, { preloadedState: reduxInitialState });
    });
    const results = await axe(result!.container);
    expect(results).toHaveNoViolations();
  }, 15000);

  it('no empty list', async () => {
    mock.onGet(APIKEY_LIST({ limit: 10 })).reply(200, mockApiKeysDTO);
    mock.onGet(GET_USER_GROUPS()).reply(200, mockGroups);
    await act(async () => {
      result = render(<ApiKeys />, { preloadedState: reduxInitialState });
    });
    const results = await axe(result!.container);
    expect(results).toHaveNoViolations();
  }, 15000);

  it('api return error', async () => {
    mock.onGet(APIKEY_LIST({ limit: 10 })).reply(500);
    mock.onGet(GET_USER_GROUPS()).reply(200, mockGroups);
    await act(async () => {
      result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <ApiKeys />
        </>
      );
    });
    const results = await axe(result!.container);
    expect(results).toHaveNoViolations();
  }, 15000);
});
