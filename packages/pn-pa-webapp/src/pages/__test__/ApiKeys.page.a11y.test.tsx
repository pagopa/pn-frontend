import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { mockApiKeysDTO } from '../../__mocks__/ApiKeys.mock';
import { RenderResult, act, axe, render } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
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
    mock.onGet('/bff/v1/api-keys?limit=10&showVirtualKey=true').reply(200, []);
    await act(async () => {
      result = render(<ApiKeys />, { preloadedState: reduxInitialState });
    });
    const results = await axe(result!.container);
    expect(results).toHaveNoViolations();
  }, 15000);

  it('no empty list', async () => {
    mock.onGet('/bff/v1/api-keys?limit=10&showVirtualKey=true').reply(200, mockApiKeysDTO);
    await act(async () => {
      result = render(<ApiKeys />, { preloadedState: reduxInitialState });
    });
    const results = await axe(result!.container);
    expect(results).toHaveNoViolations();
  }, 15000);

  it('api return error', async () => {
    mock.onGet('/bff/v1/api-keys?limit=10&showVirtualKey=true').reply(500);
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
