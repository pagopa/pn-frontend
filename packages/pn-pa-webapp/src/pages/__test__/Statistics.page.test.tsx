import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { RenderResult, act, render, screen } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import Statistics from '../Statistics.page';
import { statisticsMockResponse } from './statistics.mock';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

// TODO enable this test after completing the feature PN-10851
describe('Statistics Page tests', () => {
  let result: RenderResult;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });
  it.skip('renders Statistics Page', () => {
    const result = render(<Statistics />, {
      preloadedState: {
        userState: { organizationParty: { name: 'mocked-sender' } },
      },
    });

    expect(result.container).toHaveTextContent('title');
    expect(result.container).toHaveTextContent('subtitle');
  });

  it('api return error', async () => {
    mock.onGet('/bff/v1/sender-dashboard/dashboard-data-request').reply(500);
    await act(async () => {
      result = render(
        <>
          <ResponseEventDispatcher />
          <AppResponseMessage />
          <Statistics />
        </>
      );
    });
    expect(result.container).toHaveTextContent('error-fetch');
    screen.debug();
  });
});
