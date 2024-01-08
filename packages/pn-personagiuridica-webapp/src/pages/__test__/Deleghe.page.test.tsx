import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { userResponse } from '../../__mocks__/Auth.mock';
import { arrayOfDelegates, arrayOfDelegators } from '../../__mocks__/Delegations.mock';
import { fireEvent, render, waitFor } from '../../__test__/test-utils';
import {
  DELEGATIONS_BY_DELEGATE,
  DELEGATIONS_BY_DELEGATOR,
} from '../../api/delegations/delegations.routes';
import { GET_GROUPS } from '../../api/external-registries/external-registries-routes';
import DelegatesByCompany from '../../components/Deleghe/DelegatesByCompany';
import DelegationsOfTheCompany from '../../components/Deleghe/DelegationsOfTheCompany';
import * as routes from '../../navigation/routes.const';
import Deleghe from '../Deleghe.page';

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

describe('Deleghe page', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClients.apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('renders deleghe page', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, arrayOfDelegates);
    mock.onPost(DELEGATIONS_BY_DELEGATE({ size: 10 })).reply(200, {
      resultsPage: arrayOfDelegators,
      nextPagesKey: [],
      moreResult: false,
    });
    mock.onGet(GET_GROUPS()).reply(200, []);
    const { container, queryByTestId, getByTestId } = render(
      <MemoryRouter initialEntries={[routes.DELEGHEACARICO]}>
        <Routes>
          <Route element={<Deleghe />}>
            <Route path={routes.DELEGHEACARICO} element={<DelegationsOfTheCompany />} />
            <Route path={routes.DELEGATI} element={<DelegatesByCompany />} />
          </Route>
        </Routes>
      </MemoryRouter>,
      { navigationRouter: 'none', preloadedState: { userState: { user: userResponse } } }
    );
    expect(container).toHaveTextContent(/deleghe.title/i);
    expect(container).toHaveTextContent(/deleghe.description/i);
    expect(container).toHaveTextContent(/deleghe.tab_delegati/i);
    expect(container).toHaveTextContent(/deleghe.tab_deleghe/i);
    const delegatesByCompany = queryByTestId('delegatesByCompany');
    expect(delegatesByCompany).not.toBeInTheDocument();
    const delegationsOfTheCompany = getByTestId('delegationsOfTheCompany');
    expect(delegationsOfTheCompany).toBeInTheDocument();
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(2);
      expect(mock.history.post).toHaveLength(1);
    });
  });

  it('test changing tab', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, arrayOfDelegates);
    mock.onPost(DELEGATIONS_BY_DELEGATE({ size: 10 })).reply(200, {
      resultsPage: arrayOfDelegators,
      nextPagesKey: [],
      moreResult: false,
    });
    mock.onGet(GET_GROUPS()).reply(200, []);
    const { queryByTestId, getByTestId } = render(
      <MemoryRouter initialEntries={[routes.DELEGHEACARICO]}>
        <Routes>
          <Route element={<Deleghe />}>
            <Route path={routes.DELEGHEACARICO} element={<DelegationsOfTheCompany />} />
            <Route path={routes.DELEGATI} element={<DelegatesByCompany />} />
          </Route>
        </Routes>
      </MemoryRouter>,
      { navigationRouter: 'none', preloadedState: { userState: { user: userResponse } } }
    );
    const tab2 = getByTestId('tab1');
    fireEvent.click(tab2);
    await waitFor(() => {
      const delegatesByCompany = getByTestId('delegatesByCompany');
      expect(delegatesByCompany).toBeInTheDocument();
      const delegationsOfTheCompany = queryByTestId('delegationsOfTheCompany');
      expect(delegationsOfTheCompany).not.toBeInTheDocument();
    });
  });

  it('user with groups', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, arrayOfDelegates);
    const { container, queryByTestId, getByTestId } = render(
      <MemoryRouter initialEntries={[routes.DELEGHEACARICO]}>
        <Routes>
          <Route element={<Deleghe />}>
            <Route path={routes.DELEGHEACARICO} element={<DelegationsOfTheCompany />} />
            <Route path={routes.DELEGATI} element={<DelegatesByCompany />} />
          </Route>
        </Routes>
      </MemoryRouter>,
      {
        navigationRouter: 'none',
        preloadedState: { userState: { user: { ...userResponse, hasGroup: true } } },
      }
    );
    expect(container).not.toHaveTextContent(/deleghe.tab_delegati/i);
    expect(container).not.toHaveTextContent(/deleghe.tab_deleghe/i);
    const delegatesByCompany = queryByTestId('delegatesByCompany');
    expect(delegatesByCompany).not.toBeInTheDocument();
    const delegationsOfTheCompany = getByTestId('delegationsOfTheCompany');
    expect(delegationsOfTheCompany).toBeInTheDocument();
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.post).toHaveLength(1);
    });
  });
});
