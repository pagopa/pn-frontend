import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { AppResponseMessage, ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { userResponse } from '../../__mocks__/Auth.mock';
import { RenderResult, act, render } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import Statistics from '../Statistics.page';

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

  it('renders Statistics Page - empty statistics', () => {
    const result = render(<Statistics />, {
      preloadedState: {
        userState: { user: userResponse },
      },
    });

    expect(result.container).toHaveTextContent('title');
    expect(result.container).toHaveTextContent('empty.descriptionStatistics');
  });

  it('api return error', async () => {
    mock.onGet(/\/bff\/v1\/sender-dashboard\/dashboard-data-request*/).reply(500);
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
  });
});
