import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { createMatchMedia } from '@pagopa-pn/pn-commons/src/test-utils';

import { RenderResult, fireEvent, render, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import {
  DELEGATIONS_BY_DELEGATE,
  DELEGATIONS_BY_DELEGATOR,
} from '../../api/delegations/delegations.routes';
import { GET_GROUPS } from '../../api/external-registries/external-registries-routes';
import DelegatesByCompany from '../../component/Deleghe/DelegatesByCompany';
import DelegationsOfTheCompany from '../../component/Deleghe/DelegationsOfTheCompany';
import * as routes from '../../navigation/routes.const';
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
  const original = window.matchMedia;
  let result: RenderResult;
  let mock: MockAdapter;

  beforeAll(() => {
    window.matchMedia = createMatchMedia(800);
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    window.matchMedia = original;
    mock.restore();
  });

  it('renders deleghe page', () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, []);
    mock.onPost(DELEGATIONS_BY_DELEGATE({ size: 10 })).reply(200, {
      resultsPage: [],
      nextPagesKey: [],
      moreResult: false,
    });
    mock.onGet(GET_GROUPS()).reply(200, []);
    result = render(
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
  });

  it('test changing tab', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, []);
    mock.onPost(DELEGATIONS_BY_DELEGATE({ size: 10 })).reply(200, {
      resultsPage: [],
      nextPagesKey: [],
      moreResult: false,
    });
    mock.onGet(GET_GROUPS()).reply(200, []);
    result = render(
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
  });
});
