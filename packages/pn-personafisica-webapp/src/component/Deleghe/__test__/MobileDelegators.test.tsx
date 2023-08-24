import MockAdapter from 'axios-mock-adapter';

import { apiOutcomeTestHelper } from '@pagopa-pn/pn-commons';

import { arrayOfDelegators } from '../../../__mocks__/Delegations.mock';
import { RenderResult, act, render } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { DELEGATIONS_BY_DELEGATE } from '../../../api/delegations/delegations.routes';
import * as hooks from '../../../redux/hooks';
import MobileDelegators from '../MobileDelegators';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('MobileDelegators Component - assuming delegators API works properly', () => {
  it('renders the empty state', () => {
    const result = render(<MobileDelegators />);

    expect(result.container).toHaveTextContent(/deleghe.delegatorsTitle/i);
    expect(result.container).toHaveTextContent(/deleghe.no_delegators/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.name/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.delegationStart/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.delegationEnd/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.permissions/i);
    expect(result.container).not.toHaveTextContent(/deleghe.table.status/i);
  });

  it('renders the delegators', () => {
    const mockUseAppSelector = jest.spyOn(hooks, 'useAppSelector');
    mockUseAppSelector.mockReturnValueOnce(arrayOfDelegators);
    const result = render(<MobileDelegators />);

    expect(result.container).toHaveTextContent(/marco verdi/i);
    expect(result.container).toHaveTextContent(/davide legato/i);
    expect(result.container).not.toHaveTextContent(/luca blu/i);
  });
});

describe('MobileDelegators Component - different delegators API behaviors', () => {
  let result: RenderResult | undefined;
  let mock: MockAdapter;

  beforeEach(() => {
    apiOutcomeTestHelper.setStandardMock();
  });
  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    jest.restoreAllMocks();
  });

  afterEach(() => {
    result = undefined;
    mock.reset();
    apiOutcomeTestHelper.clearMock();
  });

  afterAll(() => {
    mock.restore();
  });

  it('API error', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(500);
    await act(async () => {
      result = render(<MobileDelegators />);
    });
    expect(result?.container).toHaveTextContent('deleghe.no_delegators');
  });
});
