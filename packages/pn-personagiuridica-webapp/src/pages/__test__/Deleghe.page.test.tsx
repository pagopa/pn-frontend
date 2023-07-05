import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { render, fireEvent, mockApi, waitFor, prettyDOM } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import * as routes from '../../navigation/routes.const';
import {
  DELEGATIONS_BY_DELEGATE,
  DELEGATIONS_BY_DELEGATOR,
} from '../../api/delegations/delegations.routes';
import { GET_GROUPS } from '../../api/external-registries/external-registries-routes';
import DelegatesByCompany from '../../component/Deleghe/DelegatesByCompany';
import DelegationsOfTheCompany from '../../component/Deleghe/DelegationsOfTheCompany';
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
  it('renders deleghe page', () => {
    const mock = mockApi(apiClient, 'GET', DELEGATIONS_BY_DELEGATOR(), 200, undefined, []);
    mockApi(mock, 'POST', DELEGATIONS_BY_DELEGATE({ size: 10 }), 200, undefined, {
      resultsPage: [],
      nextPagesKey: [],
      moreResult: false,
    });
    mockApi(mock, 'GET', GET_GROUPS(), 200, undefined, []);
    const result = render(
      <MemoryRouter initialEntries={[routes.DELEGHEACARICO]}>
        <Routes>
          <Route element={<Deleghe />}>
            <Route path={routes.DELEGHEACARICO} element={<DelegationsOfTheCompany />} />
            <Route path={routes.DELEGATI} element={<DelegatesByCompany />} />
          </Route>
        </Routes>
      </MemoryRouter>,
      { navigationRouter: 'none' }
    );
    expect(result.container).toHaveTextContent(/deleghe.title/i);
    expect(result.container).toHaveTextContent(/deleghe.description/i);
    expect(result.container).not.toHaveTextContent(/DelegatesByCompany/i);
    expect(result.container).toHaveTextContent(/deleghe.tab_delegati/i);
    expect(result.container).toHaveTextContent(/deleghe.tab_deleghe/i);
    expect(result.container).toHaveTextContent(/DelegationsOfTheCompany/i);
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
    const result = render(
      <MemoryRouter initialEntries={[routes.DELEGHEACARICO]}>
        <Routes>
          <Route element={<Deleghe />}>
            <Route path={routes.DELEGHEACARICO} element={<DelegationsOfTheCompany />} />
            <Route path={routes.DELEGATI} element={<DelegatesByCompany />} />
          </Route>
        </Routes>
      </MemoryRouter>,
      { navigationRouter: 'none' }
    );
    const tab2 = result.getByTestId('tab1');
    fireEvent.click(tab2);
    await waitFor(() => expect(result.container).toHaveTextContent(/DelegatesByCompany/i));
    mock.reset();
    mock.restore();
  });
});
