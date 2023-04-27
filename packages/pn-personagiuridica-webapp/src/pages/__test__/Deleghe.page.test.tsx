import React from 'react';

import { render, fireEvent, mockApi } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import {
  DELEGATIONS_BY_DELEGATE,
  DELEGATIONS_BY_DELEGATOR,
  DELEGATIONS_NAME_BY_DELEGATE,
} from '../../api/delegations/delegations.routes';
import { GET_GROUPS } from '../../api/external-registries/external-registries-routes';
import Deleghe from '../Deleghe.page';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

jest.mock('../../component/Deleghe/DelegatesByCompany', () => ({
  __esModule: true,
  default: () => <div>DelegatesByCompany</div>,
}));

jest.mock('../../component/Deleghe/DelegationsOfTheCompany', () => ({
  __esModule: true,
  default: () => <div>DelegationsOfTheCompany</div>,
}));

describe('Deleghe page', () => {
  it('renders deleghe page - no delegates', () => {
    const mock = mockApi(apiClient, 'GET', DELEGATIONS_BY_DELEGATOR(), 200, undefined, []);
    mockApi(mock, 'POST', DELEGATIONS_BY_DELEGATE({ size: 10 }), 200, undefined, {
      resultsPage: [],
      nextPagesKey: [],
      moreResult: false,
    });
    mockApi(mock, 'GET', GET_GROUPS(), 200, undefined, []);
    mockApi(mock, 'GET', DELEGATIONS_NAME_BY_DELEGATE(), 200, undefined, []);
    const result = render(<Deleghe />);
    expect(result.container).toHaveTextContent(/deleghe.title/i);
    expect(result.container).toHaveTextContent(/deleghe.description/i);
    expect(result.container).toHaveTextContent(/DelegatesByCompany/i);
    expect(result.container).toHaveTextContent(/deleghe.tab_delegati/i);
    expect(result.container).toHaveTextContent(/deleghe.tab_deleghe/i);
    expect(result.container).not.toHaveTextContent(/DelegationsOfTheCompany/i);
    mock.reset();
    mock.restore();
  });

  it('test changing tab', async () => {
    const mock = mockApi(apiClient, 'GET', DELEGATIONS_BY_DELEGATOR(), 200, undefined, []);
    mockApi(mock, 'POST', DELEGATIONS_BY_DELEGATE({ size: 10 }), 200, undefined, {
      resultsPage: [],
      nextPagesKey: [],
      moreResult: false,
    });
    mockApi(mock, 'GET', GET_GROUPS(), 200, undefined, []);
    mockApi(mock, 'GET', DELEGATIONS_NAME_BY_DELEGATE(), 200, undefined, []);
    const result = render(<Deleghe />);
    const tab2 = result.getByTestId('tab2');
    fireEvent.click(tab2);
    expect(result.container).toHaveTextContent(/DelegationsOfTheCompany/i);
    mock.reset();
    mock.restore();
  });

  //TODO
  it.skip('test see modal to revoke and confirm revoking delegates', async () => {});
});
